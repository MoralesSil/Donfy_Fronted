import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Role } from '../../../models/Role';
import { RoleService } from '../../../services/role.service';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { Users } from '../../../models/Users';
import { MatButtonModule } from '@angular/material/button';
import { Observable, startWith, map } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-creaeditarole',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    CommonModule,
    MatSelectModule,
    RouterLink
  ],
  templateUrl: './creaeditarole.component.html',
  styleUrls: ['./creaeditarole.component.css'],
})
export class CreaeditaroleComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  ro: Role = new Role();
  id: number = 0;
  listaUsuarios: Users[] = [];
  filteredUsuarios!: Observable<Users[]>;
  mensajeError: string = '';
  edicion: boolean = false;

  listaRoles: { value: string; viewValue: string }[] = [
    { value: 'DONADOR', viewValue: 'DONADOR' },
    { value: 'ONG', viewValue: 'ONG' },
    { value: 'ADMINISTRADOR', viewValue: 'ADMINISTRADOR' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private rS: RoleService,
    private router: Router,
    private uS: UsersService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      hid: [''],
      hrol: ['', Validators.required],
      husername: ['', Validators.required],
    });

    this.uS.list().subscribe((data) => {
      this.listaUsuarios = data;
      console.log('Usuarios cargados:', this.listaUsuarios); // Verifica que los usuarios se carguen correctamente
      this.filteredUsuarios = this.form.controls['husername'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
    });
  }

  private _filter(value: string): Users[] {
    const filterValue = value.toLowerCase();
    return this.listaUsuarios.filter((user) =>
      user.username.toLowerCase().includes(filterValue)
    );
  }

  aceptar(): void {
    this.ro.rol = this.form.value.hrol;
    const selectedUser = this.listaUsuarios.find(
      (user) => user.username === this.form.value.husername
    );

    if (selectedUser) {
      this.ro.user = selectedUser;

      if (this.edicion) {
        // Actualización del rol existente
        this.ro.id = this.id;
        this.rS.update(this.ro).subscribe({
          next: () => {
            this.rS.list().subscribe((data) => {
              this.rS.setList(data);
            });
            this.snackBar.open('Actualización exitosa', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            this.router.navigate(['Roles']);
          },
          error: (err) => {
            console.error('Error al actualizar:', err);
          },
        });
      } else {
        // Inserción de un nuevo rol
        this.rS.insert(this.ro).subscribe({
          next: () => {
            this.rS.list().subscribe((data) => {
              this.rS.setList(data);
            });
            this.snackBar.open('Registro exitoso', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            this.router.navigate(['Roles']);
          },
          error: (err) => {
            console.error('Error al registrar:', err);
          },
        });
      }
    } else {
      console.log('Usuario no encontrado');
    }
  }
  init() {
    if (this.edicion) {
      this.rS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          hid: new FormControl(data.id),
          hrol: new FormControl(data.rol),
          husername: new FormControl(data.user.username),
        });
      });
    }
  }
}
