import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { SaldoXusuarioDTO } from '../../models/SaldoXusuarioDTO';
import { Users } from '../../models/Users';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Role } from '../../models/Role';
import { RoleService } from '../../services/role.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-formularioretiro',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './formularioretiro.component.html',
  styleUrl: './formularioretiro.component.css'
})
export class FormularioretiroComponent implements OnInit{
  role: string = '';
  saldoActual: number = 0;
  nuevoSaldo: number = 0;
  montoRecarga: number = 0;
  user: Users = new Users();
  Role: Role = new Role();

  constructor(
    private usersService: UsersService,
    private r: RoleService,
    private loginService: LoginService,
    private router: Router,
    private appComponent: AppComponent  
  ) {}

  ngOnInit(): void {
    const username = this.loginService.showUsername();
    this.usersService.saldo(username).subscribe((data: SaldoXusuarioDTO[]) => {
      if (data.length > 0) {
        this.saldoActual = data[0].saldo;
        this.nuevoSaldo = this.saldoActual;
      }
    });
  }

  retiro(): void {
    if (this.montoRecarga <= 0) {
      alert('El monto a retirar debe ser mayor que cero.');
      return;
    }
  
    if (this.montoRecarga > this.saldoActual) {
      alert('No puedes retirar un monto mayor al saldo disponible.');
      return;
    }
  
    const username = this.loginService.showUsername();
    this.usersService.saldo(username).subscribe((data: SaldoXusuarioDTO[]) => {
      if (data.length > 0) {
        this.saldoActual = data[0].saldo;
        this.nuevoSaldo = this.saldoActual - this.montoRecarga;
      }
      
      this.usersService.usuario(username).subscribe((userId: number) => {
        this.usersService.listId(userId).subscribe((userData: Users) => {
          this.user = userData;
          this.user.saldo = this.nuevoSaldo;
  
          console.log('Enviando los datos actualizados del usuario:', JSON.stringify(this.user));
  
          this.usersService.update(this.user).subscribe(() => {
            console.log('Saldo actualizado correctamente');
            this.Role.rol = "ONG";
            this.usersService.usuario(username).subscribe((id: number) => {
              this.usersService.listId(id).subscribe((user: Users) => {
                this.Role.user.id = user.id;
                this.guardarRole(this.Role);
                this.router.navigate(['home']).then(() => {
                  this.appComponent.resetSaldoLoaded(); 
                  this.appComponent.verificar(); 
                });
              });
            });
          }, error => {
            console.error('Error al actualizar el saldo', error);
          });
        });
      });
    });
  }  

  guardarRole(role: Role) {
    this.r.insert(role).subscribe(
      (response) => {
        const roleResponse = response as Role; 
        console.log('Role guardado exitosamente:', roleResponse);
        this.Role = roleResponse; 
      },
      (error) => {
        console.error('Error al guardar el Role:', error);
      }
    );
  }
}
