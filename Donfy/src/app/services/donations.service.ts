import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Donations } from '../models/Donations';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

const base_url = environment.base

@Injectable({
  providedIn: 'root'
})
export class DonationsService {

  private url = `${base_url}/Donations`;
  private listaCambio = new Subject<Donations[]>();

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Donations[]>(this.url);
  }
  insert(dnt: Donations) {
    return this.http.post(this.url, dnt);
  }
  setList(listaNueva: Donations[]) {
    this.listaCambio.next(listaNueva);
  }
  getList() {
    return this.listaCambio.asObservable();
  }
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
  listId(id: number) {
    return this.http.get<Donations>(`${this.url}/${id}`);
  }
  update(dnt: Donations) {
    return this.http.put(this.url, dnt);
  }
  getDonationsByUser(username: String): Observable<Donations[]> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Donations[]>(`${this.url}/DonativosPorDonador?username=${username}`, { headers });
  }
  // Método para obtener donaciones por ONG (filtrado por username)
  getDonationsByOngUsername(ongUsername: string): Observable<Donations[]> {
    return this.http.get<Donations[]>(`${this.url}/FiltrarDonativosPorONG?ongUsername=${ongUsername}`);
  }
  // Método para actualizar el estado de eliminado a true
  markAsDeleted(id: number): Observable<void> {
    return this.http.put<void>(`${this.url}/FiltrarDonativosActivos/${id}`, {});
  }
}