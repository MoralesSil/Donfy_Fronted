import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DonationsService } from '../../../services/donations.service';

@Component({
  selector: 'app-donationstypemonth',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    BaseChartDirective,
    CommonModule],
  templateUrl: './donationstypemonth.component.html',
  styleUrl: './donationstypemonth.component.css'
})
export class DonationstypemonthComponent {
  month:number=0
  donaciones: any[] = [];
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'pie';
  barChartLegend = true;
  barChartData: ChartDataset[] = [];

  constructor(private dS: DonationsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
      
  }

  generarReporte(): void {
    if (this.month) {
      this.dS.getCantidadDonativosPorTipoYM(this.month).subscribe((data) => {
        this.barChartLabels = this.donaciones; 
        
        // Aquí asignamos los valores de "conteo" para cada usuario
        const conteo = data.map((item) => item.cantidadDonaciones);
        
        this.barChartData = [
          {
            data: conteo, 
            label: 'Cantidad de donativos por mes',
            backgroundColor: ['#35f842','#f4c216','#373da0','#95b5ea'],
            borderColor: 'rgba(173, 216, 230, 1)',
            borderWidth: 1,
          },
        ];
      });
    } 
  } 

}

