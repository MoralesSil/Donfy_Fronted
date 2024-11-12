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
import { DonationtypeService } from '../../../services/donationtype.service'; // Asegúrate de que este servicio esté definido
import { DonationType } from '../../../models/DonationType';
import { Observable } from 'rxjs';

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
  tiposDonativo$!: Observable<DonationType[]>; // Observable de tipos de donativo

  constructor(
    private donationsService: DonationsService,
    private donationTypeService: DonationtypeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener id desde la URL para saber si estamos en edición
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id']; // Obtener el id de los parámetros de la URL
      this.edicion = this.id !== null && this.id > 0; // Si el id es válido, estamos en edición
      this.initForm();
    });

    this.route.url.subscribe(urlSegments => {
      const currentPath = urlSegments.join('/'); 
      if (currentPath.includes('nuevo')) {
        this.headerTitle = 'Registrar Nueva Donación';
      } else if (currentPath.includes('Edit')) {
        this.headerTitle = 'Actualizar Donación';
      }
    });

    // Obtener los tipos de donativo
    this.tiposDonativo$ = this.donationTypeService.list();  // Obtener los tipos de donativo

    // Establecer el valor inicial de 'tipoDonativo' si es necesario
    this.tiposDonativo$.subscribe(data => {
      this.form.get('tipoDonativo')?.setValue(data[0]?.idTipoDonation);
    });

    // Suscribirse a los cambios en el tipo de donativo
    this.form.get('tipoDonativo')?.valueChanges.subscribe(value => {
      this.updateFieldValidators(value);
    });
  }

  // Método para inicializar el formulario
  initForm(): void {
    if (this.edicion) {
      this.donationsService.listId(this.id).subscribe((data) => {
        this.form = this.formBuilder.group({
          idDonacion: [data.idDonation],
          tipoDonativo: [data.donationType.idTipoDonation, Validators.required],
          ongReceptora: [data.userReceptor, Validators.required],
          monto: [data.montoDonado],
          descripcion: [data.descripcion, Validators.required],
          nombreDonativo: [data.nombre, Validators.required],
          fechaRecojo: [data.fechaRecojo],
          direccionRecojo: [data.direccionRecojo]
        });

        // Actualizar las validaciones y visibilidad de campos
        this.updateFieldValidators(data.donationType.idTipoDonation.toString());
      });
    } else {
      this.form = this.formBuilder.group({
        idDonacion: [''],
        tipoDonativo: ['', Validators.required],
        ongReceptora: ['', Validators.required],
        monto: [''],
        descripcion: ['', Validators.required],
        nombreDonativo: ['', Validators.required],
        fechaRecojo: [''],
        direccionRecojo: ['']
      });

      // Establecer las validaciones iniciales
      this.updateFieldValidators(this.form.get('tipoDonativo')?.value);
    }
  }

  // Método para actualizar las validaciones de los campos según el tipo de donativo
  updateFieldValidators(tipoDonativo: string): void {
    const monto = this.form.get('monto');
    const descripcion = this.form.get('descripcion');
    const nombreDonativo = this.form.get('nombreDonativo');
    const direccionRecojo = this.form.get('direccionRecojo');

    if (tipoDonativo === 'MONETARIO') {
      monto?.setValidators([Validators.required]);
      descripcion?.clearValidators();
      nombreDonativo?.clearValidators();
      direccionRecojo?.clearValidators();
    } else if (tipoDonativo === 'FISICO') {
      monto?.clearValidators();
      descripcion?.setValidators([Validators.required]);
      nombreDonativo?.setValidators([Validators.required]);
      direccionRecojo?.setValidators([Validators.required]);
    }

    // Actualizar la validez de los campos después de cambiar los validadores
    monto?.updateValueAndValidity();
    descripcion?.updateValueAndValidity();
    nombreDonativo?.updateValueAndValidity();
    direccionRecojo?.updateValueAndValidity();
  }

  // Método para manejar el envío del formulario
  aceptar(): void {
    if (this.form.valid) {
      this.donation.donationType = this.form.value.tipoDonativo;
      this.donation.userReceptor = this.form.value.ongReceptora;
      this.donation.montoDonado = this.form.value.monto;
      this.donation.descripcion = this.form.value.descripcion;
      this.donation.nombre = this.form.value.nombreDonativo;
      this.donation.fechaRecojo = this.form.value.fechaRecojo;
      this.donation.direccionRecojo = this.form.value.direccionRecojo;

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
      this.router.navigate(['Donations']);
    }
  }
}