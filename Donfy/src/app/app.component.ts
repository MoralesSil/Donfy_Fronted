import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationtypeComponent } from "./components/notificationtype/notificationtype.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationtypeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Donfy';
}
