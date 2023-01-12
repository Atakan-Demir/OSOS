import { ChangeBgDirective } from './change-bg.directive';
import { SinavcozComponent } from './components/sinavcoz/sinavcoz.component';
import { SorumakeComponent } from './components/sorumake/sorumake.component';
import { RouterModule } from '@angular/router';

import { UyeComponent } from './components/uye/uye.component';
import { SinavComponent } from './components/sinav/sinav.component';
import { DersComponent } from './components/ders/ders.component';

import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { MytoastService } from './services/mytoast.service';
import { DataService } from 'src/app/services/data.service';

import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HotToastModule } from '@ngneat/hot-toast';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DersComponent,
    SinavComponent,
    UyeComponent,
    SorumakeComponent,
    SinavcozComponent,
    ChangeBgDirective


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    HotToastModule.forRoot(),
    RouterModule
  ],
  providers: [DataService, MytoastService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
