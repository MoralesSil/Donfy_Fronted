import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup,ReactiveFormsModule,Validators,} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Role } from '../../../models/Role';
import { RoleService } from '../../../services/role.service';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { Users } from '../../../models/Users';
import { Observable, startWith, map } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-creaeditarole',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule],
  templateUrl: './creaeditarole.component.html',
  styleUrl: './creaeditarole.component.css',
})
export class CreaeditaroleComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  ro: Role = new Role();
  listaUsuarios: Users[] = [];
  filteredUsuarios!: Observable<Users[]>;

  constructor(
    private formBuilder: FormBuilder,
    private rS: RoleService,
    private router: Router,
    private uS: UsersService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      hrol: ['', Validators.required],
      husername: ['', Validators.required] // Campo de entrada de texto con validación
    });

    // Obtener la lista de usuarios del servicio
    this.uS.list().subscribe(data => {
      this.listaUsuarios = data;

      // Configurar el filtro de autocompletado
      this.filteredUsuarios = this.form.controls['husername'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );
    });
  }

  // Filtro de autocompletado
  private _filter(value: string): Users[] {
    const filterValue = value.toLowerCase();
    return this.listaUsuarios.filter(user => user.username.toLowerCase().includes(filterValue));
  }

  aceptar(): void {
    const enteredUsername = this.form.value.husername;

    // Verificar si el usuario existe en la lista
    const userExists = this.listaUsuarios.some(user => user.username === enteredUsername);

    if (this.form.valid && userExists) {
      this.ro.rol = this.form.value.hrol;
      const selectedUser = this.listaUsuarios.find(user => user.username === enteredUsername);

      if (selectedUser) {
        this.ro.user = selectedUser; // Asignar el objeto completo del usuario
        this.rS.insert(this.ro).subscribe(() => {
          this.rS.list().subscribe(data => {
            this.rS.setList(data);
          });
          this.router.navigate(['Roles']);
        });
      }
    } else if (!userExists) {
      // Mostrar mensaje de error si el usuario no existe
      this.form.controls['husername'].setErrors({ userNotFound: true });
    }
  }
}
