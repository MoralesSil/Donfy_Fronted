import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarnotificationComponent } from "./listarnotification/listarnotification.component";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [RouterOutlet, ListarnotificationComponent],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  constructor(public route:ActivatedRoute){}

}