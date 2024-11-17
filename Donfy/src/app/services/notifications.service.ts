import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
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
  getNotificationsByUser(username: String): Observable<Notification[]> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Notification[]>(`${this.url}/BuscarNotificacionesporUsernameDonador?username=${username}`);
  }
  // Método para obtener donaciones por ONG (filtrado por username)
  getNotificationsByOngUsername(ongUsername: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.url}/BuscarNotificacionesporUsernameONG?ongUsername=${ongUsername}`);
  }
}