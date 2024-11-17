import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Donations } from '../../../models/Donations';
import { DonationsService } from '../../../services/donations.service';
import { LoginService } from '../../../services/login.service';
import { UsersService } from '../../../services/users.service';

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
  displayedColumns: string[] = []; // Inicializamos como un arreglo vacío, lo vamos a modificar dependiendo del rol
  title: string = "Donativos"; // Título por defecto

  constructor(private dnt: DonationsService, private loginService: LoginService, private uS: UsersService) {}

  ngOnInit(): void {
    console.log("Recargando la lista de donativos...");
    const role = this.loginService.showRole(); 
    const username = this.loginService.showUsername();  
  
    if (role === 'DONADOR') {
      this.displayedColumns = ['nombre', 'descripcion', 'estado', 'monto', 'fechaRecojo', 'direccionRecojo', 'usersReceptor'];
      
      this.uS.usuario(username).subscribe(userId => {
        this.dnt.getDonationsByUser(userId).subscribe(donations => {
          this.dataSource = new MatTableDataSource(donations.filter(d => !d.eliminado));
          this.title = "Mis Donativos";
        });
      });
      
    } else if (role === 'ONG') {
      this.displayedColumns = ['nombre', 'descripcion', 'estado', 'monto', 'fechaRecojo', 'direccionRecojo', 'users'];
      this.dnt.getDonationsByOngUsername(username).subscribe(donations => {
        this.dataSource = new MatTableDataSource(donations.filter(d => !d.eliminado));
        this.title = "Donativos Recibidos";
      });
    } else {  // ADMINISTRADOR
      this.displayedColumns = ['id', 'nombre', 'descripcion', 'estado', 'monto', 'fechaRecojo', 'direccionRecojo', 'users', 'usersReceptor'];
      this.dnt.list().subscribe(donations => {
        console.log('Datos recibidos:', donations);
        this.dataSource = new MatTableDataSource(donations.filter(d => !d.eliminado));
      });
      
    }
  }
  

  eliminar(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este donativo?')) {
      this.dnt.listId(id).subscribe(donation => {
        if (donation) {
          donation.eliminado = true; 
          this.dnt.update(donation).subscribe(() => {
            this.ngOnInit(); 
          });
        }
      });
    }
  }  
}