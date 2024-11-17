import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Vouchers } from '../../../models/Vouchers';
import { VouchersService } from '../../../services/vouchers.service';

@Component({
  selector: 'app-listarvouchers',
  standalone: true,
  imports: [
    MatTableModule,
    RouterModule,
    MatButtonModule,
    MatIcon,
    MatPaginatorModule
  ],
  templateUrl: './listarvouchers.component.html',
  styleUrl: './listarvouchers.component.css'
})
export class ListarvouchersComponent implements OnInit{
  dataSource:MatTableDataSource<Vouchers>=new MatTableDataSource();
  @ViewChild(MatPaginator) Paginator!: MatPaginator;

  displayedColumns: string[]=['cd1','cd2','cd3','cd4', 'cd5','cd6','cd7','cd8']
  totalRegistros: number = 0;

  constructor(
    private vS:VouchersService,
  ){}

  ngOnInit(): void {
    this.vS.list().subscribe((data) => {
      data.sort((a, b) => a.idComprobante - b.idComprobante);
      this.dataSource = new MatTableDataSource(data);
      this.totalRegistros = data.length;
      this.dataSource.paginator = this.Paginator;
    });
    
    this.vS.getList().subscribe(data => {
      data.sort((a, b) => a.idComprobante - b.idComprobante);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.Paginator;
      this.totalRegistros = data.length; // Actualizar el total de registros aquí
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.Paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminar(id: number): void {
    this.vS.delete(id).subscribe(() => {
      this.vS.list().subscribe((data) => {
        this.vS.setList(data);
      });
    });
  }

}
