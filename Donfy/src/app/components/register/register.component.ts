import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterLink, Router } from '@angular/router';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Users } from '../../models/Users';
import { UsersService } from '../../services/users.service';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/Role';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  form: FormGroup = new FormGroup({});
  users: Users = new Users();
  id: number = 0;
  Role: Role = new Role();
  isPasswordVisible = false;
  
  constructor(
    private uS: UsersService,
    private router: Router,
    private r: RoleService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
    });
    this.form = this.formBuilder.group({
      codigo: [''],
      username: ['',[Validators.required, Validators.minLength(3)]],
      contra: ['',[Validators.required, Validators.minLength(8)]],
      estado: [''],
      correo: ['',[Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$')]],
      nombres:['', Validators.required],
      apellidos:['', Validators.required],
      telefono:['',[Validators.required, Validators.minLength(9)]],
      dni:['',[Validators.required, Validators.minLength(8)]],
      ruc: [''],
      direccion: ['', Validators.required],
      nombreONG: [''],
      saldo: [''],
    });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  autoFillEmailDomain() {
    const emailControl = this.form.get('correo');
    if (emailControl && emailControl.value && !emailControl.value.includes('@')) {
        emailControl.setValue(emailControl.value + '@gmail.com');
    }
}

  autoFillPhonePrefix() {
    const telefonoControl = this.form.get('telefono');
    if (telefonoControl && telefonoControl.value && !telefonoControl.value.startsWith('+51')) {
      telefonoControl.setValue('+51 ' + telefonoControl.value);
    }
  }

  registrar(): void {
    if (this.form.valid) {
      const username = this.form.value.username;
  
      this.uS.list().subscribe((users: Users[]) => {
        const userExists = users.some(user => user.username === username);
        if (userExists) {
          this.form.controls['username'].setErrors({ usernameTaken: true });
          this.snackbar.open('El nombre de usuario ya está en uso', '', {
            duration: 3000,
          });
        } else {
          this.users.id = this.form.value.codigo;
          this.users.username = username;
          this.users.password = this.form.value.contra;
          this.users.enabled = true;
          this.users.correo = this.form.value.correo;
          this.users.nombre = this.form.value.nombres;
          this.users.apellidos = this.form.value.apellidos;
          this.users.telefono = this.form.value.telefono;
          this.users.dni = this.form.value.dni;
          this.users.ruc = this.form.value.ruc;
          this.users.direccion = this.form.value.direccion;
          this.users.nombreONG = this.form.value.nombreONG;
          this.users.saldo = this.form.value.saldo;
  
          this.uS.insert(this.users).subscribe((data) => {
            this.uS.list().subscribe((data) => {
              this.uS.setList(data);
            });
            this.Role.rol = "DONADOR"
            this.uS.usuario(username).subscribe((id: number) => {
              
              this.uS.listId(id).subscribe((user: Users) => {
                this.Role.user.id = user.id;
                this.guardarRole(this.Role);
                this.snackbar.open('Registro exitoso', 'cerrar', {
                  duration: 3000,
                });
                this.router.navigate(['login']);
              });
            });
            
            
          });
        }
      });
    } else {
      this.snackbar.open('Por favor completa todos los campos obligatorios', 'cerrar', {
        duration: 3000,
      }
    );
  }
  }
  guardarRole(role: Role) {
    this.r.insert(role).subscribe(
      (response) => {
        const roleResponse = response as Role;  // Forzamos el tipo a Role
        console.log('Role guardado exitosamente:', roleResponse);
        this.Role = roleResponse;  // Asigna la respuesta al Role en el componente
      },
      (error) => {
        console.error('Error al guardar el Role:', error);
      }
    );
  }
}
