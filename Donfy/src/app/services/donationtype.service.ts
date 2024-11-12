import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DonationType } from '../models/DonationType';
import { Subject } from 'rxjs';

const base_url = environment.base

@Injectable({
  providedIn: 'root'
})
export class DonationtypeService {
  private url = `${base_url}/DonationType`;
  private listaCambio=new Subject<DonationType[]>();

  constructor(private http: HttpClient) { }

  list(){
    return this.http.get<DonationType[]>(this.url);
  }
  insert(dt:DonationType){
    return this.http.post(this.url,dt);
  }
  setList(listaNueva:DonationType[]){
    this.listaCambio.next(listaNueva);
  }
  getList(){
    return this.listaCambio.asObservable();
  }
  delete(id:number){
    return this.http.delete(`${this.url}/${id}`);
  }
  listId(id:number){
    return this.http.get<DonationType>(`${this.url}/${id}`);
  }
  update(dt:DonationType){
    return this.http.put(this.url,dt);
  }
}
