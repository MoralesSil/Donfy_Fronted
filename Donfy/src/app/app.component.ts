import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { LoginService } from './services/login.service';
import { UsersService } from './services/users.service';
import { SaldoXusuarioDTO } from './models/SaldoXusuarioDTO';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChangeDetectionStrategy, Component, HostListener, inject, TemplateRef } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatMenuModule,
    RouterLink,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,
    RouterModule,
    CommonModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Donfy';
  role: string = '';
  username: string = '';
  saldo: number = 0;
  saldoLoaded: boolean = false;

  isSmallScreen: boolean = false;
  isMenuOpen: boolean = false;
  readonly dialog = inject(MatDialog);

  constructor(
    private loginService: LoginService,
    private uS: UsersService,
    private router: Router) { }

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

  cerrar(dialogTemplate: TemplateRef<any>) {
    const dialogRef = this.dialog.open(dialogTemplate, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        sessionStorage.clear();
        this.router.navigate(['/landing']);
      }
    });
  }

  verificar() {
    this.role = this.loginService.showRole();
    this.username = this.loginService.showUsername();
    if (this.username && !this.saldoLoaded) {
      this.uS.saldo(this.username).subscribe((data: SaldoXusuarioDTO[]) => {
        if (data.length > 0) {
          this.saldo = data[0].saldo;
          this.saldoLoaded = true;
        }
      });
    }
    return this.loginService.verificar();
  }

  resetSaldoLoaded() {
    this.saldoLoaded = false;
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
