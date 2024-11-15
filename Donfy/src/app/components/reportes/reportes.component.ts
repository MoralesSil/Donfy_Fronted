import { Component } from '@angular/core';
import { DonantexfechaComponent } from "./donantexfecha/donantexfecha.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    DonantexfechaComponent,
    RouterOutlet],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {
  constructor(public route: ActivatedRoute) {}
}
