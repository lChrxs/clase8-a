import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public localStorage$!: Observable<any>

  session$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined)

  constructor() { 
    this.localStorage$ = this.session$.pipe(
      tap((session) => {
        console.log('data service: ' ,session);

        if(session){
          localStorage.setItem('session', JSON.stringify(session))
        }
      })
    )

    this.localStorage$.subscribe()
  }
}
