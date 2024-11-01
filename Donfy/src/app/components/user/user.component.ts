import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarUserComponent } from './listar-user/listar-user.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterOutlet,
    ListarUserComponent
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  constructor(public route:ActivatedRoute){}
}
