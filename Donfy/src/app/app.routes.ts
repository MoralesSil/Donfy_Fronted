import { Routes } from '@angular/router';
import { NotificationtypeComponent } from './components/notificationtype/notificationtype.component';
import { DonationtypeComponent } from './components/donationtype/donationtype.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CreaeditaNotificationtypeComponent } from './components/notificationtype/creaedita-notificationtype/creaedita-notificationtype.component';

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
        path: 'DonationType',
        component: DonationtypeComponent
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    }
];
