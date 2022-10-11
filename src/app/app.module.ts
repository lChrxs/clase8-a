import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OneComponent } from './components/one/one.component';
import { AuthInterceptor } from './libs/interceptors/auth.interceptor';
import { TwoComponent } from './components/two/two.component';
import { ValidatorInterceptor } from './libs/interceptors/validator.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    OneComponent,
    TwoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ValidatorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
