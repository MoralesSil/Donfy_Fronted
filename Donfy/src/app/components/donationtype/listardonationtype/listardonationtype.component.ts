import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DonationType } from '../../../models/DonationType';
import { DonationtypeService } from '../../../services/donationtype.service';

@Component({
  selector: 'app-listardonationtype',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './listardonationtype.component.html',
  styleUrl: './listardonationtype.component.css'
})
export class ListardonationtypeComponent {
  dataSource:MatTableDataSource<DonationType>=new MatTableDataSource();

  displayedColumns: string[]=['c1','c2']

  constructor(private dtS:DonationtypeService){}

  ngOnInit(): void{
    this.dtS.list().subscribe((data) => {
      this.dataSource=new MatTableDataSource(data)
    }
    )
  }
}
