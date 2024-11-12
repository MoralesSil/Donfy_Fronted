import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  form: FormGroup;
  tiposNotificacion$!: Observable<NotificationType[]>; // Observable para tipos de notificación
  usuarios$!: Observable<Users[]>; // Observable para usuarios
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private notificationsService: NotificationsService,
    private usersService: UsersService,
    private notificationTypeService: NotificationTypeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      idNotificacion: [''],
      mensaje: ['', Validators.required],
      estado: ['', Validators.required],
      tipoNotificacion: ['', Validators.required],
      usuarioId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.edicion = this.id !== null && this.id > 0;
      this.initForm();
    });

    // Cargar tipos de notificación y usuarios
    this.cargarTiposNotificacion();
    this.cargarUsuarios();
  }

  initForm(): void {
    if (this.edicion) {
      this.notificationsService.listId(this.id).subscribe(data => {
        this.form.patchValue({
          idNotificacion: data.idNotificacion,
          mensaje: data.mensaje,
          estado: data.estado,
          tipoNotificacion: data.tipoNotificacion.idTipoNotificacion,
          usuarioId: data.usuarios.id // Asegúrate que 'usuarioId' esté correctamente definido en el servicio
        });
      });
    }
  }

  cargarTiposNotificacion(): void {
    this.tiposNotificacion$ = this.notificationTypeService.list();
  }

  cargarUsuarios(): void {
    this.usuarios$ = this.usersService.list();
  }

  aceptar(): void {
    if (this.form.valid) {
      const notification = { ...this.form.value }; 
      
      if (this.edicion) {
        this.notificationsService.update(notification).subscribe(() => {
          this.router.navigate(['Notifications']); 
        }, error => {
          console.error('Error al actualizar la notificación', error);
        });
      } else {
        this.notificationsService.insert(notification).subscribe(() => {
          this.router.navigate(['Notifications']); 
        }, error => {
          console.error('Error al crear la notificación', error);
        });
      }
    }
  }
}