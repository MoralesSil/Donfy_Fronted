import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Donations } from '../../../models/Donations'; // Suponiendo que tienes un modelo Donation
import { DonationsService } from '../../../services/donations.service'; // Asegúrate de que este servicio esté definido
import { DonationType } from '../../../models/DonationType';
import { Observable } from 'rxjs';
import { UsersService } from '../../../services/users.service';  // Asegúrate de que la ruta sea correcta
import { Users } from '../../../models/Users';
import { DonationtypeService } from '../../../services/donationtype.service';
import { LoginService } from '../../../services/login.service';
import { forkJoin } from 'rxjs';

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
  id: number = 0;
  edicion: boolean = false;
  headerTitle: string = '';
  tiposDonativo$!: Observable<DonationType[]>;
  minDate: Date = new Date();
  usuariosReceptores$!: Observable<Users[]>;


  constructor(
    private donationsService: DonationsService,
    private donationTypeService: DonationtypeService,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loginservice: LoginService
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.edicion = this.id !== null && this.id > 0;
      this.initForm();
    });

    this.route.url.subscribe((urlSegments) => {
      const currentPath = urlSegments.join('/');
      if (currentPath.includes('nuevo')) {
        this.headerTitle = 'Registrar Nueva Donación';
      } else if (currentPath.includes('Edit')) {
        this.headerTitle = 'Actualizar Donación';
      }

      this.tiposDonativo$ = this.donationTypeService.list();
      this.usuariosReceptores$ = this.usersService.getONGs()
    });
  }

  initForm(): void {
    const username = this.loginservice.showUsername();
    this.usersService.getIdByUsername(username).subscribe((userId) => {
      this.form = this.formBuilder.group({
        idDonacion: [-1],
        donationType: [-1, Validators.required],
        usersReceptor: [10, Validators.required],
        montoDonado: [0, [Validators.min(0.01)]],
        descripcion: ['NE'],
        nombre: ['NE'],
        estado: ['Pendiente'],
        fechaRecojo: ['2025/09/18', Validators.required],
        direccionRecojo: ['NE'],
        users: [userId, Validators.required],
        eliminado: [false],
      });
  
      this.form.get('usersReceptor')?.valueChanges.subscribe({
        next: (idONG) => {
          console.log('ID seleccionado:', idONG);
          this.usuariosReceptores$.subscribe((ongs) => {
            const ongSeleccionada = ongs.find(ong => ong.id === idONG);
            if (ongSeleccionada) {
              console.log('ONG Seleccionada:', ongSeleccionada);
              console.log('ID de la ONG:', ongSeleccionada.id);
            } else {
              console.warn('No se encontró la ONG con el ID:', idONG);
            }
          });
        },
        error: (err) => {
          console.error('Error en valueChanges:', err);
        }
      });
      
      if (this.edicion) {
        this.donationsService.listId(this.id).subscribe((data) => {
          this.form.patchValue({
            idDonacion: data.idDonation,
            donationType: data.donationType.idTipoDonation,
            usersReceptor: data.usersReceptor.id,
            montoDonado: data.montoDonado,
            descripcion: data.descripcion,
            nombre: data.nombre,
            estado: data.estado,
            fechaRecojo: data.fechaRecojo,
            direccionRecojo: data.direccionRecojo,
            users: data.users?.id,
            eliminado: data.eliminado ? false : true,
          });
  
          this.updateFieldValidators(data.donationType.idTipoDonation.toString());
        });
      }
    });
  }
  
  updateFieldValidators(donationType: string | null | undefined): void {
    console.log('Tipo de donativo:', donationType);

    if (!donationType) {
      console.warn('Tipo de donativo no especificado');
      return;
    }

    const monto = this.form.get('monto');
    const descripcion = this.form.get('descripcion');
    const nombreDonativo = this.form.get('nombreDonativo');
    const direccionRecojo = this.form.get('direccionRecojo');

    if (donationType === '2') {
      monto?.setValidators([Validators.required, Validators.min(0.01)]);
      descripcion?.setValue('-');
      descripcion?.clearValidators();
      nombreDonativo?.setValue('-');
      nombreDonativo?.clearValidators();
      direccionRecojo?.setValue('-');
      direccionRecojo?.clearValidators();


    } else if (donationType === '1') {
      monto?.setValue(0);
      monto?.clearValidators();
      descripcion?.setValidators([Validators.required]);
      nombreDonativo?.setValidators([Validators.required]);
      direccionRecojo?.setValidators([Validators.required]);
    }

    monto?.updateValueAndValidity();
    descripcion?.updateValueAndValidity();
    nombreDonativo?.updateValueAndValidity();
    direccionRecojo?.updateValueAndValidity();
  }

  aceptar(): void {
    if (this.form.valid) {
      // Get the selected donation type
      this.tiposDonativo$.subscribe((tipos) => {
        const tipoDonativo = tipos.find(tipo => tipo.idTipoDonation === this.form.value.donationType);
        if (!tipoDonativo) {
          console.error('Tipo de donativo no encontrado');
          return;
        }
        // Proceed with parallel calls for user fetching
        forkJoin([
          this.usersService.listId(this.form.value.usersReceptor),
          this.usersService.getIdByUsername(this.loginservice.showUsername())
        ]).subscribe(([usuarioReceptor, usuarioDonanteId]) => {
          this.usersService.listId(usuarioDonanteId).subscribe((usuarioDonante: Users) => {
            this.donation.users = usuarioDonante;
            this.donation.usersReceptor = usuarioReceptor;
            this.donation.donationType = tipoDonativo;
            this.donation.montoDonado = this.form.value.montoDonado;
            this.donation.descripcion = this.form.value.descripcion;
            this.donation.nombre = this.form.value.nombre;
            this.donation.fechaRecojo = this.form.value.fechaRecojo;
            this.donation.direccionRecojo = this.form.value.direccionRecojo;

            // Finalize saving
            if (this.edicion) {
              this.donationsService.update(this.donation).subscribe(() => {
                this.donationsService.list().subscribe((data) => {
                  this.donationsService.setList(data);
                });
              });
            } else {
              this.donationsService.insert(this.donation).subscribe(() => {
                this.donationsService.list().subscribe((data) => {
                  this.donationsService.setList(data);
                });
              });
            }
          });
        });
      });
    }
  }
}