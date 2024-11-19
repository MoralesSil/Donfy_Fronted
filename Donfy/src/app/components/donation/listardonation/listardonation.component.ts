import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Donations } from '../../../models/Donations';
import { DonationsService } from '../../../services/donations.service';
import { LoginService } from '../../../services/login.service';
import { UsersService } from '../../../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listardonation',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule],
  templateUrl: './listardonation.component.html',
  styleUrl: './listardonation.component.css'
})
export class ListardonationComponent implements OnInit{
  dataSource: MatTableDataSource<Donations> = new MatTableDataSource();


  displayedColumns: string[] = []; 

  constructor(private dnt: DonationsService, private loginService: LoginService, private uS: UsersService, private router: Router) {}

  ngOnInit(): void {
    const role = this.loginService.showRole();
    const username = this.loginService.showUsername();
    if (role === 'DONADOR') {
      this.displayedColumns = ['nombre', 'descripcion', 'estado', 'monto', 'fechaRecojo', 'direccionRecojo', 'usersReceptor'];
      this.uS.usuario(username).subscribe(userId => {
        this.dnt.getDonationsByUser(userId).subscribe(data => {
          this.dataSource = new MatTableDataSource(data);
        });
      });
    } else if (role === 'ONG') {
      this.displayedColumns = ['nombre', 'descripcion', 'estado', 'monto', 'fechaRecojo', 'direccionRecojo', 'users'];
      this.dnt.getDonationsByOngUsername(username).subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
      });
    } else {  // ADMINISTRADOR
      this.displayedColumns = ['id', 'nombre', 'descripcion', 'estado', 'monto', 'fechaRecojo', 'direccionRecojo', 'users', 'usersReceptor', 'acciones'];
      this.dnt.list().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
      });
    }
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este donativo?')) {
      this.dnt.listId(id).subscribe(donation => {
        if (donation) {
          donation.eliminado = true; // Marca como eliminado
          this.dnt.update(donation).subscribe(() => {
            this.ngOnInit();
          });
        }
      });
    }
  }

  editar(id: number): void {
    console.log(`Editando donación con ID: ${id}`);
    this.router.navigate([`Donations/Edit/${id}`]);
  }
}