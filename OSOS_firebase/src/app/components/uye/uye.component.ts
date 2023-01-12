import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { UyeDers } from './../../models/UyeDers';
import { Sinav } from './../../models/Sinav';
import { Ders } from './../../models/Ders';
import { Uye } from './../../models/Uye';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { Sonuc } from 'src/app/models/Sonuc';
import { DataService } from 'src/app/services/data.service';
import { MytoastService } from 'src/app/services/mytoast.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-uye',
  templateUrl: './uye.component.html',
  styleUrls: ['./uye.component.scss']
})
export class UyeComponent implements OnInit {
  uyeler!: Uye[];
  modal!: Modal;
  uyeDersleri!:UyeDers[];
  secUyeDers!: UyeDers;
  dersBulAd: string = "";
  dersId!: string;
  secDers: Ders = new Ders();
  secDersler!: Ders[];
  sinavlar!: Sinav[];
  dersler!: Ders[];

  modalBaslik: string = "";
  secUye!: Uye;
  sonuc: Sonuc = new Sonuc();
  frm: FormGroup = new FormGroup({
    uid: new FormControl(),
    adsoyad: new FormControl(),
    mail: new FormControl(),
    admin: new FormControl(),
    parola: new FormControl()
  });

  dersFrm: FormGroup = new FormGroup({
    id: new FormControl(),
    uid: new FormControl(),
    dersId: new FormControl()
  });
  constructor(
    public servis: DataService,
    public toast: MytoastService,
    public htoast: HotToastService,
    public router: Router
  ) { }

  ngOnInit() {
    this.UyeListele();
    this.DersListele();
    this.servis.UyeDersListele();
    
    
  }

