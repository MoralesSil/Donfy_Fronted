import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService } from '../../../services/notifications.service';
import { MatIconModule } from '@angular/material/icon';  // Importar MatIconModule
import { RouterLink } from '@angular/router';
import { Notifications } from '../../../models/Notifications';
import { LoginService } from '../../../services/login.service';
import { MatTableDataSource } from '@angular/material/table';

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
  dataSource: MatTableDataSource<Notifications> = new MatTableDataSource(); // DataSource para la tabla
  displayedColumns: string[] = ['mensaje', 'estado', 'tipoNotificacion', 'eliminar']; // Columnas a mostrar
  title: string = ''; // Título dinámico según el rol del usuario

  constructor(
    private notificationsService: NotificationsService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    console.log('Cargando notificaciones...');
    const role = this.loginService.showRole();
    const username = this.loginService.showUsername();

    if (role === 'DONADOR') {
      this.title = 'Mis Notificaciones';
      this.notificationsService.getNotificationsByUser(username).subscribe({
        next: (data: any[]) => {
          this.dataSource.data = data.map(notification => ({
            idNotificacion: notification.id,
            mensaje: notification.message,
            estado: notification.state,
            tipoNotificacion: notification.notificationType,
            usuarios: notification.users,
          }));
        },
        error: (err) => {
          console.error('Error cargando notificaciones del usuario:', err);
        }
      });
    } else if (role === 'ONG') {
      this.title = 'Notificaciones de mi ONG';
      this.notificationsService.getNotificationsByOngUsername(username).subscribe({
        next: (data: any[]) => {
          this.dataSource.data = data.map(notification => ({
            idNotificacion: notification.id,
            mensaje: notification.message,
            estado: notification.state,
            tipoNotificacion: notification.notificationType,
            usuarios: notification.users,
          }));
        },
        error: (err) => {
          console.error('Error cargando notificaciones de la ONG:', err);
        }
      });
    } else {
      this.title = 'Todas las Notificaciones';
      this.notificationsService.list().subscribe({
        next: (data: any[]) => {
          this.dataSource.data = data.map(notification => ({
            idNotificacion: notification.id,
            mensaje: notification.message,
            estado: notification.state,
            tipoNotificacion: notification.notificationType,
            usuarios: notification.users,
          }));
        },
        error: (err) => {
          console.error('Error cargando todas las notificaciones:', err);
        }
      });
    }
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta notificación?')) {
      this.notificationsService.delete(id).subscribe({
        next: () => {
          // Actualizar el MatTableDataSource después de eliminar
          this.dataSource.data = this.dataSource.data.filter(
            notification => notification.idNotificacion !== id
          );
        },
        error: (err) => {
          console.error('Error eliminando la notificación:', err);
        }
      });
    }
  }
}