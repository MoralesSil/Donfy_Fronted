import {  NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
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
        ]
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'DonationType',
        component: DonationtypeComponent,
    },
    {
        path: 'DonationType/listar',
        component: ListardonationtypeComponent
      },
      {
        path: 'DonationType/nuevo',
        component: CreaeditadonationtypeComponent
      },
      {
        path:'DonationType/editar/:id',
        component:CreaeditadonationtypeComponent
      },
      { path: '', redirectTo: '/DonationType', pathMatch: 'full' },
      { path: '**', redirectTo: '/DonationType' },
      {
        path: 'Donation',
        component:DonationComponent,
        children: [
            {
                path:'nuevo',component:CreaeditadonationComponent
            }
        ]
      }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}
