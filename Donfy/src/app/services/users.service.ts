import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Users } from '../models/Users';
const base_url = environment.base

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private url = `${base_url}/Users`;
  
  private listaCambio = new Subject<Users[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Users[]>(this.url);
  }
  
  insert(u: Users) {
    return this.http.post(this.url, u);
  }

  setList(listaNueva: Users[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  delete(id:number) {
    return this.http.delete(`${this.url}/${id}`)
  }

  listId(id:number){
    return this.http.get<Users>(`${this.url}/${id}`)
  }

  update(u:Users){
    return this.http.put(this.url,u);
  }
}
