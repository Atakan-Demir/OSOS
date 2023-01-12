import { UyeDers } from './../../models/UyeDers';
import { Ders } from './../../models/Ders';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dersler!:Ders[];
  uyeDers:Ders[] = [];
  uyeDersleri!:UyeDers[];

  constructor(
    public servis: DataService
  ) {
  }

  ngOnInit(): void {
    this.UyeDersListele(parseInt(localStorage.getItem("id")||"0"));
  }

  UyeDersListele(id :number){

    this.servis.DersListele().subscribe(d => {
      this.dersler = d;
    });
    this.servis.UyeDersListele(id).subscribe(u =>{
      this.uyeDersleri = u;

      for (let i = 0; i < this.uyeDersleri.length; i++) {
        this.servis.DersById(this.uyeDersleri[i].dersId).subscribe((u:Ders)=>{
          this.uyeDers.push(u);

          
        }) 
      }
    });
    console.log(this.uyeDers);  
  }

}

