import { Injectable } from '@angular/core';
import { environmet } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DonationType } from '../models/DonationType';
const base_url = environmet.base

@Injectable({
  providedIn: 'root'
})
export class DonationtypeService {
  private url = `${base_url}/DonationType`

  constructor(private http: HttpClient) { }

  list(){
    return this.http.get<DonationType[]>(this.url)
  }
}
