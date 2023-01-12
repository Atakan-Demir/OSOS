import { DataService } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    public servis: DataService
  ) { }
  ngOnInit(): void {
  }
  OturumKapat() {
    localStorage.clear();
    location.href = "/";
  }
}
