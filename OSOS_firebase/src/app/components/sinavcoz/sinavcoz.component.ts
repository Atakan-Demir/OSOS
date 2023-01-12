import { Sinav } from './../../models/Sinav';
import { ActivatedRoute } from '@angular/router';
import { Secenek } from './../../models/Secenek';
import { Sorular } from './../../models/Sorular';
import { Component, OnInit } from '@angular/core';
import { QuestionService } from 'src/app/services/question.service';
import { interval } from 'rxjs';
import { DataService } from './../../services/data.service';


@Component({
  selector: 'app-sinavcoz',
  templateUrl: './sinavcoz.component.html',
  styleUrls: ['./sinavcoz.component.scss']
})
export class SinavcozComponent implements OnInit {

  public name: string = "";
  public soruListe: Sorular[] =[];
  public secenekListe: Secenek[]=[];
  public deneme: Secenek[]=[];
  public guncelSoru: number = 0;
  public points: number = 0;
  public sinavId: number = 0;
  public secSinav!: Sinav;
  counter = 80;
  dogruCevap: number = 0;
  yanlisCevap: number = 0;
  interval$: any;
  ilerleme: string = "0";
  sinavTamamlandi : boolean = false;
  constructor(
    private questionService: QuestionService,
    public servis: DataService,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe((p:any) => {
      if (p.sinavId) {
        this.sinavId = parseInt(p.sinavId);
       
      }
    })
    /*this.secSinav = this.servis.SinavBySinavSoruId(5);*/
    this.name = localStorage.getItem("adsoyad")!;
    this.getAllQuestions();
    this.startCounter();
  }
  SecenekFilitresi(liste:Secenek[]){
    console.log(this.soruListe[1])
    return liste.filter(f=> f.soruId == this.soruListe[this.guncelSoru].id);
    
  }
  getAllQuestions() {
    /*this.questionService.getQuestionJson()
      .subscribe(res => {
        this.soruListe = res.questions;
      })*/
    this.servis.SoruListeleBySinavId(this.sinavId).subscribe(s=>{
      this.soruListe= s;
      /* Soruların Soru id si servise gönderilecek*/
      for (let i = 0; i < s.length; i++) {
        this.servis.SecenekListele(s[i].id).subscribe(res=>{
          for (let j = 0; j < res.length; j++) {
            this.secenekListe.push(res[j]);
          }
          
        })
      }
      console.log("Gelen Değer :");
      console.log(this.secSinav.id);
      console.log("Sorular :");
      console.log(this.soruListe);
      console.log("Secenekler :");
      console.log(this.secenekListe);
      
    })
    
   /* this.servis.SecenekListele(2).subscribe(res=>{
      this.secenekListe = res;
      console.log(this.soruListe);
    })*/
  }
  nextQuestion() {
    this.guncelSoru++;
  }
  previousQuestion() {
    this.guncelSoru--;
  }
  answer(guncelSoruNo: number, secenek: Secenek) {

    if(guncelSoruNo === this.soruListe.length){
      this.sinavTamamlandi = true;
      this.stopCounter();
    }
    if (secenek.cevap == "1") {
      this.points += 10;
      this.dogruCevap++;
      setTimeout(() => {
        this.guncelSoru++;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);


    } else {
      setTimeout(() => {
        this.guncelSoru++;
        this.yanlisCevap++;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);

      this.points -= 10;
    }
  }
  startCounter() {
    this.interval$ = interval(1000)
      .subscribe(val => {
        this.counter--;
        if (this.counter === 0) {
          this.guncelSoru++;
          this.counter = 60;
          this.points -= 10;
        }
      });
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 600000);
  }
  stopCounter() {
    this.interval$.unsubscribe();
    this.counter = 0;
  }
  resetCounter() {
    this.stopCounter();
    this.counter = 60;
    this.startCounter();
  }
  resetQuiz() {
    this.resetCounter();
    this.getAllQuestions();
    this.points = 0;
    this.counter = 60;
    this.guncelSoru = 0;
    this.ilerleme = "0";

  }
  getProgressPercent() {
    this.ilerleme = ((this.guncelSoru / this.soruListe.length) * 100).toString();
    return this.ilerleme;

  }
}

