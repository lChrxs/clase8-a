import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import StorageHelper from '../../libs/helpers/storage.helper';

@Component({
  selector: 'app-one',
  templateUrl: './one.component.html',
  styleUrls: ['./one.component.scss']
})
export class OneComponent implements OnInit {

  username: string = ''
  password: string = ''

  constructor(
    public loginS: ApiService,
    private dataS: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit(){
    
    this.loginS.login(this.username, this.password).subscribe({
      next: (res => {
        StorageHelper.setItem('session', res)
        this.router.navigate(['search'])
      })
    })
  }

}
