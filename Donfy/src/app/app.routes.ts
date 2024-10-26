import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { NotificationtypeComponent } from './components/notificationtype/notificationtype.component';
import { DonationtypeComponent } from './components/donationtype/donationtype.component';
import { CreaeditadonationtypeComponent } from './components/donationtype/creaeditadonationtype/creaeditadonationtype.component';
import { ListardonationtypeComponent } from './components/donationtype/listardonationtype/listardonationtype.component';

export const routes: Routes = [
    { 
        path: 'NotificationType', 
        component: NotificationtypeComponent 
    },
    {
        path: 'DonationType',
        component: DonationtypeComponent, // Este solo muestra los botones
      },
      {
        path: 'DonationType/listar',
        component: ListardonationtypeComponent // Este muestra el listado
      },
      {
        path: 'DonationType/nuevo',
        component: CreaeditadonationtypeComponent // Este muestra el registro
      },
      { path: '', redirectTo: '/DonationType', pathMatch: 'full' },
      { path: '**', redirectTo: '/DonationType' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}
