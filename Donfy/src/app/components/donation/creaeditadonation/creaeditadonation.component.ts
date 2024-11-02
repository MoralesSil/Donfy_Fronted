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

  constructor(
    private donationsService: DonationsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = this.id != null;
      this.initForm();
    });

    this.form = this.formBuilder.group({
      tipoDonativo: ['', Validators.required],
      ongReceptora: ['', Validators.required],
      monto: [''],
      descripcion: ['', Validators.required],
      nombreDonativo: ['', Validators.required],
      fechaRecojo: [''],
      direccionRecojo: ['']
    });
  }

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

  initForm(): void {
    if (this.edicion) {
      this.donationsService.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          tipoDonativo: new FormControl(data.donationType),
          ongReceptora: new FormControl(data.userReceptor),
          monto: new FormControl(data.montoDonado),
          descripcion: new FormControl(data.descripcion),
          nombreDonativo: new FormControl(data.nombre),
          fechaRecojo: new FormControl(data.fechaRecojo),
          direccionRecojo: new FormControl(data.direccionRecojo)
        });
      });
    }
  }
}