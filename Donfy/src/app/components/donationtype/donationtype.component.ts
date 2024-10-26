import { Component, OnInit } from '@angular/core';
import { ListardonationtypeComponent } from './listardonationtype/listardonationtype.component';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-donationtype',
  standalone: true,
  imports: [
    ListardonationtypeComponent,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    MatCardModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './donationtype.component.html',
  styleUrls: ['./donationtype.component.css']
})
export class DonationtypeComponent implements OnInit {
  constructor(public route:ActivatedRoute){}
  ngOnInit(): void {}
}
