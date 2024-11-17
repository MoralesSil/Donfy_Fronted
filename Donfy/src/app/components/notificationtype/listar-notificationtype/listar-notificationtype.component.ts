import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { NotificationType } from '../../../models/NotificationType';
import { NotificationTypeService } from '../../../services/notificationtype.service';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-listar-notificationtype',
  standalone: true,
  imports: [
    MatTableModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './listar-notificationtype.component.html',
  styleUrl: './listar-notificationtype.component.css'
})
export class ListarNotificationtypeComponent implements OnInit{
  dataSource:MatTableDataSource<NotificationType>=new MatTableDataSource();
  
  displayedColumns: string[] = ['c1','c2','c3','c4'];

  constructor(
    private ntS: NotificationTypeService, 
    private snackBar: MatSnackBar,
    private nS: NotificationsService ) {}

  ngOnInit(): void{
    this.ntS.list().subscribe((data) => {
      this.dataSource=new MatTableDataSource(data)
    });

    this.ntS.getList().subscribe((data)=>{
      this.dataSource=new MatTableDataSource(data);
    })
  }

  eliminar(id: number): void {
    this.nS.list().subscribe((notifications) => {
      const notificacionesAsociadas = notifications.filter(
        (notification) => notification.tipoNotificacion.idTipoNotificacion === id // Asegúrate de acceder a idTipoNotificacion
      );
  
      if (notificacionesAsociadas.length > 0) {
        this.snackBar.open(
          'No se puede eliminar porque está asociado a una notificación.',
          'Cerrar',
          {
            duration: 3000,
            verticalPosition: 'bottom',
          }
        );
      } else {
        this.ntS.delete(id).subscribe(() => {
          this.ntS.list().subscribe((data) => {
            this.ntS.setList(data);
          });
          this.snackBar.open('Tipo de notificación eliminado con éxito', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'bottom',
          });
        });
      }
    });
  }  
}
