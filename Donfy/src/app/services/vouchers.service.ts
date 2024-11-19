import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Vouchers } from '../models/Vouchers';
import { HttpClient } from '@angular/common/http';
const base_url = environment.base


@Injectable({
  providedIn: 'root'
})
export class VouchersService {
  private url = `${base_url}/vouchers`;
  private listaCambio=new Subject<Vouchers[]>();

  constructor(private http: HttpClient) { }
  
  list(){
    return this.http.get<Vouchers[]>(this.url);
  }
  insert(vc:Vouchers){
    return this.http.post(this.url,vc);
  }
  setList(listaNueva:Vouchers[]){
    this.listaCambio.next(listaNueva);
  }
  getList(){
    return this.listaCambio.asObservable();
  }
  delete(id:number){
    return this.http.delete(`${this.url}/${id}`);
  }
  listId(id:number){
    return this.http.get<Vouchers>(`${this.url}/${id}`);
  }
  update(vc:Vouchers){
    return this.http.put(this.url,vc);
  }

  //listar vouchers por Usuario
  listByUser(userId: number) {
    return this.http.get<Vouchers[]>(`${this.url}/ListarComprobantesPorUsuario/${userId}`);
  }
  
}
