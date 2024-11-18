import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { Users } from '../../../models/Users';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';  // Asegúrate de importar Router

@Component({
  selector: 'app-ongs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ongs.component.html',
  styleUrl: './ongs.component.css'
})
export class ONGsComponent implements OnInit {
  title = 'Donfy';
  ongs: Users[] = [];  // Tipamos correctamente como Users[]

  constructor(
    private usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.usersService.getONGs().subscribe(data => {
      this.ongs = data;
    });
  }

  donar(ongId: number) {
    console.log('Donando a la ONG con ID:', ongId);
    this.router.navigate(['/Donations/nuevo']);
  }

}