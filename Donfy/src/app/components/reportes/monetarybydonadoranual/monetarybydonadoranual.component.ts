import { Component } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { DonationsService } from '../../../services/donations.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-monetarybydonadoranual',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    BaseChartDirective,
    CommonModule  ],
  templateUrl:'./monetarybydonadoranual.component.html',
  styleUrl: './monetarybydonadoranual.component.css'
})
export class MonetarybydonadoranualComponent {
  year:number=0
  donaciones: any[] = [];
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataset[] = [];

  constructor(private dS: DonationsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
      
  }

  generarReporte(): void {
    if (this.year) {
      this.dS.getMonetaryByDonor(this.year).subscribe((data) => {
        this.donaciones = data.map((item) => item.nombreDonante); 
        this.barChartLabels = this.donaciones; 
        
        // Aquí asignamos los valores de "suma" para cada usuario
        const sumas = data.map((item) => item.montoDonado);
        
        this.barChartData = [
          {
            data: sumas,  // Usamos los valores de "suma"
            label: 'Monto Anual invertido Por Donador',
            backgroundColor: ['#35f842','#f4c216','#373da0','#95b5ea'],
            borderColor: 'rgba(173, 216, 230, 1)',
            borderWidth: 1,
          },
        ];
      });
    } 
  } 

}