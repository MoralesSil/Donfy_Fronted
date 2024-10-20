import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarNotificationtypeComponent } from "./listar-notificationtype/listar-notificationtype.component";

@Component({
  selector: 'app-notificationtype',
  standalone: true,
  imports: [ListarNotificationtypeComponent, RouterOutlet],
  templateUrl: './notificationtype.component.html',
  styleUrl: './notificationtype.component.css'
})
export class NotificationtypeComponent implements OnInit{
  constructor(public route:ActivatedRoute){}
  ngOnInit(): void {}
}
