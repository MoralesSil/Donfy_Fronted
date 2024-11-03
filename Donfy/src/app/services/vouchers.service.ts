import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Vouchers } from '../models/Vouchers';
import { Subject } from 'rxjs';
const base_url=environment.base

@Injectable({
  providedIn: 'root'
})
export class VouchersService {
  private url = `${base_url}/vouchers`;
  private listaCambio=new Subject<Vouchers[]>();

  constructor(private http:HttpClient) { }
  list(){
    return this.http.get<Vouchers[]>(this.url)
  }

  insert(vou:Vouchers){
    return this.http.post(this.url,vou);
  }

  setList(listaNueva:Vouchers[]){
    this.listaCambio.next(listaNueva);
  }

  getList(){
    return this.listaCambio.asObservable();
  }

  listId(id:number){
    return this.http.get<Vouchers>(`${this.url}/${id}`);
  }

  delete(id:number){
    return this.http.delete(`${this.url}/${id}`);
  }

  update(vou:Vouchers){
    return this.http.put(this.url,vou);
  }

}
