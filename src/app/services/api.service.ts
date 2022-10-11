import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import StorageHelper from '../libs/helpers/storage.helper';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any>{
    return this.http.post('http://ec2-18-116-97-69.us-east-2.compute.amazonaws.com:4001/api/login', {username: username, password: password})
  }

  searchPokemon(pokemon: string): Observable<any> {
    // return this.http.get('https://pokeapi.co/api/v2/pokemon/' + pokemon, { headers: {Authorization: 'Bearer ' + this.getToken()}})
    return this.http.post('http://ec2-18-116-97-69.us-east-2.compute.amazonaws.com:4001/mirror/pokemon', {endpoint: `pokemon/${pokemon}`})
  }

  // checkToken(): Observable<any>{ 
  //   console.log('checkToken token value: ', this.getKey('token'));
    
  //   return this.http.get('http://ec2-18-116-97-69.us-east-2.compute.amazonaws.com:4001/api/check', { headers: {Authorization: 'Bearer ' + this.getKey('token') }})
  // }

  // getKey(key: string): string{
    
  //   let param = JSON.parse(localStorage.getItem('session')!)
  //   // console.log('getKey', param[key]);
  //   return param[key]
  // }


  refreshToken(): Observable<any>{
    return this.http.post("http://ec2-18-116-97-69.us-east-2.compute.amazonaws.com:4001/api/refresh", {session: StorageHelper.getItem('session')})
  }

}
