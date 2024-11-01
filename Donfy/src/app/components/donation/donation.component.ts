import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListardonationComponent } from "./listardonation/listardonation.component";

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [    
    RouterOutlet,
    ListardonationComponent
  ],
  templateUrl: './donation.component.html',
  styleUrl: './donation.component.css'
})
export class DonationComponent {
constructor(public route:ActivatedRoute) { }

}
