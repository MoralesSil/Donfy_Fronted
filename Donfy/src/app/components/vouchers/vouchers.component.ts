import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarvouchersComponent } from './listarvouchers/listarvouchers.component';

@Component({
  selector: 'app-vouchers',
  standalone: true,
  imports: [RouterOutlet, ListarvouchersComponent],
  templateUrl: './vouchers.component.html',
  styleUrl: './vouchers.component.css'
})
export class VouchersComponent {
  constructor(public route:ActivatedRoute){}
}
