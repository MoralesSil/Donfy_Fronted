import { Routes } from '@angular/router';
import { NotificationtypeComponent } from './components/notificationtype/notificationtype.component';
import { DonationtypeComponent } from './components/donationtype/donationtype.component';

export const routes: Routes = 
[
    { 
        path: 'NotificationType',
        component: NotificationtypeComponent 
    },
    {
        path: 'DonationType',
        component: DonationtypeComponent
    }
];
