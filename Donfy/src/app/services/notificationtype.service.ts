import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NotificationType} from '../models/NotificationType';
import { Subject } from 'rxjs';
const base_url = environment.base

@Injectable({
  providedIn: 'root'
})
export class NotificationTypeService {
  private url = `${base_url}/NotificationType`

  private listaCambio = new Subject<NotificationType[]>();

  constructor(private http : HttpClient) { }

  list(){
    return this.http.get<NotificationType[]>(this.url)
  }

  insert(nt: NotificationType){
    return this.http.post(this.url,nt);
  }

  setList(listaNueva: NotificationType[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  delete(id:number) {
    return this.http.delete(`${this.url}/${id}`)
  }

  listId(id:number){
    return this.http.get<NotificationType>(`${this.url}/${id}`)
  }

  update(nt:NotificationType){
    return this.http.put(this.url,nt);
  }
}
