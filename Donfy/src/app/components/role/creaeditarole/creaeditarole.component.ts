import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Role } from '../../../models/Role';
import { RoleService } from '../../../services/role.service';
import { Router } from '@angular/router';

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
  ro:Role=new Role();

  constructor(private formBuilder:FormBuilder, private rS:RoleService, private router:Router){}
  
  ngOnInit(): void {
      this.form=this.formBuilder.group({
        hrol:['',Validators.required],
        husername:['',Validators.required],
      });
  }

  aceptar(): void{
    if(this.form.valid){
      this.ro.rol=this.form.value.hrol
      this.ro.user.id=this.form.value.husername
      this.rS.insert(this.ro).subscribe((data)=>{
        this.rS.list().subscribe((data)=>{
          this.rS.setList(data);
        });
      });
      //redireccione a la lista
      this.router.navigate(['Roles'])
    }

  }

}
