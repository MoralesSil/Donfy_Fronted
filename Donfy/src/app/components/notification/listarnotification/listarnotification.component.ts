import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-listarnotification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listarnotification.component.html',
  styleUrl: './listarnotification.component.css'
})
export class ListarnotificationComponent {
  notifications: any[] = [];

  constructor(private notificationService: NotificationsService) {}

  ngOnInit() {
    this.notificationService.list().subscribe(data => {
      this.notifications = data;
    });
  }
}
