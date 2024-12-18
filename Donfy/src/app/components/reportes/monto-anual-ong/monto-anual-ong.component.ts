import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DonationsService } from '../../../services/donations.service';

@Component({
  selector: 'app-monto-anual-ong',
  standalone: true,
  imports:[
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    CommonModule,
    BaseChartDirective
  ],
  templateUrl: './monto-anual-ong.component.html',
  styleUrl: './monto-anual-ong.component.css'
})
export class MontoAnualOngComponent implements OnInit {
  hasData: boolean = false; 
  year:number=0
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
    if (this.year) {
      this.dS.geSumaOngYear(this.year).subscribe((data) => {
        if (data && data.length > 0) {
          this.hasData = true; // Si hay datos, actualiza `hasData` a `true`
          this.donaciones = data.map((item) => item.nombreONG); 
          this.barChartLabels = this.donaciones; 
          
          const sumas = data.map((item) => item.montoDonado);
          
          this.barChartData = [
            {
              data: sumas,
              label: 'Monto Donado Por ONG',
              backgroundColor: ['#35f842','#f4c216','#373da0','#95b5ea'],
              borderColor: 'rgba(173, 216, 230, 1)',
              borderWidth: 1,
            },
          ];
        } else {
          this.hasData = false; // No hay datos, se muestra el mensaje
        }
      });
    }
  }

}
