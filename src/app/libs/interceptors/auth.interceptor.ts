import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { concatMap, Observable, of, map, catchError, throwError, tap, delay, switchMap } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import StorageHelper from '../helpers/storage.helper';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private apiS: ApiService
  ) {}

/**
 * If the request is to the mirror API, then add the authorization header to the request, and if the
 * request fails with a 401 error, then refresh the token and try again
 * @param request - HttpRequest<unknown> - The request object
 * @param {HttpHandler} next - HttpHandler - the next interceptor in the chain
 * @returns The request is being returned.
 */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    if(request.url.includes('/mirror/')){ // *Si la peticion va hacia mirror, entra, sino, regresa la peticion sin mas
      let originalReq = request // *Guardamos la peticion original por si el token expira, poder realizar la peticion cuando se tenga el nuevo token

      request = request.clone({ // *Clonamos la peticion para agregarle el Header de Authorization con nuestro Bearer token
        setHeaders: {
          Authorization: 'Bearer ' + StorageHelper.getItem('session').token
        } 
      })  

      return next.handle(request).pipe( // *Retornamos la peticion clonada que ya tiene nuestro token en la cabecera
        catchError(err => { // *Si hay un error lo cachamos
          if(err instanceof HttpErrorResponse && err.status === 401){ // *Validamos si el error es de tipo HttpErrorResponse y si lo es que su status sea 401, esto quiere decir que el token expiro
            
            return this.expiredHandler(originalReq, next) // *Llamamos la funcion expiredHandler para pedir un nuevo Token pasandole nuestra peticion original y el next para que una vez obtenido el nuevo token, pueda mandar la peticion original que fue rechazada por que el token expiro
          }

          return throwError(() => err) // *Si no entra en la condicional, retornamos el error que haya pasado
        })
      )

    }

    return next.handle(request) // *Retornamos la peticion que no fue hacia /mirror/
  }


/**
 * If the token is expired, refresh the token and then send the original request with the new token
 * @param originalReq - The original request that was intercepted by the interceptor.
 * @param {HttpHandler} next - HttpHandler - This is the next handler in the chain.
 * @returns The return is a pipe that is being switched to a map.
 */
  private expiredHandler(originalReq: HttpRequest<unknown>, next: HttpHandler){

    return this.apiS.refreshToken().pipe( // *Hacemos le peticion al servicio refreshToken

      switchMap(res => { // ?Porque switchMap: espera que retornes un Observable, le dice al catchError que lo invoco que le va a retornar el Observable a su flujo, que en este caso es la peticion original con el nuevo token, como ya es una respuesta 200, ya no estamos en el catchError si no a su mismo nivel por lo que la respuesta de la peticion si llega al componente
        
        StorageHelper.setItem('session', res) // *Llamamos nuestro StorageHelper para guardar el nuevo objeto que nos trae refreshToken

        originalReq = originalReq.clone({ // *Clonamos la peticion original para agregarle el nuevo token a la cabecera
          setHeaders: {
            Authorization: 'Bearer ' + StorageHelper.getItem('session').token
          }
        })

        return next.handle(originalReq) // *Retornamos la peticion original con el nuevo token 
      })
    )
    
  }
}
