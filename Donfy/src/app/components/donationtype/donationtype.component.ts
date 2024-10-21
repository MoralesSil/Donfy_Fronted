import { Component, OnInit } from '@angular/core';
import { ListardonationtypeComponent } from './listardonationtype/listardonationtype.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-donationtype',
  standalone: true,
  imports: [ListardonationtypeComponent,RouterOutlet],
  templateUrl: './donationtype.component.html',
  styleUrl: './donationtype.component.css'
})
export class DonationtypeComponent implements OnInit {
  constructor(public route:ActivatedRoute){}
  ngOnInit(): void {}
}
