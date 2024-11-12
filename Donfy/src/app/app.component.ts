import { Component } from '@angular/core';
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
import { Users } from './models/Users';
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
<<<<<<< HEAD
    CommonModule
    
=======
    CommonModule,
>>>>>>> edea6628f735103b1119fda8d4bf2896365393b4
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Donfy';
  role: string = '';
  saldo: number = 0
  
  constructor(private loginService: LoginService,private uS: UsersService) {}
  cerrar() {
    
    sessionStorage.clear();
  }

  verificar() {
    this.role = this.loginService.showRole();
    this.uS.usuario(this.loginService.showSaldo()).subscribe((id: number) => {
              
      this.uS.listId(id).subscribe((user: Users) => {
        this.saldo = user.saldo;
      });
    });
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
}
