import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Vouchers } from '../../../models/Vouchers';
import { VouchersService } from '../../../services/vouchers.service';

@Component({
  selector: 'app-listarvouchers',
  standalone: true,
  imports: 
    [MatTableModule,
    RouterLink,
    MatIconModule
    ],
  templateUrl: './listarvouchers.component.html',
  styleUrl: './listarvouchers.component.css'
})
export class ListarvouchersComponent {

  dataSource:MatTableDataSource<Vouchers>=new MatTableDataSource();
  
  displayedColumns: string[] = [
    'idComprobante', 
    'nombre', 
    'idDonativo', 
    'descripcion', 
    'monto', 
    'fechaEmision',
    'actualizar',
    'borrar'
  ];

  constructor(private vou: VouchersService) {}

  ngOnInit(): void{
    this.vou.list().subscribe((data) => {
      this.dataSource=new MatTableDataSource(data)
    });

    this.vou.getList().subscribe((data)=>{
      this.dataSource=new MatTableDataSource(data);
    })
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este comprobante?')) {
      this.vou.delete(id).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter(voucher => voucher.idComprobante !== id);
      }, (error) => {
        console.error('Error al eliminar el voucher', error);
      });
    }
  }

  

}
