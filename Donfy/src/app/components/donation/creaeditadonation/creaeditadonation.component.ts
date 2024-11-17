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
  templateUrl:'./creaeditadonation.component.html',
  styleUrls: ['./creaeditadonation.component.css']
})
export class CreaeditadonationComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  donation: Donations = new Donations();
  id: number = 0;
  edicion: boolean = false;
  headerTitle: string = '';
  tiposDonativo$!: Observable<DonationType[]>;
  minDate: Date = new Date();  // Fecha mínima configurada como hoy

  // Variables para almacenar los usuarios y ONGs
  usuariosReceptores$!: Observable<Users[]>;  // Observable con los usuarios que son ONGs
  usuariosDonantes$!: Observable<Users[]>;  // Observable con los usuarios donantes

  constructor(
    private donationsService: DonationsService,
    private donationTypeService: DonationtypeService,
    private usersService: UsersService,  // Inyectamos el servicio UsersService
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Suscripción a los parámetros de la ruta
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id']; 
      this.edicion = this.id !== null && this.id > 0; 
      this.initForm();
    });

    // Actualización del título en función de la ruta
    this.route.url.subscribe(urlSegments => {
      const currentPath = urlSegments.join('/'); 
      if (currentPath.includes('nuevo')) {
        this.headerTitle = 'Registrar Nueva Donación';
      } else if (currentPath.includes('Edit')) {
        this.headerTitle = 'Actualizar Donación';
      }

      this.tiposDonativo$ = this.donationTypeService.list(); 
      this.usuariosReceptores$ = this.usersService.getONGs(); 
    });

  }

  initForm(): void {
    this.form = this.formBuilder.group({
      idDonacion: ['-1'],
      tipoDonativo: ['NE', Validators.required],
      ongReceptora: ['NE', Validators.required],
      monto: [0, [Validators.min(0.01)]],
      descripcion: ['NE'],
      nombreDonativo: ['NE'],
      fechaRecojo: ['NE', Validators.required],
      direccionRecojo: ['NE'],
      usuarioDonante: ['NE', Validators.required],
      Eliminado:[false],
    });
  
    // Suscripción a los cambios en el campo `tipoDonativo`
    this.form.get('tipoDonativo')?.valueChanges.subscribe(tipo => {
      this.updateFieldValidators(tipo);
    });
  
    if (this.edicion) {
      this.donationsService.listId(this.id).subscribe((data) => {
        this.form.patchValue({
          idDonacion: data.idDonation,
          tipoDonativo: data.donationType.idTipoDonation,
          ongReceptora: data.usersReceptor.id,
          monto: data.montoDonado,
          descripcion: data.descripcion,
          nombreDonativo: data.nombre,
          fechaRecojo: data.fechaRecojo,
          direccionRecojo: data.direccionRecojo,
          usuarioDonante: data.users.id
        });
        this.updateFieldValidators(data.donationType.idTipoDonation.toString()); // Aplicar validaciones con el tipo actual
      });
    }
  }
  
  // Método para actualizar las validaciones según el tipo de donativo
  updateFieldValidators(tipoDonativo: string): void {
    const monto = this.form.get('monto');
    const descripcion = this.form.get('descripcion');
    const nombreDonativo = this.form.get('nombreDonativo');
    const direccionRecojo = this.form.get('direccionRecojo');
  
    if (tipoDonativo === 'MONETARIO') {
      monto?.setValidators([Validators.required, Validators.min(0.01)]);
      descripcion?.setValue('-');  // Valor por defecto para tipo monetario
      descripcion?.clearValidators();
      nombreDonativo?.setValue('-');
      nombreDonativo?.clearValidators();
      direccionRecojo?.setValue('-');
      direccionRecojo?.clearValidators();
    } else if (tipoDonativo === 'FISICO') {
      monto?.setValue(0);  // Valor por defecto para tipo físico
      monto?.clearValidators();
      descripcion?.setValidators([Validators.required]);
      nombreDonativo?.setValidators([Validators.required]);
      direccionRecojo?.setValidators([Validators.required]);
    }
  
    // Actualizar el estado de validación de los campos
    monto?.updateValueAndValidity();
    descripcion?.updateValueAndValidity();
    nombreDonativo?.updateValueAndValidity();
    direccionRecojo?.updateValueAndValidity();
  }
  
  aceptar(): void {
    if (this.form.valid) {
      this.tiposDonativo$.subscribe(tipos => {
        const tipoDonativo = tipos.find(tipo => tipo.idTipoDonation === this.form.value.tipoDonativo);
        if (!tipoDonativo) {
          console.error('Tipo de donativo no encontrado');
          return;
        }

        this.usersService.listId(this.form.value.ongReceptora).subscribe((usuarioReceptor: Users) => {
          this.donation.usersReceptor = usuarioReceptor;
          this.usersService.usuario('currentUsername').subscribe((usuarioDonanteId: number) => {
            this.usersService.listId(usuarioDonanteId).subscribe((usuarioDonante: Users) => {
              this.donation.users = usuarioDonante;

              // Asignación de otros valores al modelo
              this.donation.donationType = tipoDonativo;
              this.donation.montoDonado = this.form.value.monto;
              this.donation.descripcion = this.form.value.descripcion;
              this.donation.nombre = this.form.value.nombreDonativo;
              this.donation.fechaRecojo = this.form.value.fechaRecojo;
              this.donation.direccionRecojo = this.form.value.direccionRecojo;

              // Inserción o actualización de la donación
              if (this.edicion) {
                this.donationsService.update(this.donation).subscribe(() => {
                  this.donationsService.list().subscribe(data => {
                    this.donationsService.setList(data);
                  });
                });
              } else {
                this.donationsService.insert(this.donation).subscribe(() => {
                  this.donationsService.list().subscribe(data => {
                    this.donationsService.setList(data);
                  });
                });
              }

              this.router.navigate(['Donations']);
            });
          });
        });
      });
    }
  }
}