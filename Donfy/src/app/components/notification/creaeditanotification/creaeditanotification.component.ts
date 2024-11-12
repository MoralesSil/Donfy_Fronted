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

  tiposNotificacion$!: Observable<NotificationType[]>; // Usando `!` para indicar que será inicializado más tarde
  usuarios$!: Observable<Users[]>; // Usando `!` para indicar que será inicializado más tarde

  constructor(
    private notificationsService: NotificationsService,
    private usersService: UsersService,
    private notificationTypeService: NotificationTypeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id']; // Obtener el id de los parámetros de la URL
      this.edicion = this.id !== null && this.id > 0; // Si el id es válido, estamos en edición
      this.initForm();
    });    

    this.route.url.subscribe(urlSegments => {
      const currentPath = urlSegments.join('/'); 
      if (currentPath.includes('Agregar')) {
        this.headerTitle = 'Registrar Nueva Notificación';
      } else if (currentPath.includes('Modificar')) {
        this.headerTitle = 'Actualizar Notificación';
      }
    });
    // Obtener los tipos de notificación
    this.tiposNotificacion$ = this.notificationTypeService.list();
    this.tiposNotificacion$.subscribe(data => {
      //console.log('Tipos de notificación recibidos: ', data);
      // Actualizar los valores en el formulario
      this.form.get('tipoNotificacion')?.setValue(data[0]?.idTipoNotificacion); // Establecer un valor predeterminado si es necesario
    });
  
    // Obtener los usuarios
    this.usuarios$ = this.usersService.list();
    this.usuarios$.subscribe(data => {
      //console.log('Usuarios recibidos: ', data);
      // Actualizar los valores en el formulario
      this.form.get('usuarioId')?.setValue(data[0]?.id); // Establecer un valor predeterminado si es necesario
    });
  }
  

  initForm(): void {
    if (this.edicion) {
      this.notificationsService.listId(this.id).subscribe((data) => {
        this.form = this.formBuilder.group({
          idNotificacion: [data.idNotificacion],
          mensaje: [data.mensaje, Validators.required],
          estado: [data.estado, Validators.required],
          tipoNotificacion: [data.tipoNotificacion.idTipoNotificacion, Validators.required],
          usuarioId: [data.usuarios.id, Validators.required],
        });
      });
    } else {
      this.form = this.formBuilder.group({
        idNotificacion: [''],
        mensaje: ['', Validators.required],
        estado: ['', Validators.required],
        tipoNotificacion: ['', Validators.required],
        usuarioId: ['', Validators.required],
      });
    }
  }  

  aceptar(): void {
    if (this.form.valid) {
      const notification = { ...this.form.value };

      if (this.edicion) {
        this.notificationsService.update(notification).subscribe(() => {
          this.notificationsService.list().subscribe((data) => {
            this.notificationsService.setList(data);
          });
        });
      } else {
        this.notificationsService.insert(notification).subscribe(() => {
          this.notificationsService.list().subscribe((data) => {
            this.notificationsService.setList(data);
          });
        });
      }
      this.router.navigate(['Notifications']);
    }
  }
}
