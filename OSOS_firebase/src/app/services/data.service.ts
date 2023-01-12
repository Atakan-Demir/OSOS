import { Secenek } from './../models/Secenek';
import { UyeDers } from './../models/UyeDers';
import { Sorular } from './../models/Sorular';
import { Sinav } from './../models/Sinav';
import { Ders } from './../models/Ders';
import { Injectable } from '@angular/core';
import { Uye } from '../models/Uye';
import { HttpClient } from '@angular/common/http';
import { collection, collectionData, deleteDoc, doc, docData, Firestore, query, setDoc, where, getDoc } from '@angular/fire/firestore';
import { concatMap, from, map, Observable, of, switchMap, take } from 'rxjs';
import { addDoc, updateDoc } from '@firebase/firestore';
import {
  Auth,
  getAuth,
  onAuthStateChanged,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  UserInfo,
} from '@angular/fire/auth';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  public apiUrl = "http://localhost:3000/";
  aktifUye = authState(this.auth);
  
  public secSinav: Sinav = new Sinav();

constructor(
  public http: HttpClient,
  public fs: Firestore,
  public auth: Auth,
  
  public storage: Storage
) { }
  KayitOl(mail: string, parola: string) {
    return from(createUserWithEmailAndPassword(this.auth, mail, parola));
  }
  OturumAc(mail: string, parola: string) {
    return from(signInWithEmailAndPassword(this.auth, mail, parola));
  }

  OturumKapat() {
    return from(this.auth.signOut());
  }
  get AktifUyeBilgi() {
    return this.aktifUye.pipe(
      switchMap((user) => {
        console.log("user");
        console.log(user);
        if (!user?.uid) {
          console.log("Boş Döndü");
          return of(null);
        }
        const ref = doc(this.fs, 'Uyeler', user?.uid);
      
        console.log("Çalıştı");
        return docData(ref) as Observable<Uye>;
      })
    );
  }
  
  /* Uye servis başla*/
  UyeListele() {
    var ref = collection(this.fs, "Uyeler");
    return collectionData(ref, { idField: 'uid' }) as Observable<Uye[]>;
  }
  UyeById(uye: Uye) {
    var ref = doc(this.fs,"Uyeler",uye.uid);
    return getDoc(ref).then((doc)=>{
      console.log(doc.data(),doc.id);
    })
  }
  UyeEkle(uye: Uye) {
    var ref = doc(this.fs, "Uyeler", uye.uid);
    return from(setDoc(ref, uye));
  }
  UyeDuzenle(uye: Uye) {
    var ref = doc(this.fs, "Uyeler", uye.uid);
    return from(updateDoc(ref, { ...uye }));
  }
  UyeSil(uye: Uye) {
    var ref = doc(this.fs, "Uyeler", uye.uid);
    return deleteDoc(ref);
  }
  /* Uye servis bitiş*/

  /* ders servis başla*/
  DersListele() {
    var ref = collection(this.fs, "Dersler");
    return collectionData(ref, { idField: 'dersId' }) as Observable<Ders[]>;
  }
  DersById(uyeDers:UyeDers){
    var ref = collection(this.fs, "Dersler");
    return this.aktifUye.pipe(
      concatMap((user) => {
        const myQuery = query(
          ref,
          where('dersId', '==', uyeDers.dersId)
        );
        return collectionData(myQuery, { idField: 'dersId' }) as Observable<Ders[]>;
      })
    );
  }
  DersEkle(ders : Ders){
    var ref = collection(this.fs, "Dersler");
    return this.aktifUye.pipe(
      take(1),
      concatMap(() =>
        addDoc(ref, {
          adi: ders.adi,
          
        })
      ),
      map((ref) => ref.id)
    );
  }
  DersDuzenle(ders : Ders){
    var ref = doc(this.fs, "Dersler/" + ders.dersId);
    return updateDoc(ref, { ...ders });
  }
  DersSil(ders : Ders){
    var ref = doc(this.fs, "Dersler/" + ders.dersId);
    console.log(ref);
    return deleteDoc(ref);
  }
  /* ders servis bitiş*/

  /* uyeDers servis başlangıç */
  UyeDersListele(){
    /*return this.http.get<UyeDers[]>(this.apiUrl + "userlessons?uyeId=" + uyeId);*/
    var ref = collection(this.fs, "UyeDersler");
    return this.aktifUye.pipe(
      concatMap((user) => {
        const myQuery = query(
          ref,
          where('uid', '==', user?.uid)
        );
        
        return collectionData(myQuery, { idField: 'id' }) as Observable<UyeDers[]>;
        
      })
    );
  }
  UyeDersEkle(uyeders:UyeDers){
    var ref = collection(this.fs, "UyeDersler");
    return this.aktifUye.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          dersId: uyeders.dersId,
          uid:user?.uid
        })
      ),
      map((ref) => ref.id)
    );
  }
  UyeDersDuzenle(uyeders:UyeDers){
    var ref = doc(this.fs, "UyeDersler/" + uyeders.id);
    return updateDoc(ref, { ...uyeders });
  }
  UyeDersSil(uyeders:UyeDers){
    var ref = doc(this.fs, "UyeDersler/" + uyeders.id);
    console.log(ref);
    return deleteDoc(ref);
  }
  /* uyeDers servis başlangıç */

  /* Sinav servis başla*/
  SinavListele(){
    var ref = collection(this.fs, "Sinavlar");
    return collectionData(ref, { idField: 'id' }) as Observable<Sinav[]>;
  }
  SinavListeleByDersId(dersId : string){
    var ref = collection(this.fs, "Dersler");
    return this.aktifUye.pipe(
      concatMap((user) => {
        const myQuery = query(
          ref,
          where('sinavDersId', '==', dersId)
        );
        return collectionData(myQuery, { idField: 'dersId' }) as Observable<Sinav[]>;
      })
    );
  }
  SinavById(id : string){
    var ref = collection(this.fs, "Sinavlar");
    return this.aktifUye.pipe(
      concatMap((user) => {
        const myQuery = query(
          ref,
          where('id', '==', id)
        );
        return collectionData(myQuery, { idField: 'id' }) as Observable<Sinav[]>;
      })
    );
  }
  SinavBySinavSoruId(id:number){
    var ref = collection(this.fs, "Dersler");
    return this.aktifUye.pipe(
      concatMap((user) => {
        const myQuery = query(
          ref,
          where('sinavSoruId', '==', id)
        );
        return collectionData(myQuery, { idField: 'dersId' }) as Observable<Sinav[]>;
      })
    );
  }
  SinavEkle(sinav:Sinav){
    var ref = collection(this.fs, "Sinavlar");
    return this.aktifUye.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          sinavAdi: sinav.sinavAdi,
          sinavDersId: sinav.sinavDersId,
          sinavSoruId: sinav.sinavSoruId,
          sinavSuresi: sinav.sinavSuresi,
          soruSayisi: sinav.soruSayisi,
          sinavId: sinav.id 
        })
      ),
      map((ref) => ref.id)
    );
  }
  SinavDuzenle(sinav:Sinav){
    var ref = doc(this.fs, "Sinavlar/" + sinav.id);
    return updateDoc(ref, { ...sinav });
  }
  SinavSil(sinav:Sinav){
    var ref = doc(this.fs, "Sinavlar/" + sinav.id);
    console.log(ref);
    return deleteDoc(ref);
  }
  /* Sinav servis bitiş*/

  /* Soru servis başla*/
  SoruListele(){
    return this.http.get<Sorular[]>(this.apiUrl + "questions");
  }
  SoruListeleBySinavId(sinavSoruId : number){
    return this.http.get<Sorular[]>(this.apiUrl + "questions/" + "?soruSinavId=" +sinavSoruId);
  }
  SoruById(id : number){
    return this.http.get<Sorular>(this.apiUrl + "questions/" + id);
  }
  SoruEkle(soru:Sorular){
    return this.http.post(this.apiUrl + "questions/", soru);
  }
  SoruDuzenle(soru:Sorular){
    return this.http.put(this.apiUrl + "questions/" + soru.id,soru);
  }
  SoruSil(id:number){
    return this.http.delete(this.apiUrl + "questions/" + id)
  }
  /* Soru servis bitiş */

  /* Seçenek servis başla*/
  SecenekListele(soruId:number){
    return this.http.get<Secenek[]>(this.apiUrl + "options?soruId=" + soruId);
  }
  SecenekEkle(secenek:Secenek){
    return this.http.post(this.apiUrl + "options/", secenek);
  }
  SecenekDuzenle(secenek:Secenek){
    return this.http.put(this.apiUrl + "options/" + secenek.id,secenek);
  }
  SecenekSil(id:number){
    return this.http.delete(this.apiUrl + "options/" + id);
  }
  /* Seçenek servis bitiş*/
}
