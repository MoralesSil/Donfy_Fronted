import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Donations } from '../../../models/Donations';
import { DonationsService } from '../../../services/donations.service';

@Component({
  selector: 'app-listardonation',
  standalone: true,
  imports: [    
    MatTableModule,
    RouterLink,
    MatIconModule],
  templateUrl: './listardonation.component.html',
  styleUrl: './listardonation.component.css'
})
export class ListardonationComponent {
  dataSource:MatTableDataSource<Donations>=new MatTableDataSource();
  
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'estado', 'monto', 'fechaRecojo', 'direccionRecojo', 'userReceptor', 'eliminar', 'actualizar'];

  constructor(private dnt: DonationsService) {}

  ngOnInit(): void {
    this.dnt.list().subscribe((data) => {
      console.log(data);  
      this.dataSource = new MatTableDataSource(data);
    });
  
    this.dnt.getList().subscribe((data) => {
      console.log(data);  
      this.dataSource = new MatTableDataSource(data);
    });
  }
  
  eliminar(id:number){
    if (confirm('¿Estás seguro de que deseas eliminar este donativo?')){
      this.dnt.delete(id).subscribe(data=>{
        this.dnt.list().subscribe(data=>{
          this.dnt.setList(data);
        });
      });
    }
  }
}
