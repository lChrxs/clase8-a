import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-two',
  templateUrl: './two.component.html',
  styleUrls: ['./two.component.scss']
})
export class TwoComponent implements OnInit {

  pokemon$!: Observable<any>
  pokemon: string = ''

  constructor(public apiS: ApiService) { 
    this.pokemon$ = this.apiS.searchPokemon('ditto').pipe(
      tap(console.log)
    
    )
  }

  ngOnInit(): void { }
  
  onChange(){
    this.pokemon$ = this.apiS.searchPokemon(this.pokemon).pipe(
      tap(console.log)
    )
    
    
  }

}
