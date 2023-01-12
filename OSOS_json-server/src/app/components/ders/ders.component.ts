import { Sonuc } from './../../models/Sonuc';
import { MytoastService } from './../../services/mytoast.service';
import { Ders } from './../../models/Ders';
import { DataService } from './../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-ders',
  templateUrl: './ders.component.html',
  styleUrls: ['./ders.component.scss']
})
export class DersComponent implements OnInit {
  dersler!: Ders[];
  modal!: Modal;
  modalBaslik: string = "";
  secDers!: Ders;
  sonuc: Sonuc = new Sonuc();
  frm: FormGroup = new FormGroup({
    id: new FormControl(),
    adi: new FormControl(),
    
  });
  constructor(
    public servis: DataService,
    public toast: MytoastService
  ) { }

  ngOnInit() {
    this.DersListele();
  }
  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = "Ders Ekle";
    this.modal.show();
  }
  Duzenle(ders: Ders, el: HTMLElement) {
    this.frm.patchValue(ders);
    this.modalBaslik = "Ders Düzenle";
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  Sil(ders: Ders, el: HTMLElement) {
    this.secDers = ders;
    this.modalBaslik = "Ders Sil";
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  DersListele() {
    this.servis.DersListele().subscribe(d => {
      this.dersler = d;
    });
  }
  DersEkleDuzenle() {
    var ders: Ders = this.frm.value
    
    if (!ders.id) {
      var filtre = this.dersler.filter(s => s.adi == ders.adi);
      if (filtre.length > 0) {
        this.sonuc.islem = false;
        this.sonuc.mesaj = "Girilen Ders Kayıtlıdır!";
        this.toast.ToastUygula(this.sonuc);
      } else {
        
        this.servis.DersEkle(ders).subscribe(d => {
          this.sonuc.islem = true;
          this.sonuc.mesaj = "Ders Eklendi";
          this.toast.ToastUygula(this.sonuc);
          this.DersListele();
          this.modal.toggle();
        });
      }
    } else {
      
      this.servis.DersDuzenle(ders).subscribe(d => {
        this.sonuc.islem = true;
        this.sonuc.mesaj = "Ders Düzenlendi";
        this.toast.ToastUygula(this.sonuc);
        this.DersListele();
        this.modal.toggle();
      });
    }

  }
  DersSil() {
    this.servis.DersSil(this.secDers.id).subscribe(d => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = "Ders Silindi";
      this.toast.ToastUygula(this.sonuc);
      this.DersListele();
      this.modal.toggle();
    });
  }
}
