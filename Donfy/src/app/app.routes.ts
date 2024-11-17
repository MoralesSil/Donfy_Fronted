import { Routes } from '@angular/router';
import { NotificationtypeComponent } from './components/notificationtype/notificationtype.component';
import { DonationtypeComponent } from './components/donationtype/donationtype.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CreaeditaNotificationtypeComponent } from './components/notificationtype/creaedita-notificationtype/creaedita-notificationtype.component';
import { CreaeditadonationtypeComponent } from './components/donationtype/creaeditadonationtype/creaeditadonationtype.component';
import { ListardonationtypeComponent } from './components/donationtype/listardonationtype/listardonationtype.component';
import { CreaeditadonationComponent } from './components/donation/creaeditadonation/creaeditadonation.component';
import { DonationComponent } from './components/donation/donation.component';
import { UserComponent } from './components/user/user.component';
import { CreaeditaUserComponent } from './components/user/creaedita-user/creaedita-user.component';
import { NotificationComponent } from './components/notification/notification.component';
import { CreaeditanotificationComponent } from './components/notification/creaeditanotification/creaeditanotification.component';
import { RoleComponent } from './components/role/role.component';
import { CreaeditaroleComponent } from './components/role/creaeditarole/creaeditarole.component';
import { seguridadGuard } from './guard/seguridad.guard';
import { FormulariopagoComponent } from './components/formulariopago/formulariopago.component';
import { HomeComponent } from './components/home/home.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { DonantexfechaComponent } from './components/reportes/donantexfecha/donantexfecha.component';
import { MontoAnualOngComponent } from './components/reportes/monto-anual-ong/monto-anual-ong.component';
import { DonationstadisticsComponent } from './components/reportes/donationstadistics/donationstadistics.component';
import { MonetarybydonadoranualComponent } from './components/reportes/monetarybydonadoranual/monetarybydonadoranual.component';
import { DonationstypemonthComponent } from './components/reportes/donationstypemonth/donationstypemonth.component';
import { ONGsComponent } from './components/ONGs/ongs/ongs.component';

export const routes: Routes =
    [
        {
            path: '',
            redirectTo: 'landing',
            pathMatch: 'full',
        },
        {
            path: 'landing',
            component: LandingComponent
        },
        {
            path: 'NotificationType',
            component: NotificationtypeComponent,
            children: [
                {
                    path: 'New',
                    component: CreaeditaNotificationtypeComponent
                },
                {
                    path: 'Ediciones/:id',
                    component: CreaeditaNotificationtypeComponent
                }
            ],
            canActivate: [seguridadGuard],
        },
        {
            path: 'Users',
            component: UserComponent,
            children: [
                {
                    path: 'New',
                    component: CreaeditaUserComponent
                },
                {
                    path: 'Ediciones/:username',
                    component: CreaeditaUserComponent
                }
            ],
            canActivate: [seguridadGuard],
        },
        {
            path: 'login',
            component: LoginComponent,
        },
        {
            path: 'registrar',
            component: RegisterComponent,
        },
        {
            path: 'home',
            component: HomeComponent
        },
        {
            path: 'DonationType',
            component: DonationtypeComponent,
            canActivate: [seguridadGuard],
        },
        {
            path: 'DonationType/listar',
            component: ListardonationtypeComponent,
            canActivate: [seguridadGuard],
        },
        {
            path: 'DonationType/nuevo',
            component: CreaeditadonationtypeComponent,
            canActivate: [seguridadGuard],
        },
        {
            path: 'DonationType/editar/:id',
            component: CreaeditadonationtypeComponent,
            canActivate: [seguridadGuard],
        },

        {
            path: 'Donations',
            component: DonationComponent,
            children: [
                {
                    path: 'nuevo', component: CreaeditadonationComponent
                },
                {
                    path: 'Edit/:id', component: CreaeditadonationComponent
                }
            ],
            canActivate: [seguridadGuard],
        },
        {
            path: 'Roles',
            component: RoleComponent,
            children: [
                {
                    path: 'nuevo', component: CreaeditaroleComponent
                },
                {
                    path:'Edit/:id', component:CreaeditaroleComponent
                }
            ],
            canActivate: [seguridadGuard],
        },
        {
            path: 'pago',
            component: FormulariopagoComponent,
            canActivate: [seguridadGuard],
        },
        {
            path: 'Notifications',
            component: NotificationComponent,
            children: [
                {
                    path: 'Agregar',
                    component: CreaeditanotificationComponent
                },
                {
                    path: 'Modificar/:id',
                    component: CreaeditanotificationComponent
                }
            ],
            canActivate: [seguridadGuard],
        },
        {
            path: 'reportes',
            component: ReportesComponent,
            children: [
                {
                    path: 'donanteXfecha',
                    component: DonantexfechaComponent
                },
                {
                    path:'MontoAnualOng',
                    component:MontoAnualOngComponent
                },
                {
                    path:'DonationEstadisticas',
                    component:DonationstadisticsComponent
                },
                {
                    path: 'monetarioanualpordonante',
                    component:MonetarybydonadoranualComponent
                },
                {
                    path: 'donationstypeformnth',
                    component:DonationstypemonthComponent
                }
            ],
            canActivate: [seguridadGuard],
        },
        {
            path:'ong',
            component:ONGsComponent,
            canActivate: [seguridadGuard]
        }

    ];
