import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { AppComponent } from '../../../app.component';
import { GoogleMapsModule } from '@angular/google-maps';

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
    MatIcon,
    GoogleMapsModule
  ],
  templateUrl: './creaedita-user.component.html',
  styleUrls: ['./creaedita-user.component.css']
})
export class CreaeditaUserComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  mapCenter: google.maps.LatLngLiteral = { lat: -12.0464, lng: -77.0428 };
  zoom: number = 14;
  users: Users = new Users();
  Role: Role = new Role();
  id: number = 0;
  username: string = "";
  edicion: boolean = false;
  mostrarCamposONG: boolean = false; // Controla la visibilidad de los campos adicionales

  constructor(
    private uS: UsersService,
    private r: RoleService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    public loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private appComponent: AppComponent
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

    if (this.loginService.showRole() === 'ONG') {
      this.agregarCamposONG();
    }
  }

  agregarCamposONG(): void {
    this.form.addControl('nombreONG', new FormControl('', Validators.required));
    this.form.addControl('dirrecion', new FormControl('', Validators.required));
    this.form.addControl('ruc', new FormControl('', [Validators.required, Validators.pattern("^[0-9]{11}$")]));
  }

  eliminarCamposONG(): void {
    this.form.removeControl('nombreONG');
    this.form.removeControl('ruc');
    this.form.removeControl('dirrecion');
  }

  alternarCamposONG(): void {
    this.mostrarCamposONG = !this.mostrarCamposONG;
    if (this.mostrarCamposONG) {
      this.agregarCamposONG();
    } else {
      this.eliminarCamposONG();
    }
  }
  buscarDireccion(direccion: string): void {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: direccion }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
      if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
        const location = results[0].geometry.location;
        this.mapCenter = { lat: location.lat(), lng: location.lng() };
        this.cd.detectChanges(); // Fuerza la actualización del componente
      } else {
        alert('No se pudo encontrar la dirección.');
      }
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
      if(this.loginService.showRole() === "ONG"){
        this.users.nombreONG = this.form.value.nombreONG;
        this.users.ruc = this.form.value.ruc;
        this.users.direccion = this.form.value.dirrecion;
      }
      if (this.mostrarCamposONG) {
        this.users.nombreONG = this.form.value.nombreONG;
        this.users.ruc = this.form.value.ruc;
        this.Role.rol = "ONG";
      }else{
        this.Role.rol = this.loginService.showRole();
      }


      

      if (this.edicion) {
        this.uS.usuario(this.username).subscribe((id: number) => {
          this.users.id = id;
          this.uS.gusuario(this.username).subscribe((data) => {
            this.users.password = data.password;
            if(this.loginService.showRole() !== "ONG"){
              this.users.direccion = data.direccion;
            }
            this.users.enabled = data.enabled;
            this.uS.update(this.users).subscribe(() => {
              this.uS.list().subscribe((data) => {
                this.uS.setList(data);
                this.uS.listId(id).subscribe((user: Users) => {
                  this.Role.user.id = user.id;
                  this.guardarRole(this.Role);
                  if (this.mostrarCamposONG) {
                    sessionStorage.clear();
                    this.router.navigate(['/login']); 
                    }else{
                    this.router.navigate(['home'])
                  }
                });
              });
            });
          });
        });
      } else {
        this.uS.insert(this.users).subscribe(() => {
          this.uS.list().subscribe((data) => {
            this.uS.setList(data);
          });
        });
      }
    }
    
  }

  
  init() {
    if (this.edicion) {
      this.uS.gusuario(this.username).subscribe((data) => {
        const formData: any = {
          nombres: data.nombre,
          apellidos: data.apellidos,
          username: data.username,
          dni: data.dni,
          correo: data.correo,
          telefono: data.telefono,
          imagenUrl: data.imagenUrl
        };
        
        if (this.loginService.showRole() === 'ONG') {
          formData.nombreONG = data.nombreONG;
          formData.ruc = data.ruc;
          formData.dirrecion = data.direccion;
          this.buscarDireccion(data.direccion);
        }

        this.form.setValue(formData);
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
