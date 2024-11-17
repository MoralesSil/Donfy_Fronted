import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DonationsService } from '../../../services/donations.service';

@Component({
  selector: 'app-donationstadistics',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    BaseChartDirective,
    CommonModule
  ],
  templateUrl: './donationstadistics.component.html',
  styleUrls: ['./donationstadistics.component.css'] // Corrige aquí
})
export class DonationstadisticsComponent implements OnInit {
  hasData: boolean = false; 
  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        beginAtZero: true,
        type: 'linear', // Tipo de escala lineal
        position: 'left', // Posición de la primera escala
        ticks: {
          callback: function(value) {
            return Number(value).toFixed(0); // Mostrar solo valores enteros
          }
        }
      },
      y1: {
        beginAtZero: true,
        type: 'linear', // Segundo eje con escala lineal
        position: 'right', // Colocar el segundo eje a la derecha
        grid: {
          drawOnChartArea: false, // Evita que las líneas de la cuadrícula se superpongan
        },
      },
    },
  };

  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';
  barChartData: ChartDataset[] = [];

  constructor(private dS: DonationsService) {}

  ngOnInit(): void {
    this.dS.getEstadisticas().subscribe((data) => {
      console.log('Datos obtenidos del servicio:', data);
  
      if (data && data.length > 0) {
        this.hasData = true; // Si hay datos, actualiza `hasData` a `true`
        this.barChartLabels = data.map((item) => item.nombreONG);
  
        const cantidadDeDonaciones = data.map((item) => item.totalDonativos || 0);
        const valorTotalEstimado = data.map((item) => item.valorTotalEstimado || 0);
  
        console.log('Cantidad de Donaciones:', cantidadDeDonaciones);
        console.log('Valor Total Estimado:', valorTotalEstimado);
  
        this.barChartData = [
          {
            data: cantidadDeDonaciones,
            label: 'Cantidad de Donaciones',
            backgroundColor: '#4caf50',
            borderColor: ['#35f842','#f4c216','#373da0','#95b5ea'],
            borderWidth: 1,
            yAxisID: 'y',
          },
          {
            data: valorTotalEstimado,
            label: 'Valor Total Estimado',
            backgroundColor: '#2196f3',
            borderColor: ['#35f842','#f4c216','#373da0','#95b5ea'],
            borderWidth: 1,
            yAxisID: 'y1',
          },
        ];
      } else {
        this.hasData = false; // No hay datos, se muestra el mensaje
      }
    }, (error) => {
      console.error('Error al obtener datos del servicio:', error);
    });
  }
}



