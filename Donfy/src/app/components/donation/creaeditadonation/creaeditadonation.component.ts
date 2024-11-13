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
import { UsersService } from '../../../services/users.service';  // Asegúrate de que la ruta sea correcta
import { Users } from '../../../models/Users';

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

  // Variables para almacenar los usuarios y ONGs
  usuariosReceptores$!: Observable<Users[]>; // Observable con los usuarios que son ONGs
  usuariosDonantes$!: Observable<Users[]>; // Observable con los usuarios donantes

  // Inyectar el servicio UsersService
  constructor(
    private donationsService: DonationsService,
    private donationTypeService: DonationtypeService,
    private usersService: UsersService,  // Aquí inyectamos UsersService
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id']; 
      this.edicion = this.id !== null && this.id > 0; 
      this.initForm();
    });

    this.route.url.subscribe(urlSegments => {
      const currentPath = urlSegments.join('/'); 
      if (currentPath.includes('nuevo')) {
        this.headerTitle = 'Registrar Nueva Donación';
      } else if (currentPath.includes('Edit')) {
        this.headerTitle = 'Actualizar Donación';
      }
      this.tiposDonativo$ = this.donationTypeService.list(); 

      // Obtener usuarios con rol ONG
      //this.usuariosReceptores$ = this.usersService.listByRole('ONG');  // Obtener usuarios con rol ONG
      //this.usuariosDonantes$ = this.usersService.listByRole('DONANTE');  // Obtener usuarios con rol DONANTE
    });

    this.tiposDonativo$.subscribe(data => {
      this.form.get('tipoDonativo')?.setValue(data[0]?.idTipoDonation);
    });

    this.form.get('tipoDonativo')?.valueChanges.subscribe(value => {
      this.updateFieldValidators(value);
    });
  }

  initForm(): void {
    if (this.edicion) {
      this.donationsService.listId(this.id).subscribe((data) => {
        this.form = this.formBuilder.group({
          idDonacion: [data.idDonation],
          tipoDonativo: [data.donationType.idTipoDonation, Validators.required],
          ongReceptora: [data.userReceptor.id, Validators.required],
          monto: [data.montoDonado],
          descripcion: [data.descripcion, Validators.required],
          nombreDonativo: [data.nombre],
          fechaRecojo: [data.fechaRecojo],
          direccionRecojo: [data.direccionRecojo],
          usuarioDonante: [data.user.id, Validators.required] // Receptor de la donación
        });

        this.updateFieldValidators(data.donationType.idTipoDonation.toString());
      });
    } else {
      this.form = this.formBuilder.group({
        idDonacion: [''],
        tipoDonativo: ['', Validators.required],
        ongReceptora: ['', Validators.required],
        monto: [0],
        descripcion: ['', Validators.required],
        nombreDonativo: ['', Validators.required],
        fechaRecojo: [''],
        direccionRecojo: [''],
        usuarioDonante: ['', Validators.required] // Receptor de la donación
      });

      this.updateFieldValidators(this.form.get('tipoDonativo')?.value);
    }
  }

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

    monto?.updateValueAndValidity();
    descripcion?.updateValueAndValidity();
    nombreDonativo?.updateValueAndValidity();
    direccionRecojo?.updateValueAndValidity();
  }

  aceptar(): void {
    if (this.form.valid) {
      // Asignación de donationType usando un enfoque similar al ejemplo de tipoNotificacion
      this.tiposDonativo$.subscribe(tipos => {
        const tipoDonativo = tipos.find(tipo => tipo.idTipoDonation === this.form.value.tipoDonativo);
        if (tipoDonativo) {
          this.donation.donationType = tipoDonativo;

          // Obtener el usuario receptor completo
          this.usersService.listId(this.form.value.ongReceptora).subscribe((usuarioReceptor: Users) => {
            this.donation.userReceptor = usuarioReceptor;
    
            // Obtener el usuario logueado y asignarlo como donante
            this.usersService.usuario('currentUsername').subscribe((usuarioDonanteId: number) => {
              this.usersService.listId(usuarioDonanteId).subscribe((usuarioDonante: Users) => {
                this.donation.user = usuarioDonante;
    
                // Asignación de otros campos de la donación
                this.donation.montoDonado = this.form.value.monto;
                this.donation.descripcion = this.form.value.descripcion;
                this.donation.nombre = this.form.value.nombreDonativo;
                this.donation.fechaRecojo = this.form.value.fechaRecojo;
                this.donation.direccionRecojo = this.form.value.direccionRecojo;
    
                // Crear o actualizar la donación
                if (this.edicion) {
                  this.donationsService.update(this.donation).subscribe(() => {
                    // Actualizar la lista de donaciones después de modificar
                    this.donationsService.list().subscribe((data) => {
                      this.donationsService.setList(data);
                    });
                  });
                } else {
                  this.donationsService.insert(this.donation).subscribe(() => {
                    // Actualizar la lista de donaciones después de registrar
                    this.donationsService.list().subscribe((data) => {
                      this.donationsService.setList(data);
                    });
                  });
                }
    
                // Navegar a la lista de donaciones
                this.router.navigate(['Donations']);
              });
            });
          });
        }
      });
    }
  }
}  