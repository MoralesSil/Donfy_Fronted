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
import { DonationType } from '../../../models/DonationType';
import { DonationtypeService } from '../../../services/donationtype.service';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-creaeditadonationtype',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './creaeditadonationtype.component.html',
  styleUrl: './creaeditadonationtype.component.css',
})
export class CreaeditadonationtypeComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  donaciontipo: DonationType = new DonationType();
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private dtS: DonationtypeService,
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
      hcodigo: [''],
      htipodonacion: ['', Validators.required],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.donaciontipo.idTipoDonation = this.form.value.hcodigo;
      this.donaciontipo.nombreTipoDonation = this.form.value.htipodonacion;

      // Validación para verificar si el nombre ya existe
      this.dtS.list().subscribe((data) => {
        const nombreExiste = data.some(
          (tipo) =>
            tipo.nombreTipoDonation.toLowerCase() ===
              this.donaciontipo.nombreTipoDonation.toLowerCase() &&
            tipo.idTipoDonation !== this.donaciontipo.idTipoDonation
        );

        if (nombreExiste) {
          // Mostrar snackbar si el nombre ya existe
          this.snackBar.open(
            'Este tipo de donación ya está registrado',
            'Cerrar',
            {
              duration: 3000,
              verticalPosition: 'bottom',
            }
          );
        } else {
          // Proceder con la operación (insertar o actualizar) si no hay duplicado
          if (this.edicion) {
            this.dtS.update(this.donaciontipo).subscribe(() => {
              this.dtS.list().subscribe((data) => {
                this.dtS.setList(data);
              });
              this.snackBar.open('Modificación exitosa', 'Cerrar', {
                duration: 3000,
                verticalPosition: 'bottom',
              });
              this.router.navigate(['DonationType/listar']);
            });
          } else {
            this.dtS.insert(this.donaciontipo).subscribe(() => {
              this.dtS.list().subscribe((d) => {
                this.dtS.setList(d);
              });
              this.snackBar.open('Registro exitoso', 'Cerrar', {
                duration: 3000,
                verticalPosition: 'bottom',
              });
              this.router.navigate(['DonationType/listar']);
            });
          }
        }
      });
    }
  }
  init() {
    if (this.edicion) {
      this.dtS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          hcodigo: new FormControl(data.idTipoDonation),
          htipodonacion: new FormControl(data.nombreTipoDonation),
        });
      });
    }
  }
}
