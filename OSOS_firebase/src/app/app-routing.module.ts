import { SinavcozComponent } from './components/sinavcoz/sinavcoz.component';


import { UyeComponent } from './components/uye/uye.component';
import { SinavComponent } from './components/sinav/sinav.component';
import { DersComponent } from './components/ders/ders.component';
import { SorumakeComponent} from './components/sorumake/sorumake.component'
import { LoginComponent } from './components/login/login.component';

import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['']);
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    ...canActivate(redirectToLogin),
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectToHome),
  },
  {
    path: 'dersler',
    component: DersComponent,
    ...canActivate(redirectToLogin),
    
  },
  {
    path: 'sinavlar',
    component: SinavComponent,
    ...canActivate(redirectToLogin),
  },
  {
    path: 'sinavlar/:dersId',
    component: SinavComponent,
    ...canActivate(redirectToLogin),
    
  },
  {
    path: 'kullanicilar',
    component: UyeComponent,
    ...canActivate(redirectToLogin),
    
  },
  {
    path: 'sorular',
    component: SorumakeComponent,
    ...canActivate(redirectToLogin),
    
  },
  {
    path: 'sorular/:sinavId',
    component: SorumakeComponent,
    ...canActivate(redirectToLogin),
    
  },
  {
    path : 'sinavcoz/:sinavId',
    component : SinavcozComponent,
    ...canActivate(redirectToLogin),
    
  }


  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
