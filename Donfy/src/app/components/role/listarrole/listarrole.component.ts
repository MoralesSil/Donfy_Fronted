import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Role } from '../../../models/Role';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-listarrole',
  standalone: true,
  imports: [
    MatTableModule,
    RouterModule,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './listarrole.component.html',
  styleUrl: './listarrole.component.css'
})
export class ListarroleComponent implements OnInit {
  dataSource:MatTableDataSource<Role>=new MatTableDataSource();

  displayedColumns: string[]=['cd1','cd2','cd3']

  constructor(private rS:RoleService){}

  ngOnInit(): void {
    this.rS.list().subscribe((data) => {
      // Ordena los datos por idTipoDonation de forma ascendente
      data.sort((a, b) => a.id - b.id);
      this.dataSource = new MatTableDataSource(data);
    });
    
    this.rS.getList().subscribe(data => {
      // Ordena los datos por idTipoDonation de forma ascendente
      data.sort((a, b) => a.id - b.id);
      this.dataSource = new MatTableDataSource(data);
    });
  }

}
