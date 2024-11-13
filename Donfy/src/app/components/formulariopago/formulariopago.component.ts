import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { SaldoXusuarioDTO } from '../../models/SaldoXusuarioDTO';
import { Users } from '../../models/Users'; // Import the Users model
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Role } from '../../models/Role';
import { RoleService } from '../../services/role.service';
import { AppComponent } from '../../app.component';  // Import AppComponent

@Component({
  selector: 'app-formulariopago',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './formulariopago.component.html',
  styleUrls: ['./formulariopago.component.css']
})
export class FormulariopagoComponent implements OnInit {
  saldoActual: number = 0;
  nuevoSaldo: number = 0;
  montoRecarga: number = 0;
  user: Users = new Users();
  Role: Role = new Role(); // Initialize an empty Users object

  constructor(
    private usersService: UsersService,
    private r: RoleService,
    private loginService: LoginService,
    private router: Router,
    private appComponent: AppComponent  // Inject AppComponent here
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

  recargar(): void {
    // Check if montoRecarga is valid
    if (this.montoRecarga <= 0) {
      alert('El monto de recarga debe ser mayor que cero.');
      return;
    }

    // Calculate the new balance based on the input
    this.nuevoSaldo = this.saldoActual + this.montoRecarga;

    // Fetch the user using the username
    const username = this.loginService.showUsername();
    this.usersService.saldo(username).subscribe((data: SaldoXusuarioDTO[]) => {
      if (data.length > 0) {
        this.saldoActual = data[0].saldo;
        this.nuevoSaldo = this.saldoActual + this.montoRecarga;
      }
      
      // Fetch the user ID and update user details
      this.usersService.usuario(username).subscribe((userId: number) => {
        this.usersService.listId(userId).subscribe((userData: Users) => {
          // Update the user's saldo with the new balance
          this.user = userData;
          this.user.saldo = this.nuevoSaldo;

          // Log the JSON data before sending it
          console.log('Sending updated user data:', JSON.stringify(this.user));

          // Send the updated user data to the backend
          this.usersService.update(this.user).subscribe(() => {
            // Handle success if necessary
            console.log('Saldo updated successfully');
            this.Role.rol = "DONADOR";
            this.usersService.usuario(username).subscribe((id: number) => {
              this.usersService.listId(id).subscribe((user: Users) => {
                this.Role.user.id = user.id;
                this.guardarRole(this.Role);
                this.router.navigate(['home']).then(() => {
                  // Reset saldoLoaded flag after navigation
                  this.appComponent.resetSaldoLoaded();  // Reset saldoLoaded in AppComponent
                  this.appComponent.verificar();  // Force saldo reload
                });
              });
            });
          }, error => {
            // Handle error if necessary
            console.error('Error updating saldo', error);
          });
        });
      });
    });
  }

  guardarRole(role: Role) {
    this.r.insert(role).subscribe(
      (response) => {
        const roleResponse = response as Role;  // Forzamos el tipo a Role
        console.log('Role guardado exitosamente:', roleResponse);
        this.Role = roleResponse;  // Asigna la respuesta al Role en el componente
      },
      (error) => {
        console.error('Error al guardar el Role:', error);
      }
    );
  }
}
