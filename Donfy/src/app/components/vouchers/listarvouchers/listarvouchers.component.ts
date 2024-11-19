import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Vouchers } from '../../../models/Vouchers';
import { VouchersService } from '../../../services/vouchers.service';
import { LoginService } from '../../../services/login.service';
<<<<<<< HEAD
=======
import { UsersService } from '../../../services/users.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
>>>>>>> main

@Component({
  selector: 'app-listarvouchers',
  standalone: true,
  imports: [
    MatTableModule,
    RouterModule,
    MatButtonModule,
    MatIcon,
    MatPaginatorModule,
    CommonModule
  ],
  templateUrl: './listarvouchers.component.html',
  styleUrls: ['./listarvouchers.component.css']
})
export class ListarvouchersComponent implements OnInit {
  displayedColumns: string[] = ['cd1', 'cd2', 'cd3', 'cd4', 'cd5', 'cd6'];
  dataSource = new MatTableDataSource<Vouchers>();
  role: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
<<<<<<< HEAD
    private vS:VouchersService,
    private loginService: LoginService
  ){}

  ngOnInit(): void {
    const role = this.loginService.showRole();
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
=======
    private vS: VouchersService,
    private loginService: LoginService,
    private uS: UsersService
  ) {}

  ngOnInit(): void {
    this.role = this.loginService.showRole();
    this.configureColumns();
    this.listarVouchers();
>>>>>>> main
  }

  configureColumns(): void {
    if (this.role === 'ADMINISTRADOR') {
      this.displayedColumns = [...this.displayedColumns, 'cd7', 'cd8'];
    }
  }

  listarVouchers(): void {
    const username = this.loginService.showUsername();
    this.uS.usuario(username).subscribe(user => {
      const userId = user;
      this.vS.listByUser(userId).subscribe(vouchers => {
        this.dataSource = new MatTableDataSource(vouchers);
        this.dataSource.paginator = this.paginator;
      });
    });
  }

<<<<<<< HEAD
  isAdministrador(): boolean {
    const role = this.loginService.showRole();
    console.log('Rol detectado en isAdministrador:', role);
    return role === 'ADMINISTRADOR';
  }
  
 

}
=======
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  eliminar(idComprobante: number): void {
    console.log(`Eliminar voucher con ID: ${idComprobante}`);
  }
}
>>>>>>> main
