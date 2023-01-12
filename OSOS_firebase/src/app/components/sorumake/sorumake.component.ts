import { Secenek } from './../../models/Secenek';
import { SinavComponent } from './../sinav/sinav.component';
import { Sorular } from './../../models/Sorular';
import { ActivatedRoute } from '@angular/router';
import { Sonuc } from './../../models/Sonuc';
import { MytoastService } from './../../services/mytoast.service';
import { Sinav } from './../../models/Sinav';
import { DataService } from './../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-sorumake',
  templateUrl: './sorumake.component.html',
  styleUrls: ['./sorumake.component.scss']
})
export class SorumakeComponent implements OnInit { 
  bayrak = true;
  sorular!: Sorular[];
  sinavlar!: Sinav[];
  secenekler!: Secenek[];
  modal!: Modal;
  modalBaslik: string = "";
  secSoru: Sorular = new Sorular();
  sinavId: string = "";
  secSinav: Sinav = new Sinav();
  sonuc: Sonuc = new Sonuc();
  frm: FormGroup = new FormGroup({
    id: new FormControl(),
    soru: new FormControl(),
    soruSinavId: new FormControl()
  });
  secFrm: FormGroup = new FormGroup({
    id: new FormControl(),
    soruId: new FormControl(),
    secenek: new FormControl(),
    cevap: new FormControl()
  });
  constructor(
    public servis: DataService,
    public toast: MytoastService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((p: any) => {
      if (p.sinavId) {
        this.sinavId = p.sinavId;
        this.SinavGetir();
        this.SoruListele();
      }    
    });
    this.SinavListele();
    
  }
  Bayrak(){
    if (this.bayrak) {
      this.bayrak = false;
    } else {
      this.bayrak = true;
    }
  }
  SecenekSil(s:Secenek) {
    this.servis.SecenekSil(s.id).subscribe(d => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = "Secenek Silindi";
      this.toast.ToastUygula(this.sonuc);
      this.SecenekListele(s.soruId);

    });
  }
  SecenekListele(id : number){
    this.servis.SecenekListele(id).subscribe(d => {
      this.secenekler = d;
      console.log(this.secenekler);
    });
  }
  edit(s:Secenek){
    this.secFrm.reset();
    this.secFrm.patchValue({
      id: s.id,
      soruId: s.soruId,
      secenek: s.secenek,
      cevap: s.cevap
    });

  }
  SecenekEkleDuzenle() {
    var sec: Secenek = this.secFrm.value
    
    if (!sec.id) {
      console.log("birinci");
      var filtre = this.secenekler.filter(s => s.secenek == sec.secenek);
      if (filtre.length > 0 || null) {
        console.log("ikinci");
        this.sonuc.islem = false;
        this.sonuc.mesaj = "Girilen Secenek Kayıtlıdır!";
        this.toast.ToastUygula(this.sonuc);

      } else {
        console.log("üçüncü");
        this.servis.SecenekEkle(sec).subscribe(d => {
          this.sonuc.islem = true;
          this.sonuc.mesaj = "Secenek Eklendi";
          this.toast.ToastUygula(this.sonuc);
          this.SecenekListele(sec.soruId);

        });
      }
    } else {
      console.log("dördüncü");
      this.servis.SecenekDuzenle(sec).subscribe(d => {
        this.sonuc.islem = true;
        this.sonuc.mesaj = "Secenek Düzenlendi";
        this.toast.ToastUygula(this.sonuc);
        this.SecenekListele(sec.soruId);
      });
    }

  }
  SecenekEkleDuzenleModal(soru: Sorular, el: HTMLElement) {
    this.secFrm.reset();
    this.secFrm.patchValue({
      soruId: soru.id
    });
    this.secSoru = soru;
    this.SecenekListele(soru.id);
    this.modalBaslik = "Seçenek Ekle-Düzenle";
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  SinavSec(sinavId: string) {
    this.sinavId = sinavId;
    this.SinavGetir();

  }

  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.frm.patchValue({
      sinavdersId: this.sinavId
    });
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = "Soru Ekle";
    this.modal.show();
  }
  Duzenle(soru: Sorular, el: HTMLElement) {
    this.frm.patchValue(soru);
    this.modalBaslik = "Soru Düzenle";
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  Sil(soru: Sorular, el: HTMLElement) {
    this.secSoru = soru;
    this.modalBaslik = "Soru Sil";
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  SoruListele() {
    /*this.servis.SoruListeleBySinavId(this.secSinav.sinavSoruId)*/
    this.servis.SoruListeleBySinavId(1).subscribe(d => {
      this.sorular = d;
      console.log(d);
    });
  }
  SinavListele() {
    this.servis.SinavListele().subscribe(d => {
      this.sinavlar = d;
    });
  }
  SinavGetir() {
    this.servis.SinavById(this.sinavId).subscribe(d => {
      this.secSinav = d[0];
      this.SoruListele();
    });
  }
  SoruEkleDuzenle() {
    var soru: Sorular = this.frm.value
    
    if (!soru.id) {
      var filtre = this.sorular.filter(s => s.soru == soru.soru);
      if (filtre.length > 0) {
        this.sonuc.islem = false;
        this.sonuc.mesaj = "Girilen Soru Kayıtlıdır!";
        this.toast.ToastUygula(this.sonuc);
      } else {
        
        this.servis.SoruEkle(soru).subscribe(d => {
          this.sonuc.islem = true;
          this.sonuc.mesaj = "Soru Eklendi";
          this.toast.ToastUygula(this.sonuc);
          this.SoruListele();
          this.modal.toggle();
        });
      }
    } else {
      
      this.servis.SoruDuzenle(soru).subscribe(d => {
        this.sonuc.islem = true;
        this.sonuc.mesaj = "Soru Düzenlendi";
        this.toast.ToastUygula(this.sonuc);
        this.SoruListele();
        this.modal.toggle();
      });
    }

  }
  SoruSil() {
    this.servis.SoruSil(this.secSoru.id).subscribe(d => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = "Soru Silindi";
      this.toast.ToastUygula(this.sonuc);
      this.SoruListele();
      this.modal.toggle();
    });
  }
}
