import { Routes } from '@angular/router';
import { NotificationtypeComponent } from './components/notificationtype/notificationtype.component';
import { DonationtypeComponent } from './components/donationtype/donationtype.component';
import { CreaeditadonationtypeComponent } from './components/donationtype/creaeditadonationtype/creaeditadonationtype.component';

export const routes: Routes = 
[
    { 
        path: 'NotificationType',
        component: NotificationtypeComponent 
    },
    {
        path: 'DonationType',component: DonationtypeComponent,
        children:[
            {
                path:'nuevo',component:CreaeditadonationtypeComponent
            }
        ]
    }
];
