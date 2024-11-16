import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Chart, ChartDataset, ChartOptions, ChartType, registerables } from 'chart.js';
import { UsersService } from '../../../services/users.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';

Chart.register(...registerables); 

@Component({
  selector: 'app-donantexfecha',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    BaseChartDirective,
    CommonModule
  ],
  templateUrl: './donantexfecha.component.html',
  styleUrls: ['./donantexfecha.component.css']
})
export class DonantexfechaComponent implements OnInit{
  startDate: string = '';
  endDate: string = '';
  users: any[] = [];
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataset[] = [];

  constructor(private uS: UsersService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    
  }

  generarReporte(): void {
    if (this.startDate && this.endDate) {
      this.uS.getDonanteXfecha(this.startDate, this.endDate).subscribe((data) => {
        this.users = data.map((item) => item.nombre); 
        this.barChartLabels = this.users; 
        
        // Aquí asignamos los valores de "suma" para cada usuario
        const sumas = data.map((item) => item.suma);
        
        this.barChartData = [
          {
            data: sumas,  // Usamos los valores de "suma"
            label: 'Cantidad de Donaciones',
            backgroundColor: '#4682B4',
            borderColor: 'rgba(173, 216, 230, 1)',
            borderWidth: 1,
          },
        ];
      });
    } 
  } 
}
