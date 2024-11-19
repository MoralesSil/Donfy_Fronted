import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService } from '../../../services/notifications.service';
import { MatIconModule } from '@angular/material/icon';  // Importar MatIconModule
import { Router, RouterLink } from '@angular/router';
import { Notifications } from '../../../models/Notifications';
import { LoginService } from '../../../services/login.service';

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
  userRole: string='';
  username: string='';

  constructor(
    private notificationsService: NotificationsService,
    private router: Router,
    public loginService:LoginService,
    private notificationService:NotificationsService
  ) {}

  ngOnInit(): void {
    
    this.userRole = this.loginService.showRole();
    this.username = this.loginService.showUsername();

    this.notificationsService.list().subscribe((data) => {
      this.notifications = data;
    });

    if (this.username) {
      if (this.userRole === 'DONADOR') {
        this.notificationService
          .getNotificationsForUsername(this.username)
          .subscribe((data) => {
            this.notifications = data;
          });
      } else if (this.userRole === 'ONG') {
        this.notificationService
          .getNotificationsForUsername(this.username)
          .subscribe((data) => {
            this.notifications = data;
          });
      }
    }
  }
  

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta notificación?')) {
      this.notificationsService.delete(id).subscribe(() => {
        this.notifications = this.notifications.filter(notification => notification.idNotificacion !== id);
      });
    }
  }
  
  agregarNotificacion(): void {
    this.router.navigate(['/Notifications/agregar']);
  }

}