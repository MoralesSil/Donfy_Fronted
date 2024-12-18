import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { Users } from '../models/Users';
import { SaldoXusuarioDTO } from '../models/SaldoXusuarioDTO';
import { DonanteXFechaDTO } from '../models/DonanteXFechaDTO';
const base_url = environment.base

const base_url2 = environment.base

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private url = `${base_url}/Users`;
  private url2 = `${base_url2}`;

  private listaCambio = new Subject<Users[]>();

  constructor(private http: HttpClient) { }

  insert(u: Users) {
    return this.http.post(`${this.url2}/registrar`, u);
  }

  list() {
    return this.http.get<Users[]>(`${this.url2}/usuario`).pipe(
      map(users => {
        const seenUsernames = new Set<string>();
        return users.filter(user => {
          if (!seenUsernames.has(user.username)) {
            seenUsernames.add(user.username);
            return true;
          }
          return false;
        });
      })
    );
  }

  setList(listaNueva: Users[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`)
  }

  listId(id: number) {
    return this.http.get<Users>(`${this.url2}/${id}`)
  }

  update(u: Users) {
    return this.http.put(this.url, u);
  }

  usuario(username: string): Observable<number> {
    return this.http.get<number>(`${this.url2}/user/id/${username}`);
  }
  gusuario(username: string) {
    return this.http.get<Users>(`${this.url}/${username}`);
  }

  saldo(username: string): Observable<SaldoXusuarioDTO[]> {
    return this.http.get<SaldoXusuarioDTO[]>(
      `${this.url}/saldo?username=${username}`);
  }

  // Método para obtener usuarios con rol ONG
  getONGs(): Observable<Users[]> {
    return this.http.get<Users[]>(`${this.url}/busquedas`);
  }
  
  //Reporte Angie
  getDonanteXfecha(startDate: string, endDate: string): Observable<DonanteXFechaDTO[]> {
    return this.http.get<DonanteXFechaDTO[]>(
      `${this.url}/donantePorFecha?startDate=${startDate}&endDate=${endDate}`);
  }

  getIdByUsername(username: string): Observable<number> {
    return this.http.get<number>(`${this.url}/buscar/${username}`);
  }

}