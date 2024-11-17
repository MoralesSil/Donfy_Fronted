import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { Users } from '../../../models/Users';
import { Role } from '../../../models/Role';
import { UsersService } from '../../../services/users.service';
import { RoleService } from '../../../services/role.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-creaedita-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIcon
  ],
  templateUrl: './creaedita-user.component.html',
  styleUrls: ['./creaedita-user.component.css']
})
export class CreaeditaUserComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  users: Users = new Users();
  Role: Role = new Role();
  id: number = 0;
  username: string = "";
  edicion: boolean = false;
  

  constructor(
    private uS: UsersService,
    private r: RoleService,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.username = data['username'];
      this.edicion = data['username'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      username: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern("^[0-9]{8}$")]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      imagenUrl: ['', Validators.required]
    });
  }

  guardarCambios(): void {
    if (this.form.valid) {
      this.users.nombre = this.form.value.nombres;
      this.users.apellidos = this.form.value.apellidos;
      this.users.username = this.form.value.username;
      this.users.dni = this.form.value.dni;
      this.users.correo = this.form.value.correo;
      this.users.telefono = this.form.value.telefono;
      this.users.imagenUrl = this.form.value.imagenUrl;

      if (this.edicion) {
        this.uS.usuario(this.username).subscribe((id: number) => {
          this.users.id = id;
          this.uS.update(this.users).subscribe(data => {
            this.uS.list().subscribe((data) => {
              this.uS.setList(data);
              this.uS.listId(id).subscribe((user: Users) => {
                this.Role.user.id = user.id;
                this.Role.rol = this.loginService.showRole();
                this.guardarRole(this.Role);
              });
            });
          });
        });
      } else {
        this.uS.insert(this.users).subscribe(d => {
          this.uS.list().subscribe(d => {
            this.uS.setList(d);
          });
        });
      }
    }
    this.router.navigate(['/home']);
  }

  init() {
    if (this.edicion) {
      this.uS.gusuario(this.username).subscribe((data) => {
        this.form = new FormGroup({
          nombres: new FormControl(data.nombre),
          apellidos: new FormControl(data.apellidos),
          username: new FormControl(data.username),
          dni: new FormControl(data.dni),
          correo: new FormControl(data.correo),
          telefono: new FormControl(data.telefono),
          imagenUrl: new FormControl(data.imagenUrl)
        });
      });
    }
  }

  guardarRole(role: Role) {
    this.r.insert(role).subscribe(
      (response) => {
        const roleResponse = response as Role;
        console.log('Role guardado exitosamente:', roleResponse);
        this.Role = roleResponse;
      },
      (error) => {
        console.error('Error al guardar el Role:', error);
      }
    );
  }
}
