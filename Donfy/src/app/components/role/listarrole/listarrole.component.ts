import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Role } from '../../../models/Role';
import { RoleService } from '../../../services/role.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-listarrole',
  standalone: true,
  imports: [
    MatTableModule,
    RouterModule,
    MatButtonModule,
    MatIcon,
    MatPaginatorModule
  ],
  templateUrl: './listarrole.component.html',
  styleUrl: './listarrole.component.css'
})
export class ListarroleComponent implements OnInit {
  dataSource:MatTableDataSource<Role>=new MatTableDataSource();
  @ViewChild(MatPaginator) Paginator!: MatPaginator;

  displayedColumns: string[]=['cd1','cd2','cd3']
  totalRegistros: number = 0;

  constructor(
    private rS:RoleService,
  ){}

  ngOnInit(): void {
    this.rS.list().subscribe((data) => {
      // Ordena los datos por idTipoDonation de forma ascendente
      data.sort((a, b) => a.id - b.id);
      this.dataSource = new MatTableDataSource(data);
      this.totalRegistros = data.length;
      this.dataSource.paginator = this.Paginator;
    });
    
    this.rS.getList().subscribe(data => {
      // Ordena los datos por idTipoDonation de forma ascendente
      data.sort((a, b) => a.id - b.id);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.Paginator;
      this.totalRegistros = data.length; // Actualizar el total de registros aquí
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.Paginator;
  }

}
