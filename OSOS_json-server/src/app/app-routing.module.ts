import { SinavcozComponent } from './components/sinavcoz/sinavcoz.component';


import { UyeComponent } from './components/uye/uye.component';
import { SinavComponent } from './components/sinav/sinav.component';
import { DersComponent } from './components/ders/ders.component';
import { SorumakeComponent} from './components/sorumake/sorumake.component'
import { LoginComponent } from './components/login/login.component';

import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dersler',
    component: DersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sinavlar',
    component: SinavComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sinavlar/:dersId',
    component: SinavComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'kullanicilar',
    component: UyeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sorular',
    component: SorumakeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sorular/:sinavId',
    component: SorumakeComponent,
    canActivate: [AuthGuard]
  },
  {
    path : 'sinavcoz/:sinavId',
    component : SinavcozComponent,
    canActivate: [AuthGuard]
  }


  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
