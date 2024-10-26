import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DonationType } from '../../../models/DonationType';
import { DonationtypeService } from '../../../services/donationtype.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-listardonationtype',
  standalone: true,
  imports: [
    MatTableModule,
    RouterModule,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './listardonationtype.component.html',
  styleUrls: ['./listardonationtype.component.css']
})
export class ListardonationtypeComponent implements OnInit {
  dataSource:MatTableDataSource<DonationType>=new MatTableDataSource();

  displayedColumns: string[]=['c1','c2','accion01','accion02']

  constructor(private dtS:DonationtypeService){}

  ngOnInit(): void {
    this.dtS.list().subscribe((data) => {
      // Ordena los datos por idTipoDonation de forma ascendente
      data.sort((a, b) => a.idTipoDonation - b.idTipoDonation);
      this.dataSource = new MatTableDataSource(data);
    });
    
    this.dtS.getList().subscribe(data => {
      // Ordena los datos por idTipoDonation de forma ascendente
      data.sort((a, b) => a.idTipoDonation - b.idTipoDonation);
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    this.dtS.delete(id).subscribe(() => {
      this.dtS.list().subscribe(data => {
        // Ordena nuevamente la lista después de la eliminación
        data.sort((a, b) => a.idTipoDonation - b.idTipoDonation);
        this.dataSource = new MatTableDataSource(data);
      });
    });
  }
}
