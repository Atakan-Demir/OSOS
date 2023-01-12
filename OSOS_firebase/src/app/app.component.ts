import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  uye = this.servis.AktifUyeBilgi;
  
  constructor(
    public servis: DataService,
    public router: Router
  ) { }
  ngOnInit(): void {
    console.log("UYEEEEEE");
    console.log(this.uye);
  }
  OturumKapat() {
    this.servis.OturumKapat().subscribe(() => {
      this.router.navigate(['login']);
    });
  }
}
