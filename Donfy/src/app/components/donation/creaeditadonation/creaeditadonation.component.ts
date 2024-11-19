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
import { Users } from '../../../models/Users';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { UsersService } from '../../../services/users.service';
import { LoginService } from '../../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';


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
  form: FormGroup;
  mostrarCamposMonetarios = false;
  today = new Date();
  idDonationMonetaria: number;  // Declaración de propiedad para la donación monetaria
  idDonationFisica: number;
  ongs: Users[] = [];
  idOngSeleccionada: number;  // Cambiar a number
  ongSeleccionada: Users = new Users;
  Donacion: Donations = new Donations;

  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private userService: UsersService,
    private snackBar: MatSnackBar,
    private donationsService: DonationsService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.maxLength(200)]],
      estado: [{ value: 'pendiente', disabled: this.loginService.showRole() !== 'ADMINISTRADOR' }],
      fechaRecojo: ['', Validators.required], // Validación dinámica
      direccionRecojo: ['', [Validators.required, Validators.maxLength(100)]],
      donationType: ['FISICO', Validators.required],
      montoDonado: [null, Validators.min(0)],
      idOngSeleccionada: [null, Validators.required],
    });
    this.idDonationMonetaria = 0;
    this.idDonationFisica = 0;
    this.idOngSeleccionada = 0;
  }

  ngOnInit(): void {
    this.aplicarValidadores();
  
    // Obtener el ID de la ONG desde la URL
    const idOngString = this.route.snapshot.paramMap.get('id');
    if (idOngString) {
      this.idOngSeleccionada = parseInt(idOngString, 10); // Convertir el ID a número
    }
  
    // Obtener los detalles de la ONG seleccionada por ID
    this.userService.listId(this.idOngSeleccionada).subscribe({
      next: (ong) => {
        this.ongSeleccionada = ong; // Asignar la ONG seleccionada
        this.form.patchValue({
          idOngSeleccionada: this.ongSeleccionada.id,
        });
        this.cdr.detectChanges(); // Forzar la actualización de la vista
      },
      error: (err) => {
        console.error('Error al obtener la ONG seleccionada:', err);
      },
    });
  }


  alternarCamposMONETARIOSG(): void {
    this.mostrarCamposMonetarios = !this.mostrarCamposMonetarios;
    this.aplicarValidadores();
  }

  aplicarValidadores(): void {
    if (this.mostrarCamposMonetarios) {
      // Configuración para donación monetaria
      this.form.patchValue({
        donationType: 'MONETARIO',
        fechaRecojo: this.today, // Fecha automática
      });
      this.form.get('fechaRecojo')?.clearValidators();
      this.form.get('direccionRecojo')?.clearValidators();
      this.form.get('montoDonado')?.setValidators([Validators.required, Validators.min(0)]);
    } else {
      // Configuración para donación física
      this.form.patchValue({
        donationType: 'FISICO',
        fechaRecojo: '', // Resetea la fecha
        montoDonado: null,
      });
      this.form.get('fechaRecojo')?.setValidators([Validators.required]); // Vuelve a ser requerida
      this.form.get('direccionRecojo')?.setValidators([Validators.required, Validators.maxLength(100)]);
      this.form.get('montoDonado')?.clearValidators();
    }
    this.form.get('fechaRecojo')?.updateValueAndValidity();
    this.form.get('direccionRecojo')?.updateValueAndValidity();
    this.form.get('montoDonado')?.updateValueAndValidity();
  }

  guardarCambios(): void {
    const username = this.loginService.showUsername(); // Obtener el username del usuario logueado
  
    if (!username) {
      this.snackBar.open('No se pudo obtener el nombre de usuario', 'Cerrar', { duration: 3000 });
      return;
    }
  
    // Obtener el usuario logueado
    this.userService.usuario(username).subscribe({
      next: (usuarioLogueado) => {
        this.userService.listId(usuarioLogueado).subscribe({
          next: (a) => {
            // Configurar los datos de la donación en la instancia existente
            this.Donacion.idDonation = 0; // Nuevo registro
            this.Donacion.nombre = this.mostrarCamposMonetarios ? '' : this.form.get('nombre')?.value;
            this.Donacion.descripcion = this.mostrarCamposMonetarios ? '' : this.form.get('descripcion')?.value;
            this.Donacion.estado = 'pendiente';
            this.Donacion.fechaRecojo = this.mostrarCamposMonetarios
              ? new Date()
              : this.form.get('fechaRecojo')?.value;
            this.Donacion.montoDonado = this.mostrarCamposMonetarios
              ? this.form.get('montoDonado')?.value || 0
              : 0;
            this.Donacion.eliminado = false;
            this.Donacion.direccionRecojo = this.mostrarCamposMonetarios ? '' : this.form.get('direccionRecojo')?.value;
            console.log('Usuario logueado:', a);
            console.log('ONG seleccionada:', this.ongSeleccionada);
            this.Donacion.users = a; // Usuario logueado
            this.Donacion.usersReceptor = this.ongSeleccionada; // ONG seleccionada
            this.Donacion.donationType = {
              idTipoDonation: 6,
              nombreTipoDonation: "DASDAD"
            };
  
            console.log('Objeto enviado:', JSON.stringify(this.Donacion));
            // Enviar la donación al backend
            this.donationsService.insert(this.Donacion).subscribe({
              next: () => {
                this.snackBar.open('Donación registrada con éxito', 'Cerrar', { duration: 3000 });
                this.router.navigate(['/Donations']); // Redirigir tras éxito
              },
              error: () => {
                this.snackBar.open('Error al registrar la donación', 'Cerrar', { duration: 3000 });
              },
            });
          },
          error: () => {
            this.snackBar.open('Error al obtener información del usuario logueado', 'Cerrar', { duration: 3000 });
          },
        });
      },
      error: () => {
        this.snackBar.open('Error al obtener el ID del usuario logueado', 'Cerrar', { duration: 3000 });
      },
    });
  }
  

  get userRole(): string {
    return this.loginService.showRole();
  }
}