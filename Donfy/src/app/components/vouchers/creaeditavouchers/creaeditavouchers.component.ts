import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Vouchers } from '../../../models/Vouchers';
import { Donations } from '../../../models/Donations';
import { VouchersService } from '../../../services/vouchers.service';
import { DonationsService } from '../../../services/donations.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-creaeditavouchers',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    CommonModule,
    MatSelectModule,
    RouterLink,
    MatDatepickerModule
  ],
  templateUrl: './creaeditavouchers.component.html',
  styleUrl: './creaeditavouchers.component.css'
})
export class CreaeditavouchersComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  vouchers: Vouchers = new Vouchers();
  id: number = 0;
  listaDonativos: Donations[] = [];
  edicion: boolean = false;
  today: Date = new Date();

  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d ? d > today : false;
  };

  constructor(
    private formBuilder: FormBuilder,
    private vS: VouchersService,
    private dS: DonationsService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      hidComprobante: [''],
      hfechaEmision: ['', Validators.required],
      htotal: ['', [Validators.required, Validators.min(1)]], // Validación para total mayor a 0
      hnombreDonante: ['', [Validators.required, Validators.minLength(3)]], // Nombre mínimo 3 caracteres
      hdescripcion: ['', [Validators.required, Validators.minLength(5)]], // Descripción mínimo 5 caracteres
      hdonations: ['', Validators.required],
    });

    this.dS.list().subscribe((data) => {
      this.listaDonativos = data;
    });
  }

  aceptar(): void {
    if (this.form.invalid) {
      this.snackBar.open('Por favor, complete los campos correctamente.', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    this.vouchers.idComprobante = this.form.value.hidComprobante;
    this.vouchers.fechaEmision = this.form.value.hfechaEmision;
    this.vouchers.total = this.form.value.htotal;
    this.vouchers.nombreDonante = this.form.value.hnombreDonante;
    this.vouchers.descripcion = this.form.value.hdescripcion;
    this.vouchers.donations.idDonation = this.form.value.hdonations;

    if (this.edicion) {
      this.vS.update(this.vouchers).subscribe(() => {
        this.snackBar.open('Registro actualizado exitosamente.', 'Cerrar', {
          duration: 3000,
        });
        this.router.navigate(['Vouchers']);
      });
    } else {
      this.vS.insert(this.vouchers).subscribe(() => {
        this.snackBar.open('Registro creado exitosamente.', 'Cerrar', {
          duration: 3000,
        });
        this.router.navigate(['Vouchers']);
      });
    }
  }

  init(): void {
    if (this.edicion) {
      this.vS.listId(this.id).subscribe((data) => {
        this.form=new FormGroup({
          hidComprobante:new FormControl(data.idComprobante),
          hfechaEmision: new FormControl(data.fechaEmision),
          htotal: new FormControl(data.total),
          hnombreDonante: new FormControl(data.nombreDonante),
          hdescripcion: new FormControl(data.descripcion),
          hdonations: new FormControl(data.donations.idDonation),
        });
      });
    }
  }
}
