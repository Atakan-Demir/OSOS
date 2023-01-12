import { HotToastService } from '@ngneat/hot-toast';
import { Sonuc } from './../../models/Sonuc';
import { MytoastService } from './../../services/mytoast.service';
import { Uye } from './../../models/Uye';
import { DataService } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    public dataServis: DataService,
    public toast: MytoastService,
    public htoast: HotToastService,
    public router: Router 
  ) { }

  ngOnInit() {
  }
  OturumAc(mail: string, parola: string) {
    this.dataServis.OturumAc(mail, parola)
      .pipe(
        this.htoast.observe({
          success: 'Oturum Açıldı',
          loading: 'Oturum Açılıyor...',
          error: ({ message }) => `${message}`
        })
      )
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }
}
