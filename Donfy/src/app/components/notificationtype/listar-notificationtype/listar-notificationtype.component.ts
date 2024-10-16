import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { NotificationType } from '../../../models/NotificationType';
import { NotificationTypeService } from '../../../services/notificationtype.service';

@Component({
  selector: 'app-listar-notificationtype',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './listar-notificationtype.component.html',
  styleUrl: './listar-notificationtype.component.css'
})
export class ListarNotificationtypeComponent implements OnInit{
  dataSource:MatTableDataSource<NotificationType>=new MatTableDataSource();
  
  displayedColumns: string[] = ['c1', 'c2'];

  constructor(private ntS: NotificationTypeService) {}

  ngOnInit(): void{
    this.ntS.list().subscribe((data) => {
      this.dataSource=new MatTableDataSource(data)
    }
    )
  }
}
