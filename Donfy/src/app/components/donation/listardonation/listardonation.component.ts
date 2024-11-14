import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Donations } from '../../../models/Donations';
import { DonationsService } from '../../../services/donations.service';
import { LoginService } from '../../../services/login.service';

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
  dataSource: MatTableDataSource<Donations> = new MatTableDataSource();
  displayedColumns: string[] = []; // Inicializamos como un arreglo vacío, lo vamos a modificar dependiendo del rol
  title: string = "Donativos"; // Título por defecto

  constructor(private dnt: DonationsService, private loginService: LoginService) {}

  ngOnInit(): void {
    console.log("Recargando la lista de donativos...");
    const role = this.loginService.showRole();  // Obtenemos el rol del usuario
    const username = this.loginService.showUsername();  // Obtenemos el username del usuario

    // Dependiendo del rol, configuramos las columnas que se van a mostrar
    if (role === 'DONADOR') {
      this.displayedColumns = ['nombre', 'descripcion', 'estado', 'monto', 'fechaRecojo', 'direccionRecojo', 'usersReceptor', 'eliminar', 'actualizar'];
      this.dnt.getDonationsByUser(username).subscribe(donations => {
        // Filtrar donativos eliminados
        const activeDonations = donations.filter(donation => !donation.eliminado);
        this.dataSource = new MatTableDataSource(activeDonations);
        this.title = "Mis Donativos";
      });
    } else if (role === 'ONG') {
      this.displayedColumns = ['nombre', 'descripcion', 'estado', 'monto', 'fechaRecojo', 'direccionRecojo'];
      this.dnt.getDonationsByOngUsername(username).subscribe(donations => {
        // Filtrar donativos eliminados
        const activeDonations = donations.filter(donation => !donation.eliminado);
        this.dataSource = new MatTableDataSource(activeDonations);
        this.title = "Donativos Recibidos";
      });
    } else {
      this.displayedColumns = ['id', 'nombre', 'descripcion', 'estado', 'monto', 'fechaRecojo', 'direccionRecojo', 'users', 'usersReceptor'];
      this.dnt.list().subscribe(donations => {
        // Filtrar donativos eliminados
        const activeDonations = donations.filter(donation => !donation.eliminado);
        this.dataSource = new MatTableDataSource(activeDonations);
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