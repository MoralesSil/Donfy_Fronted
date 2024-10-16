import { Injectable } from '@angular/core';
import { environmet } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NotificationType} from '../models/NotificationType';
const base_url = environmet.base

@Injectable({
  providedIn: 'root'
})
export class NotificationTypeService {
  private url = `${base_url}/NotificationType`

  constructor(private http : HttpClient) { }

  list(){
    return this.http.get<NotificationType[]>(this.url)
  }
}
