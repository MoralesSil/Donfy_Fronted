import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Role } from '../../../models/Role';
import { RoleService } from '../../../services/role.service';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { Users } from '../../../models/Users';
import { MatButtonModule } from '@angular/material/button';
import { Observable, startWith, map  } from 'rxjs';
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
    MatSelectModule
  ],
  templateUrl: './creaeditarole.component.html',
  styleUrls: ['./creaeditarole.component.css']
})
export class CreaeditaroleComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  ro:Role=new Role();
  listaUsuarios: Users[]=[];
  filteredUsuarios!: Observable<Users[]>;
  mensajeError: string = '';
  
  listaRoles:{value:string;viewValue:string}[]=[
    {value:'DONADOR',viewValue:'DONADOR'},
    {value:'ONG',viewValue:'ONG'},
    {value:'ADMINISTRADOR',viewValue:'ADMINISTRADOR'}
  ]

  constructor(
    private formBuilder:FormBuilder,
    private rS:RoleService,
    private router:Router,
    private uS:UsersService,
    private snackBar: MatSnackBar
    ){}
  
    ngOnInit(): void {
      this.form = this.formBuilder.group({
        hrol: ['', Validators.required],
        husername: ['', Validators.required]
      });
    
      this.uS.list().subscribe(data => {
        this.listaUsuarios = data;
        console.log("Usuarios cargados:", this.listaUsuarios); // Verifica que los usuarios se carguen correctamente
        this.filteredUsuarios = this.form.controls['husername'].valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || ''))
        );
      });
    }
  
    private _filter(value: string): Users[] {
      const filterValue = value.toLowerCase();
      return this.listaUsuarios.filter(user => user.username.toLowerCase().includes(filterValue));
    }

    aceptar(): void {
      this.ro.rol = this.form.value.hrol;
      const selectedUser = this.listaUsuarios.find(user => user.username === this.form.value.husername);
    
      if (selectedUser) {
        // Comprueba si el usuario ya tiene un rol asignado
        this.rS.list().subscribe(roles => {
          const userHasRole = roles.some(role => role.user?.username === selectedUser.username);
    
          if (userHasRole) {
            this.mensajeError = `El usuario ${selectedUser.username} ya tiene un rol asignado y no se le puede asignar otro.`;
          } else {
            // Procede con el registro
            this.ro.user = selectedUser;
            this.rS.insert(this.ro).subscribe({
              next: () => {
                this.rS.list().subscribe(data => {
                  this.rS.setList(data);
                });
                
                // Muestra el Snackbar de éxito
                this.snackBar.open('Registro exitoso', 'Cerrar', {
                  duration: 3000, // Duración del Snackbar en milisegundos
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom'
                });
                
                this.router.navigate(['Roles']);
              },
              error: (err) => {
                console.error("Error al registrar:", err);
              }
            });
          }
        });
      } else {
        console.log("Usuario no encontrado");
      }
    }

}
