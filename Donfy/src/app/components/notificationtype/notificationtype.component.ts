import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarNotificationtypeComponent } from "./listar-notificationtype/listar-notificationtype.component";

@Component({
  selector: 'app-notificationtype',
  standalone: true,
  imports: [ListarNotificationtypeComponent, RouterOutlet],
  templateUrl: './notificationtype.component.html',
  styleUrl: './notificationtype.component.css'
})
export class NotificationtypeComponent {
  constructor(public route:ActivatedRoute){}
}
