import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Chart, ChartDataset, ChartOptions, ChartType, registerables } from 'chart.js';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { DonationsService } from '../../../services/donations.service';
import { TrendsDonationsDTO } from '../../../models/TrendsDonationsDTO';

Chart.register(...registerables); 

@Component({
  selector: 'app-tendenciasdonacionesmes',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    BaseChartDirective,
    CommonModule
  ],
  templateUrl: './tendenciasdonacionesmes.component.html',
  styleUrl: './tendenciasdonacionesmes.component.css'
})
export class TendenciasdonacionesmesComponent implements OnInit{
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataset[] = [];

  constructor(private dS: DonationsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.tendenciasDonaciones();
  }

  tendenciasDonaciones(): void {
    this.dS.getTendencias().subscribe((data: TrendsDonationsDTO[]) => {
      const labels = Array.from(new Set(data.map(item => item.date.toString()))); 
      const datasets: { [key: string]: number[] } = {};

      data.forEach(item => {
        const tipoDonacion = item.donationType;
        const fecha = item.date.toString();
        const total = item.totalDonations;

        if (!datasets[tipoDonacion]) {
          datasets[tipoDonacion] = Array(labels.length).fill(0);
        }
        const fechaIndex = labels.indexOf(fecha);
        if (fechaIndex > -1) {
          datasets[tipoDonacion][fechaIndex] = total;
        }
      });

      this.barChartLabels = labels;
      this.barChartData = Object.keys(datasets).map(tipo => ({
        data: datasets[tipo],
        label: tipo,
        backgroundColor: '#006644',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      }));

      this.cdr.detectChanges();
    });
  }
}
