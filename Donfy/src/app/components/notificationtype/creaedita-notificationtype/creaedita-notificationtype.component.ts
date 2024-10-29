import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { MatInputModule} from '@angular/material/input';
import { MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule} from '@angular/material/button';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationType } from '../../../models/NotificationType';
import { NotificationTypeService } from '../../../services/notificationtype.service';

@Component({
  selector: 'app-creaedita-notificationtype',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    FormsModule, 
    MatInputModule,
    MatButtonModule, 
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './creaedita-notificationtype.component.html',
  styleUrl: './creaedita-notificationtype.component.css'
})
export class CreaeditaNotificationtypeComponent implements OnInit{
  form:FormGroup=new FormGroup({});
  notificationtype:NotificationType=new NotificationType();
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private ntS:NotificationTypeService,
    private formBuilder:FormBuilder,
    private router:Router,
    private route:ActivatedRoute
  ){}

  ngOnInit(): void{
    this.route.params.subscribe((data:Params)=>{
      this.id=data['id'];
      this.edicion=data['id']!=null;
      this.init()
    });

    this.form=this.formBuilder.group({
      ntid:[''],
      ntname:['',Validators.required]
    })
  }

  aceptar():void{
    if(this.form.valid){
      this.notificationtype.idTipoNotificacion=this.form.value.ntid;
      this.notificationtype.nombre=this.form.value.ntname;
      
      if(this.edicion){
        this.ntS.update(this.notificationtype).subscribe(data=>{
          this.ntS.list().subscribe((data)=>{
            this.ntS.setList(data);
          })
        })
      }else{
        this.ntS.insert(this.notificationtype).subscribe(d=>{
          this.ntS.list().subscribe(d=>{
            this.ntS.setList(d)
          });
        });
      }
    }
    this.router.navigate(['NotificationType'])
  }

  init(){
    if(this.edicion) {
      this.ntS.listId(this.id).subscribe((data)=>{
        this.form=new FormGroup({
          ntid: new FormControl(data.idTipoNotificacion),
          ntname: new FormControl(data.nombre)
        })
      })
    }
  }
}
