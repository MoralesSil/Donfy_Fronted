import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterModule } from '@angular/router';
import { NotificationtypeComponent } from "./components/notificationtype/notificationtype.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgIf } from '@angular/common';
import { DonationtypeComponent } from './components/donationtype/donationtype.component';
import { LoginService } from './services/login.service';

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
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Donfy';
  
  constructor(private loginService: LoginService) {}
  cerrar() {
    sessionStorage.clear();
  }
}
