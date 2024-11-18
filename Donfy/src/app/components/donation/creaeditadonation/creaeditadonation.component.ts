import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { Donations } from '../../../models/Donations'; // Suponiendo que tienes un modelo Donation
import { DonationsService } from '../../../services/donations.service'; // Asegúrate de que este servicio esté definido
import { LoginService } from '../../../services/login.service';
import { Users } from '../../../models/Users';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-creaeditadonation',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule
  ],
  templateUrl: './creaeditadonation.component.html',
  styleUrls: ['./creaeditadonation.component.css']
})
export class CreaeditadonationComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  donation: Donations = new Donations();
  today = new Date();
  id: number = 0;
  ongId:number=0;
  usuarioReceptor: string = "";
  username: string = "";
  edicion: boolean = false;
  mostrarCamposONG: boolean = false; // Controla la visibilidad de los campos adicionales
  mostrarCamposMonetarios: boolean = false;

  constructor(
    private dS: DonationsService,
    private formBuilder: FormBuilder,
    public loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private us:UsersService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.usuarioReceptor = data['ongId'];
      this.edicion = data['ongId'] != null;
      this.username=data['username'];
      this.init();
    });

    this.form = this.formBuilder.group({
      nombre: ['', Validators.maxLength(150)],
      descripcion: ['', Validators.required],
      estado: ['', Validators.maxLength(20)],
      fechaRecojo: ['', Validators.required],
      montoDonado: ['', [Validators.required, Validators.min(0.01)]],
      direccionRecojo: ['', Validators.maxLength(200)],
      eliminado: [false],
      usuarioDonante: ['', Validators.required],
      donationType: ['FISICO', Validators.required],
      usuarioReceptor: [this.ongId, Validators.required]
    });
    if (this.loginService.showRole() === 'ADMINISTRADOR') {
      this.agregarCamposADMINISTRADOR();
    }
  }

  agregarCamposADMINISTRADOR(): void {
    this.form.addControl('estado', new FormControl('', Validators.required));
  }

  cambiarAMonetario(): void {
    this.mostrarCamposMonetarios = !this.mostrarCamposMonetarios;
    if (this.mostrarCamposMonetarios) {
      this.agregarCamposMonetarios();
    } else {
      this.eliminarCamposMonetarios();
    }
  }

  agregarCamposMonetarios(): void {
    this.form.addControl('montoDonado', new FormControl('', Validators.required));
  }

  eliminarCamposMonetarios(): void {
    this.form.removeControl('montoDonado');
  }

  alternarCamposMONETARIOSG(): void {
    this.mostrarCamposONG = !this.mostrarCamposONG;
    if (this.mostrarCamposONG) {
      this.agregarCamposMonetarios();
    } else {
      this.eliminarCamposMonetarios();
    }
  }

  guardarCambios(): void {
    if (this.form.valid) {
      this.donation.nombre = this.form.value.nombre;
      this.donation.descripcion = this.form.value.descripcion;
      this.donation.fechaRecojo = this.form.value.fechaRecojo;
      this.donation.direccionRecojo = this.form.value.direccionRecojo;
      this.donation.users = this.form.value.usuarioDonante;
      this.donation.usersReceptor = this.form.value.usersReceptor;
      
      if(this.loginService.showRole() === "ADMINISTRADOR"){
        this.donation.estado = this.form.value.estado;
      }
      if (this.mostrarCamposONG) {
        this.donation.montoDonado = this.form.value.montoDonado;
        this.donation.donationType.nombreTipoDonation = "MONETARIO"
      }


      if (this.edicion) {
        this.dS.listId(this.donation.idDonation).subscribe((data) => {
          this.donation.idDonation = data.idDonation;
          this.dS.update(this.donation).subscribe(() => {
            this.dS.list().subscribe((data) => {
              this.dS.setList(data);
              this.router.navigate(['Donations']);
            });
          });
        });
      } else {
        this.dS.insert(this.donation).subscribe(() => {
          this.dS.list().subscribe((data) => {
            this.dS.setList(data);
            this.router.navigate(['Donations']);
          });
        });
      }
    }
  }

  init() {
    if (this.edicion) {
      this.dS.listId(this.id).subscribe((data) => {
        const formData: any = {
          nombre: data.nombre,
          descripcion: data.descripcion,
          estado: data.estado,
          fechaRecojo: data.fechaRecojo,
          montoDonado: data.montoDonado,
          direccionRecojo: data.direccionRecojo,
          usuarioReceptor: data.usersReceptor,
          usuarioDonante: data.users,
          tipoDonacion: data.donationType
        };

        this.form.setValue(formData);
      });
    }
  }
}