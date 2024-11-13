import { Component, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterModule } from '@angular/router';
import { NotificationtypeComponent } from "./components/notificationtype/notificationtype.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule} from '@angular/common';
import { DonationtypeComponent } from './components/donationtype/donationtype.component';
import { LoginService } from './services/login.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    NotificationtypeComponent,
    DonationtypeComponent, 
    MatToolbarModule,
    MatMenuModule,
    RouterLink,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Donfy';
  role: string = '';
  username: string = '';
  saldo: number = 0
  
  isSmallScreen: boolean = false;
  isMenuOpen: boolean = false;
  constructor(private loginService: LoginService,private uS: UsersService) {}
  
  // Detectar el tamaño de la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth <= 768;
    if (!this.isSmallScreen) {
      this.isMenuOpen = false; 
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  cerrar() {
    sessionStorage.clear();
  }

  verificar() {
    this.role = this.loginService.showRole();
    this.username = this.loginService.showUsername();
    /*if (this.loginService.showSaldo() !== null && this.loginService.showSaldo() !== "") {
      this.uS.usuario(this.loginService.showSaldo()).subscribe((id: number) => { 
        this.uS.listId(id).subscribe((user: Users) => {
          this.saldo = user.saldo;
        });
      });
    }*/
    return this.loginService.verificar();
  }
    
  isDonador() {
    return this.role === 'DONADOR';
  }

  isAdministrador() {
    return this.role === 'ADMINISTRADOR';
  }

  isOng() {
    return this.role === 'ONG';
  }
  
  ngOnInit() {
    this.isSmallScreen = window.innerWidth <= 768;
  }
}
