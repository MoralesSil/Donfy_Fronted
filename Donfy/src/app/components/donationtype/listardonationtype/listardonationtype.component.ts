import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DonationType } from '../../../models/DonationType';
import { DonationtypeService } from '../../../services/donationtype.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-listardonationtype',
  standalone: true,
  imports: [
    MatTableModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './listardonationtype.component.html',
  styleUrl: './listardonationtype.component.css'
})
export class ListardonationtypeComponent implements OnInit {
  dataSource:MatTableDataSource<DonationType>=new MatTableDataSource();

  displayedColumns: string[]=['c1','c2','accion01']

  constructor(private dtS:DonationtypeService){}

  ngOnInit(): void{
    this.dtS.list().subscribe((data) => {
      this.dataSource=new MatTableDataSource(data)
    });
    this.dtS.getList().subscribe(data=>{
      this.dataSource=new MatTableDataSource(data);
    });
  }
  eliminar(id:number){
    this.dtS.delete(id).subscribe(data=>{
      this.dtS.list().subscribe(data=>{
        this.dtS.setList(data);
      });
    });
  }
}
