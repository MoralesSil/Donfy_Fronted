import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationType } from '../../../models/NotificationType';
import { NotificationTypeService } from '../../../services/notificationtype.service';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-creaedita-notificationtype',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './creaedita-notificationtype.component.html',
  styleUrls: ['./creaedita-notificationtype.component.css'],
})
export class CreaeditaNotificationtypeComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  notificationtype: NotificationType = new NotificationType();
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private ntS: NotificationTypeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      ntid: [''],
      ntname: ['', Validators.required],
    });
  }

  aceptar(): void {
    if (this.form.invalid) {
      // Si el formulario es inválido, mostrar un error
      this.snackBar.open('El campo "Tipo de Notificación" es obligatorio', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'bottom',
      });
      return;
    }

    this.notificationtype.idTipoNotificacion = this.form.value.ntid;
    this.notificationtype.nombre = this.form.value.ntname;

    // Validación para evitar nombres duplicados
    this.ntS.list().subscribe((data) => {
      const nombreExiste = data.some(
        (tipo) =>
          tipo.nombre.toLowerCase() ===
            this.notificationtype.nombre.toLowerCase() &&
          tipo.idTipoNotificacion !== this.notificationtype.idTipoNotificacion
      );

      if (nombreExiste) {
        this.snackBar.open(
          'Este tipo de notificación ya está registrado.',
          'Cerrar',
          {
            duration: 3000,
            verticalPosition: 'bottom',
          }
        );
      } else {
        if (this.edicion) {
          this.ntS.update(this.notificationtype).subscribe(() => {
            this.ntS.list().subscribe((data) => {
              this.ntS.setList(data);
            });
            this.snackBar.open('Modificación exitosa', 'Cerrar', {
              duration: 3000,
            });
            this.router.navigate(['NotificationType']);
          });
        } else {
          this.ntS.insert(this.notificationtype).subscribe(() => {
            this.ntS.list().subscribe((d) => {
              this.ntS.setList(d);
            });
            this.snackBar.open('Registro exitoso', 'Cerrar', {
              duration: 3000,
            });
            this.router.navigate(['NotificationType']);
          });
        }
      }
    });
  }

  init(): void {
    if (this.edicion) {
      this.ntS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          ntid: new FormControl(data.idTipoNotificacion),
          ntname: new FormControl(data.nombre, Validators.required),
        });
      });
    }
  }
}