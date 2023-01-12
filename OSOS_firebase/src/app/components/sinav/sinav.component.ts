import { UyeDers } from './../../models/UyeDers';
import { ActivatedRoute } from '@angular/router';
import { Ders } from './../../models/Ders';
import { Sonuc } from './../../models/Sonuc';
import { MytoastService } from './../../services/mytoast.service';
import { Sinav } from './../../models/Sinav';
import { DataService } from './../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-sinav',
  templateUrl: './sinav.component.html',
  styleUrls: ['./sinav.component.scss'] 
})
export class SinavComponent implements OnInit {

  sinavlar!: Sinav[];
  dersler!: Ders[];
  modal!: Modal;
  uyeDers!:UyeDers;
  modalBaslik: string = "";
  secSinav: Sinav = new Sinav();
  dersId: string = "";
  secDers: Ders = new Ders();
  sonuc: Sonuc = new Sonuc();
  frm: FormGroup = new FormGroup({
    id: new FormControl(),
    sinavAdi: new FormControl(),
    sinavSuresi: new FormControl(),
    soruSayisi: new FormControl(),
    sinavDersId: new FormControl(),
    sinavSoruId: new FormControl(),
  });
  constructor(
    public servis: DataService,
    public toast: MytoastService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((p: any) => {
      if (p.dersId) {
        this.dersId = p.dersId;
        this.DersGetir();
        this.SinavListele();
      }    
    });
    this.DersListele();
    
  }
  DersSec(dersId: string) {
    this.dersId = dersId;
    this.DersGetir();

  }

  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.frm.patchValue({
      sinavdersId: this.dersId
    });
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = "Sınav Ekle";
    this.modal.show();
  }
  Duzenle(sinav: Sinav, el: HTMLElement) {
    this.frm.patchValue(sinav);
    this.modalBaslik = "Sınav Düzenle";
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  Sil(sinav: Sinav, el: HTMLElement) {
    this.secSinav = sinav;
    this.modalBaslik = "Sınav Sil";
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
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
  DersGetir() {
    this.servis.DersById(this.uyeDers).subscribe(d => {
      this.secDers = d[0];
      this.SinavListele();
    });
  }
  SinavEkleDuzenle() {
    var sinav: Sinav = this.frm.value
    
    if (!sinav.id) {
      var filtre = this.sinavlar.filter(s => s.sinavAdi == sinav.sinavAdi);
      if (filtre.length > 0) {
        this.sonuc.islem = false;
        this.sonuc.mesaj = "Girilen Sinav Adı Kayıtlıdır!";
        this.toast.ToastUygula(this.sonuc);
      } else {
        
        this.servis.SinavEkle(sinav).subscribe(d => {
          this.sonuc.islem = true;
          this.sonuc.mesaj = "Sinav Eklendi";
          this.toast.ToastUygula(this.sonuc);
          this.SinavListele();
          this.modal.toggle();
        });
      }
    } else {
      
      this.servis.SinavDuzenle(sinav).then(d => {
        this.sonuc.islem = true;
        this.sonuc.mesaj = "Sınav Düzenlendi";
        this.toast.ToastUygula(this.sonuc);
        this.SinavListele();
        this.modal.toggle();
      });
    }

  }
  SinavSil() {
    this.servis.SinavSil(this.secSinav).then(d => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = "Sinav Silindi";
      this.toast.ToastUygula(this.sonuc);
      this.SinavListele();
      this.modal.toggle();
    });
  }
}
