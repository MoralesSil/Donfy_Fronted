import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Donations } from '../models/Donations';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { DonationSummaryYearONGDTO } from '../models/DonationSummaryYearONGDTO';

const base_url=environment.base

@Injectable({
  providedIn: 'root'
})
export class DonationsService {

  private url = `${base_url}/Donations`;
  private listaCambio=new Subject<Donations[]>();

  constructor(private http: HttpClient) { }
  
  list(){
    return this.http.get<Donations[]>(this.url);
  }
  insert(dnt:Donations){
    return this.http.post(this.url,dnt);
  }
  setList(listaNueva:Donations[]){
    this.listaCambio.next(listaNueva);
  }
  getList(){
    return this.listaCambio.asObservable();
  }
  delete(id:number){
    return this.http.delete(`${this.url}/${id}`);
  }
  listId(id:number){
    return this.http.get<Donations>(`${this.url}/${id}`);
  }
  update(dnt:Donations){
    return this.http.put(this.url,dnt);
  }
  geSumaOngYear(year: number): Observable<DonationSummaryYearONGDTO[]> {
    return this.http.get<DonationSummaryYearONGDTO[]>(
      `${this.url}/MontoAnualporONG?year=${year}`);
  }
}