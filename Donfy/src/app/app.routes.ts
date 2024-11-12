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

<<<<<<< HEAD
export const routes: Routes = 
[
    {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'full',
    },
    {
        path:'landing',
        component: LandingComponent
    },
    { 
        path: 'NotificationType',
        component: NotificationtypeComponent,
        children:[
            {
                path:'New',
                component:CreaeditaNotificationtypeComponent
            },
            {
                path:'Ediciones/:id',
                component:CreaeditaNotificationtypeComponent
            }
        ],
        canActivate: [seguridadGuard],
    },
    { 
        path: 'Users',
        component: UserComponent,
        children:[
            {
                path:'New',
                component:CreaeditaUserComponent
            },
            {
                path:'Ediciones/:id',
                component:CreaeditaUserComponent
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
        path:'DonationType/editar/:id',
        component:CreaeditadonationtypeComponent,
        canActivate: [seguridadGuard],
      },
      
      {
        path: 'Donations',
        component:DonationComponent,
        children: [
            {
                path:'nuevo',component:CreaeditadonationComponent
            },
            {
                path:'Edit/id',component:CreaeditadonationComponent
            }
        ],
        canActivate: [seguridadGuard],
      },
      {
        path:'Roles',
        component:RoleComponent,
        children:[
            {
                path:'nuevo',component:CreaeditaroleComponent
            }
        ],
        canActivate: [seguridadGuard],
      },
      {
        path: 'pago',
        component: FormulariopagoComponent,
        canActivate: [seguridadGuard],
    },
];
=======
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
                    path: 'Ediciones/:id',
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
>>>>>>> d51611bc9dbc44080cd0bfe65f1671832ef1727f

        {
            path: 'Donations',
            component: DonationComponent,
            children: [
                {
                    path: 'nuevo', component: CreaeditadonationComponent
                },
                {
                    path: 'Edit/id', component: CreaeditadonationComponent
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
                }
            ],
            canActivate: [seguridadGuard],
        },
        {
            path: 'Donations',
            component: DonationComponent,
            children: [
                {
                    path: 'nuevo',
                    component: CreaeditadonationComponent
                },
                {
                    path: 'Edit/:id',
                    component: CreaeditadonationComponent
                }
            ]
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
            ]
        },
    ];
