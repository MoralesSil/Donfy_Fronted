import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { Users } from '../../../models/Users';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';  // Asegúrate de importar Router

@Component({
  selector: 'app-ongs',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./ongs.component.html',
  styleUrl: './ongs.component.css'
})
export class ONGsComponent implements OnInit {
  title = 'Donfy';
  ongs: Users[] = [];  // Tipamos correctamente como Users[]
  idOngSeleccionada: number = 0;

  constructor(
    private usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.usersService.getONGs().subscribe(data => {
      this.ongs = data;
      console.log(this.ongs);  // Verifica la estructura aquí
    });
  }
  navegarADonacion(ong: Users): void {
    console.log('Donando a la ONG con ID:', ong.id);
    this.router.navigate(['/Donations/nuevo', ong.id], { state: { ongData: ong } });
  }  
  
}