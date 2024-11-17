import { Component } from '@angular/core';
import { ListarvouchersComponent } from './listarvouchers/listarvouchers.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-vouchers',
  standalone: true,
  imports: [ListarvouchersComponent,RouterOutlet],
  templateUrl: './vouchers.component.html',
  styleUrl: './vouchers.component.css'
})
export class VouchersComponent {
  constructor(public route:ActivatedRoute){}
}
