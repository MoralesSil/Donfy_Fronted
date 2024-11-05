import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-creaeditarole',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './creaeditarole.component.html',
  styleUrl: './creaeditarole.component.css'
})
export class CreaeditaroleComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  
  ngOnInit(): void {
      
  }

  aceptar(){
    
  }

}
