import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { NotificationType } from '../../../models/NotificationType';
import { Users } from '../../../models/Users';
import { NotificationsService } from '../../../services/notifications.service';
import { UsersService } from '../../../services/users.service';
import { NotificationTypeService } from '../../../services/notificationtype.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Params } from '@angular/router';
import { Notifications } from '../../../models/Notifications';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-creaeditanotification',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './creaeditanotification.component.html',
  styleUrls: ['./creaeditanotification.component.css']
})
export class CreaeditanotificationComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  notification: Notifications = new Notifications();
  id: number = 0;
  edicion: boolean = false;
  headerTitle: string = '';

  tiposNotificacion$!: Observable<NotificationType[]>; 
  usuarios$!: Observable<Users[]>; 
  listaNotificaciones: Notifications[] = []; 

  constructor(
    private notificationsService: NotificationsService,
    private usersService: UsersService,
    private notificationTypeService: NotificationTypeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { 
    this.form = this.formBuilder.group({
      idNotificacion: [{ value: '', disabled: false }],
      mensaje: ['', Validators.required],
      estado: ['', Validators.required],
      tipoNotificacion: ['', Validators.required],
      usuarioId: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.edicion = this.id !== null && this.id > 0;
      if (this.edicion) {
        this.initForm();
      }
    });

    this.route.url.subscribe(urlSegments => {
      const currentPath = urlSegments.join('/');
      if (currentPath.includes('Agregar')) {
        this.headerTitle = 'Registrar Nueva Notificación';
      } else if (currentPath.includes('Modificar')) {
        this.headerTitle = 'Actualizar Notificación';
      }
    });

    this.tiposNotificacion$ = this.notificationTypeService.list();
    this.usuarios$ = this.usersService.list();

    this.notificationsService.list().subscribe(data => {
      this.listaNotificaciones = data; 
    });
  }

  initForm(): void {
    if (this.edicion) {
      this.notificationsService.listId(this.id).subscribe(data => {
        this.form.setValue({
          idNotificacion: data.idNotificacion,
          mensaje: data.mensaje,
          estado: data.estado,
          tipoNotificacion: data.tipoNotificacion.idTipoNotificacion,
          usuarioId: data.usuarios.id
        });
      });
    }
  }

  aceptar(): void {
    if (this.form.valid) {
      this.tiposNotificacion$.subscribe(tipos => {
        const tipoNotificacion = tipos.find(tipo => tipo.idTipoNotificacion === this.form.value.tipoNotificacion);
  
        if (!tipoNotificacion) {
          console.error('Tipo de notificación no encontrado');
          return;
        }
  
        this.usersService.listId(this.form.value.usuarioId).subscribe((usuario: Users) => {
          const notification: Notifications = {
            idNotificacion: this.form.value.idNotificacion,
            mensaje: this.form.value.mensaje,
            estado: this.form.value.estado,   
            tipoNotificacion: tipoNotificacion, 
            usuarios: usuario 
          };
  
          if (this.edicion) {
            this.notificationsService.update(notification).subscribe(() => {
              this.notificationsService.list().subscribe((data) => {
                this.notificationsService.setList(data);
              });
              this.snackBar.open('Notificación actualizada con éxito', 'Cerrar', { duration: 3000 });
            });
          } else {
            this.notificationsService.insert(notification).subscribe(() => {
              this.notificationsService.list().subscribe((data) => {
                this.notificationsService.setList(data);
              });
              this.snackBar.open('Notificación registrada con éxito', 'Cerrar', { duration: 3000 });
            });
          }
  
          this.router.navigate(['Notifications']);
        });
      });
    }
  }
}