  DersEkleDuzenleModal(uye: Uye ,el: HTMLElement) {
    this.secUye = uye;
    this.dersFrm.reset();
    this.dersFrm.patchValue({ uyeId : uye.uid});
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = uye.adsoyad + " kullanıcısının dersleri";
    this.UyeDersListele();
    this.modal.show();
  }
  UyeDersListele(){
    this.servis.UyeDersListele().subscribe(u =>{
      this.uyeDersleri = u;
      for (let i = 0; i < this.uyeDersleri.length; i++) {
        console.log(this.uyeDersleri[i].dersId);
        
      }
    });
  }
  UyeDersSil(ud:UyeDers) {
    this.servis.UyeDersSil(ud).then(d => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = "Üyenin Dersi Silindi";
      this.toast.ToastUygula(this.sonuc);
      this.UyeDersListele();
      this.modal.toggle();
    });
  }
  UyeDersEkle() {
    this.servis.UyeDersEkle(this.dersFrm.value)
    .pipe(
      this.htoast.observe({
        success: 'Görev Eklendi',
        loading: 'Görev Ekleniyor...',
        error: 'hata'
      })
    )
    .subscribe();
    /*var uyeninDersi: UyeDers = this.dersFrm.value;
    console.log(uyeninDersi);
    if (!uyeninDersi.id) {
      var filtre = this.uyeDersleri.filter(s => s.dersId == uyeninDersi.dersId);
      if (filtre.length > 0) {
        console.log("birinci");
        this.sonuc.islem = false;
        this.sonuc.mesaj = "Girilen Ders üyeye Kayıtlıdır!";
        this.toast.ToastUygula(this.sonuc);
      } else {
        console.log("ikinci");
        this.servis.UyeDersEkle(uyeninDersi).subscribe(d => {
          this.sonuc.islem = true;
          this.sonuc.mesaj = "Üyeye Ders Eklendi";
          this.toast.ToastUygula(this.sonuc);
          this.UyeDersListele();
          this.modal.toggle();
        });
      }
    } else {
      console.log("üçüncü");
      this.servis.UyeDersDuzenle(uyeninDersi).then(d => {
        this.sonuc.islem = true;
        this.sonuc.mesaj = "Üyenin Ders Düzenlendi";
        this.toast.ToastUygula(this.sonuc);
        this.UyeDersListele();
        this.modal.toggle();
      });
    }*/

  }

  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.frm.patchValue({ admin: 0 });
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = "Kullanıcı Ekle";
    this.modal.show();
  }
  Duzenle(uye: Uye, el: HTMLElement) {
    var gelen = this.servis.UyeById(uye);
    console.log(gelen)
    this.frm.patchValue(uye);
    this.modalBaslik = "Kullanıcı Düzenle";
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  Sil(uye: Uye, el: HTMLElement) {
    this.secUye = uye;
    this.modalBaslik = "Kullanıcı Sil"; 
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  UyeListele() {
    this.servis.UyeListele().subscribe(d => {
      this.uyeler = d;
      
    });
  }
  UyeOl() {
    var uye: Uye = this.frm.value;
    let mail = uye.mail;
    let admin = uye.admin;
    let adsoyad = uye.adsoyad;
    let parola = uye.parola;
    this.servis.
      KayitOl(uye.mail, uye.parola)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.servis.UyeEkle({ uid, mail, adsoyad, parola, admin })
        ),
        this.htoast.observe({
          success: 'Tebrikler Kayıt Yapıldı',
          loading: 'Kayıt Yapılıyor...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {
        
      });
    this.modal.toggle();
  }
  UyeDuzenle() {
    
    this.secUye = this.frm.value;
    
    this.servis
      .UyeDuzenle(this.secUye)
      .pipe(
        this.htoast.observe({
          loading: 'Güncelleniyor',
          success: 'Güncellendi',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe();
    
    /*var uye: Uye = this.frm.value;
    console.log(uye);
    if (!uye.id) {
      var filtre = this.uyeler.filter(s => s.mail == uye.mail);
      if (filtre.length > 0) {
        this.sonuc.islem = false;
        this.sonuc.mesaj = "Girilen E-Posta Adresi Kayıtlıdır!";
        this.toast.ToastUygula(this.sonuc);
      } else {
        this.servis.UyeEkle(uye).subscribe(d => {
          this.sonuc.islem = true;
          this.sonuc.mesaj = "Kullanıcı Eklendi";
          this.toast.ToastUygula(this.sonuc);
          this.UyeListele();
          this.modal.toggle();
        });
      }
    } else {
      this.servis.UyeDuzenle(uye).subscribe(d => {
        this.sonuc.islem = true;
        this.sonuc.mesaj = "Kullanıcı Düzenlendi";
        this.toast.ToastUygula(this.sonuc);
        this.UyeListele();
        this.modal.toggle();
      });
    }*/

  }
  UyeSil() {
    this.servis.UyeSil(this.secUye).then(() => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = "Kullanıcı Silindi";
      this.toast.ToastUygula(this.sonuc);
      this.UyeListele();
      this.modal.toggle();
    });
  }
  DersSec(dersId: string) {
    this.dersId = dersId;
    this.DersGetir();
  }
  DersGetir() {
    this.servis.DersById(this.secUyeDers).subscribe(d => {
      this.secDersler = d;
      this.SinavListele();
    });
  }
  SinavListele() {
    this.servis.SinavListeleByDersId(this.dersId).subscribe(d => {
      this.sinavlar = d;
    });
  }
  DersListele() {
    this.servis.DersListele().subscribe(d => {
      this.dersler = d;
      
    });

  }
  ModalDersGetir(uyeDers:UyeDers){
    this.servis.DersById(uyeDers).subscribe((d)=>{
      this.secDersler= d;
      console.log(this.secDersler)
    });
  }
  

  DersIsimBul(id:string){
    for (let index = 0; index < this.dersler.length; index++) {
      const element = this.dersler[index];
      if (id==element.dersId) {
        this.dersBulAd = element.adi   
        return true;
      }             
    }
    return false;
    console.log(this.dersBulAd);
  }

}
