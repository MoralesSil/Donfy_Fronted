import { Component, OnInit } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DonationType } from '../../../models/DonationType';
import { DonationtypeService } from '../../../services/donationtype.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creaeditadonationtype',
  standalone: true,
  imports: [MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './creaeditadonationtype.component.html',
  styleUrl: './creaeditadonationtype.component.css'
})
export class CreaeditadonationtypeComponent implements OnInit {
  form:FormGroup=new FormGroup({});
  donaciontipo:DonationType=new DonationType();

  constructor(
    private dtS:DonationtypeService,
    private formBuilder:FormBuilder,
    private router:Router
  ){}

  ngOnInit(): void {
    this.form= this.formBuilder.group({
      htipodonacion:['',Validators.required]
    });
  };

  aceptar():void{
    if(this.form.valid){
      this.donaciontipo.nombreTipoDonation=this.form.value.htipodonacion;
      this.dtS.insert(this.donaciontipo).subscribe(d=>{
        this.dtS.list().subscribe(d=>{
          this.dtS.setList(d);
        });
      });
    }
    this.router.navigate(['DonationType']);
  }
}
