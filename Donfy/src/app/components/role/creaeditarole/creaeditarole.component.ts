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

@Component({
  selector: 'app-creaeditarole',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    CommonModule
  ],
  templateUrl: './creaeditarole.component.html',
  styleUrls: ['./creaeditarole.component.css']
})
export class CreaeditaroleComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  ro:Role=new Role();
  listaUsuarios: Users[]=[];
  filteredUsuarios!: Observable<Users[]>;

  constructor(
    private formBuilder:FormBuilder,
    private rS:RoleService,
    private router:Router,
    private uS:UsersService
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
        this.ro.user = selectedUser;
    
        this.rS.insert(this.ro).subscribe({
          next: () => {
            // Actualiza la lista en el servicio para que los suscriptores reciban la nueva lista
            this.rS.list().subscribe(data => {
              this.rS.setList(data); // Llama a setList con la nueva lista
            });
            this.router.navigate(['Roles']);
          },
          error: (err) => {
            console.error("Error al registrar:", err);
          }
        });
      } else {
        console.log("Usuario no encontrado");
      }
    }

}
