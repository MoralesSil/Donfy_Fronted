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
  isPasswordVisible = false;
  
  constructor(
    private uS: UsersService,
    private router: Router,
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
      username: ['',Validators.required],
      contra: ['',[Validators.required, Validators.minLength(10)]],
      estado: [''],
      correo: ['',[Validators.required, Validators.email]],
      nombres:['',Validators.required],
      apellidos:['',Validators.required],
      telefono:['',Validators.required],
      dni:['',Validators.required],
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
    this.users.id = this.form.value.codigo;
    this.users.username = this.form.value.username;
    this.users.password = this.form.value.contra;
    this.users.enabled = true;
    this.users.correo = this.form.value.correo;
    this.users.nombre = this.form.value.nombres;
    this.users.apellidos = this.form.value.apellidos;
    this.users.telefono = this.form.value.telefono;
    this.users.dni = this.form.value.dni;
    this.users.ruc= this.form.value.ruc;
    this.users.direccion = this.form.value.direccion;
    this.users.nombreONG = this.form.value.nombreONG;
    this.users.saldo = this.form.value.saldo;     
    this.uS.insert(this.users).subscribe(data => {
      this.uS.list().subscribe((data) => {
        this.uS.setList(data);
      });
    });
    this.router.navigate(['login']);
  }
}
