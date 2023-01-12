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
  dersId: number = 0;
  secDers: Ders = new Ders();
  sinavlar!: Sinav[];
  dersler!: Ders[];
  uyeDers:Ders[] = [];
  modalBaslik: string = "";
  secUye!: Uye;
  sonuc: Sonuc = new Sonuc();
  frm: FormGroup = new FormGroup({
    id: new FormControl(),
    adsoyad: new FormControl(),
    mail: new FormControl(),
    admin: new FormControl(),
    parola: new FormControl()
  });

  dersFrm: FormGroup = new FormGroup({
    id: new FormControl(),
    uyeId: new FormControl(),
    dersId: new FormControl()
  });
  constructor(
    public servis: DataService,
    public toast: MytoastService
  ) { }

  ngOnInit() {
    this.UyeListele();
    this.DersListele();

  }

  DersEkleDuzenleModal(uye: Uye ,el: HTMLElement) {
    this.secUye = uye;
    this.dersFrm.reset();
    this.dersFrm.patchValue({ uyeId : uye.id});
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = uye.adsoyad + " kullanıcısının dersleri";
    this.UyeDersListele(this.secUye.id);
    this.modal.show();
  }
  UyeDersListele(id :number){
    /*this.servis.UyeDersListele(id).subscribe(u =>{
      this.uyeDersleri = u;
      for (let i = 0; i < this.uyeDersleri.length; i++) {
        console.log(this.uyeDersleri[i].dersId);
        
      }
    });*/     
    
      this.servis.DersListele().subscribe(d => {
        this.dersler = d;
      });
      this.servis.UyeDersListele(id).subscribe(u =>{
        this.uyeDersleri = u;
        
          
        this.uyeDers = [];
        for (let i = 0; i < this.uyeDersleri.length; i++) {
          this.servis.DersById(this.uyeDersleri[i].dersId).subscribe((u:Ders)=>{
            this.uyeDers.push(u);

            
          }) 
        
      }
      });
      console.log(this.uyeDers);
  }
  UyeDersSil(ud:UyeDers) {
    this.servis.UyeDersSil(ud.id).subscribe(d => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = "Üyenin Dersi Silindi";
      this.toast.ToastUygula(this.sonuc);
      this.UyeDersListele(ud.uyeId);
      this.modal.toggle();
    });
  }
  UyeDersEkle() {
    var uyeninDersi: UyeDers = this.dersFrm.value;
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
          this.UyeDersListele(uyeninDersi.uyeId);
          this.modal.toggle();
        });
      }
    } else {
      console.log("üçüncü");
      this.servis.UyeDersDuzenle(uyeninDersi).subscribe(d => {
        this.sonuc.islem = true;
        this.sonuc.mesaj = "Üyenin Ders Düzenlendi";
        this.toast.ToastUygula(this.sonuc);
        this.UyeDersListele(uyeninDersi.uyeId);
        this.modal.toggle();
      });
    }

  }

  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.frm.patchValue({ admin: 0 });
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = "Kullanıcı Ekle";
    this.modal.show();
  }
  Duzenle(uye: Uye, el: HTMLElement) {
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
  
  UyeEkleDuzenle() {
    var uye: Uye = this.frm.value;
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
    }

  }
  UyeSil() {
    this.servis.UyeSil(this.secUye.id).subscribe(d => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = "Kullanıcı Silindi";
      this.toast.ToastUygula(this.sonuc);
      this.UyeListele();
      this.modal.toggle();
    });
  }
  DersSec(dersId: number) {
    this.dersId = dersId;
    this.DersGetir();
  }
  DersGetir() {
    this.servis.DersById(this.dersId).subscribe(d => {
      this.secDers = d;
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

  DerslerModalIsimGet(id:number){
    console.log("Çalışıyor");
    this.servis.DersById(id).subscribe(d=>{
      console.log(d);
      this.secDers  = d;
      return this.secDers.adi;
      
    }).unsubscribe();
    
  }

  DersIsimBul(id:number){
    for (let index = 0; index < this.dersler.length; index++) {
      const element = this.dersler[index];
      if (id==element.id) {
        this.dersBulAd = element.adi   
        return true;
      }             
    }
    return false;
    console.log(this.dersBulAd);
  }

}
