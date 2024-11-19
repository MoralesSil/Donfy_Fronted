import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Donations } from '../models/Donations';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { TrendsDonationsDTO } from '../models/TrendsDonationsDTO';
import { DonationSummaryYearONGDTO } from '../models/DonationSummaryYearONGDTO';
import { DonationStatisticsDTO } from '../models/DonationStatisticsDTO';
import { DonationSummaryDTO } from '../models/DonationSummaryDTO';
import { LoginService } from './login.service';
import { DonationforTypemothDTO } from '../models/DonationforTypemothDTO';

const base_url = environment.base

@Injectable({
  providedIn: 'root'
})
export class DonationsService {

  private url = `${base_url}/Donations`;
  private listaCambio = new Subject<Donations[]>();

  constructor(private http: HttpClient,private loginService: LoginService) {}

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
  getDonationsByUser(username: number): Observable<Donations[]> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Donations[]>(`${this.url}/Users/${username}/DonativosporUsuario`, { headers });
  }
  // Método para obtener donaciones por ONG (filtrado por username)
  getDonationsByOngUsername(ongUsername: string): Observable<Donations[]> {
    return this.http.get<Donations[]>(`${this.url}/FiltrarDonativosPorONG?ong=${ongUsername}`);
  }

  // Método para actualizar el estado de eliminado a true
  markAsDeleted(id: number): Observable<void> {
    return this.http.put<void>(`${this.url}/FiltrarDonativosActivos/${id}`, {});
  }

  // Reporte Angie  
  getTendencias(): Observable<TrendsDonationsDTO[]> {
    return this.http.get<TrendsDonationsDTO[]>(
      `${this.url}/tendenciasDonacionesMes`
    );
  }

  geSumaOngYear(year: number): Observable<DonationSummaryYearONGDTO[]> {
    return this.http.get<DonationSummaryYearONGDTO[]>(
      `${this.url}/MontoAnualporONG?year=${year}`);
  }
  getEstadisticas():Observable<DonationStatisticsDTO[]>{
    return this.http.get<DonationStatisticsDTO[]>(`${this.url}/donation-statistics`);
  }
  getMonetaryByDonor(anio: number): Observable<DonationSummaryDTO[]> {
    const username = this.loginService.showUsername(); // Obtén el username desde el LoginService
    if (!username) {
      throw new Error('No se pudo obtener el nombre de usuario del token.');
    }

    return this.http.get<DonationSummaryDTO[]>(
      `${this.url}/ResumenMonetarioDeDonacionesPorDonante?anio=${anio}&username=${username}`
    );
  }

  getCantidadDonativosPorTipoYM(mes: number): Observable<DonationforTypemothDTO[]> {
    return this.http.get<DonationforTypemothDTO[]>(`${this.url}/cantidadDonativosfisicosPorMonth?mes=${mes}`);
  }  

}