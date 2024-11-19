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
  ongSeleccionada!: Users;

  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private userService: UsersService,
    private snackBar: MatSnackBar,
    private donationsService: DonationsService,
    private route: ActivatedRoute,
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

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['ongData']) {
      this.ongSeleccionada = navigation.extras.state['ongData'];
      console.log('ONG seleccionada:', this.ongSeleccionada); // Verifica que los datos estén llegando correctamente
    }

    // Obtener el idOngSeleccionada desde la URL y convertirlo a number
    const idOngString = this.route.snapshot.paramMap.get('id');
    if (idOngString) {
      this.idOngSeleccionada = parseInt(idOngString, 10); // Convertir a number
    }

    // Usar el id para obtener los detalles de la ONG
    /*this.userService.listId(this.idOngSeleccionada).subscribe((ong) => {
      this.ongSeleccionada = ong.nombreONG;
    });*/

    // Suscribirse al servicio para obtener las ONGs
    this.userService.getONGs().subscribe((ongs) => {
      this.ongs = ongs;  // Guardar las ONGs en la propiedad
    }, (error) => {
      console.error('Error al obtener las ONGs:', error);
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

  guardarCambios() {
    const username = this.loginService.showUsername(); // Obtener el username del usuario logueado

    if (!username) {
      this.snackBar.open('No se pudo obtener el nombre de usuario', 'Cerrar', { duration: 3000 });
      return;
    }

    this.userService.getIdByUsername(username).subscribe({
      next: (userId) => {
        this.userService.listId(userId).subscribe({
          next: (usuarioLogueado) => {
            const ongSeleccionada = this.ongs.find(ong => ong.id === this.idOngSeleccionada);

            if (!ongSeleccionada) {
              this.snackBar.open('No se pudo encontrar la ONG seleccionada', 'Cerrar', { duration: 3000 });
              return;
            }

            const donacion: Donations = {
              idDonation: 0,
              nombre: this.mostrarCamposMonetarios ? '' : this.form.get('nombre')?.value,
              descripcion: this.mostrarCamposMonetarios ? '' : this.form.get('descripcion')?.value,
              estado: 'pendiente',
              fechaRecojo: this.mostrarCamposMonetarios
                ? new Date()
                : this.form.get('fechaRecojo')?.value,
              montoDonado: this.mostrarCamposMonetarios
                ? this.form.get('montoDonado')?.value || 0
                : 0,
              eliminado: false,
              direccionRecojo: this.mostrarCamposMonetarios ? '' : this.form.get('direccionRecojo')?.value,
              users: usuarioLogueado,
              usersReceptor: ongSeleccionada,
              donationType: {
                idTipoDonation: this.mostrarCamposMonetarios
                  ? this.idDonationMonetaria
                  : this.idDonationFisica,
                nombreTipoDonation: this.mostrarCamposMonetarios ? 'MONETARIO' : 'FISICO'
              }
            };

            // Enviar la donación al backend
            this.donationsService.insert(donacion).subscribe({
              next: () => {
                this.snackBar.open('Donación registrada con éxito', 'Cerrar', { duration: 3000 });
              },
              error: () => {
                this.snackBar.open('Error al registrar la donación', 'Cerrar', { duration: 3000 });
              }
            });
          },
          error: () => {
            this.snackBar.open('Error al obtener información del usuario logueado', 'Cerrar', { duration: 3000 });
          }
        });
      },
      error: () => {
        this.snackBar.open('Error al obtener el ID del usuario logueado', 'Cerrar', { duration: 3000 });
      }
    });
  }

  get userRole(): string {
    return this.loginService.showRole();
  }
}