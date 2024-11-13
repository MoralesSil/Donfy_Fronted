import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DonationType } from '../../../models/DonationType';
import { DonationtypeService } from '../../../services/donationtype.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listardonationtype',
  standalone: true,
  imports: [
    MatTableModule,
    RouterModule,
    MatButtonModule,
    MatIcon,
    MatPaginatorModule
  ],
  templateUrl: './listardonationtype.component.html',
  styleUrls: ['./listardonationtype.component.css']
})
export class ListardonationtypeComponent implements OnInit {
  dataSource:MatTableDataSource<DonationType>=new MatTableDataSource();
  @ViewChild(MatPaginator) Paginator!: MatPaginator;


  displayedColumns: string[]=['c1','c2','accion01','accion02']
  totalRegistros: number = 0;

  constructor(private dtS:DonationtypeService,private SnackBar: MatSnackBar){}

  ngOnInit(): void {
    this.dtS.list().subscribe((data) => {
      // Ordena los datos por idTipoDonation de forma ascendente
      data.sort((a, b) => a.idTipoDonation - b.idTipoDonation);
      this.dataSource = new MatTableDataSource(data);
      this.totalRegistros = data.length;
      this.dataSource.paginator = this.Paginator;
    });
    
    this.dtS.getList().subscribe(data => {
      // Ordena los datos por idTipoDonation de forma ascendente
      data.sort((a, b) => a.idTipoDonation - b.idTipoDonation);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.Paginator;
      this.totalRegistros = data.length; // Actualizar el total de registros aquí
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.Paginator;
  }
  // Aplicar filtro a la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminar(id: number) {
    this.dtS.delete(id).subscribe(() => {
      this.SnackBar.open('Se eliminó con éxito', 'Cerrar', {
        duration: 3000, // Duración del snackbar en milisegundos
        horizontalPosition: 'center', // Posición horizontal
        verticalPosition: 'bottom' // Posición vertical
      });
        this.dtS.list().subscribe(data => {
        data.sort((a, b) => a.idTipoDonation - b.idTipoDonation);
        this.dataSource = new MatTableDataSource(data);
        this.totalRegistros = data.length; // Actualiza el total de registros
        this.dataSource.paginator = this.Paginator; // Mantiene la paginación
      });
    });
  }
}
