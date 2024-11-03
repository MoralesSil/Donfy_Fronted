import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { VouchersService } from '../../../services/vouchers.service';
import { Vouchers } from '../../../models/Vouchers';
import { Params, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-creaeditavouchers',
  standalone: true,
  providers:[provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    MatDatepickerModule,
    FormsModule,
    MatNativeDateModule
  ],
  templateUrl: './creaeditavouchers.component.html',
  styleUrls: ['./creaeditavouchers.component.css']
})
export class CreaeditavouchersComponent implements OnInit{
  form: FormGroup = new FormGroup({});
  vouchers : Vouchers = new Vouchers();
  edicion: boolean = false;
  id: number = 0;
  

    constructor(
      private route: ActivatedRoute, 
      private formBuilder: FormBuilder, 
      private vou:VouchersService, 
      private router:Router

    ){}


    ngOnInit(): void {
      this.form = this.formBuilder.group({
        dNombre: ['', Validators.required],
        dDonante: ['', Validators.required],
        dDescripcion: ['', Validators.required],
        dTotal: ['', Validators.required],
        dFecha: ['', Validators.required]
      });
    
      this.route.params.subscribe((data: Params) => {
        this.id = data['id'];
        this.edicion = this.id != null;
        if (this.edicion) {
          this.vou.listId(this.id).subscribe((voucher) => {
            this.vouchers = voucher;
            this.form.patchValue({
              dNombre: voucher.nombreDonante,
              dDonante: voucher.donations.idDonation,
              dDescripcion: voucher.descripcion,
              dTotal: voucher.total,
              dFecha: voucher.fechaEmision
            });
          });
        }
      });
  }
  

  aceptar(): void {
    if (this.form.valid) {
      this.vouchers.nombreDonante = this.form.value.dNombre;
      this.vouchers.descripcion = this.form.value.dDescripcion;
      this.vouchers.total = this.form.value.dTotal;
      this.vouchers.fechaEmision = this.form.value.dFecha;
      this.vouchers.donations.idDonation = this.form.value.dDonante;

      if (this.edicion) {
        this.vou.update(this.vouchers).subscribe(() => {
          this.vou.list().subscribe((data) => {
            this.vou.setList(data);
          });
        });
      } else {
        this.vou.insert(this.vouchers).subscribe(() => {
          this.vou.list().subscribe((data) => {
            this.vou.setList(data);
          });
        });
      }

      this.router.navigate(['Comprobantes']);
    }
}


  
  
  
  
}


