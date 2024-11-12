import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Notifications } from '../models/Notifications';

const base_url = environment.base

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private url = `${base_url}/Notifications`

  private listaCambio = new Subject<Notifications[]>();

  constructor(private http:HttpClient) { }

  list(){
    return this.http.get<Notifications[]>(this.url)
  }

  insert(nft: Notifications){
    return this.http.post(this.url,nft);
  }

  setList(listaNueva: Notifications[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  delete(id:number) {
    return this.http.delete(`${this.url}/${id}`)
  }

  listId(id:number){
    return this.http.get<Notifications>(`${this.url}/${id}`)
  }

  update(nft:Notifications){
    return this.http.put(this.url,nft);
  }
}