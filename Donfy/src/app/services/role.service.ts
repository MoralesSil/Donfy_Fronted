import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Role } from '../models/Role';
import { HttpClient } from '@angular/common/http';
const base_url = environment.base

const base_url2 = environment.base

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private url = `${base_url}/Role`;
  private url2 = `${base_url2}`;

  private listaCambio=new Subject<Role[]>();

  constructor(private http: HttpClient) { }

  list(){
    return this.http.get<Role[]>(this.url);
  }
  insert(ro:Role){
    return this.http.post(`${this.url2}/rol`, ro);
  }
  setList(listaNueva:Role[]){
    this.listaCambio.next(listaNueva);
  }
  getList(){
    return this.listaCambio.asObservable();
  }
  delete(id:number){
    return this.http.delete(`${this.url}/${id}`);
  }
  listId(id:number){
    return this.http.get<Role>(`${this.url}/${id}`);
  }
  update(ro:Role){
    return this.http.put(this.url,ro);
  }
}
