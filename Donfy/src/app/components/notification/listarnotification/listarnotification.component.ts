import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService } from '../../../services/notifications.service';
import { MatIconModule } from '@angular/material/icon';  // Importar MatIconModule
import { RouterLink } from '@angular/router';
import { Notifications } from '../../../models/Notifications';

@Component({
  selector: 'app-listarnotification',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl:'./listarnotification.component.html',
  styleUrl: './listarnotification.component.css'
})
export class ListarnotificationComponent {
  notifications: Notifications[] = []; // Array de notificaciones

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit(): void {
    // Cargar la lista de notificaciones al inicio
    this.notificationsService.list().subscribe((data) => {
      this.notifications = data;
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta notificación?')) {
      this.notificationsService.delete(id).subscribe(() => {
        this.notifications = this.notifications.filter(notification => notification.idNotificacion !== id);
      });
    }
  }
}
