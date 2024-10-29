import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { NotificationType } from '../../../models/NotificationType';
import { NotificationTypeService } from '../../../services/notificationtype.service';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-listar-notificationtype',
  standalone: true,
  imports: [
    MatTableModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './listar-notificationtype.component.html',
  styleUrl: './listar-notificationtype.component.css'
})
export class ListarNotificationtypeComponent implements OnInit{
  dataSource:MatTableDataSource<NotificationType>=new MatTableDataSource();
  
  displayedColumns: string[] = ['c1','c2','c3','c4'];

  constructor(private ntS: NotificationTypeService) {}

  ngOnInit(): void{
    this.ntS.list().subscribe((data) => {
      this.dataSource=new MatTableDataSource(data)
    });

    this.ntS.getList().subscribe((data)=>{
      this.dataSource=new MatTableDataSource(data);
    })
  }

  eliminar(id:number){
    this.ntS.delete(id).subscribe(data=>{
      this.ntS.list().subscribe(data=>{
        this.ntS.setList(data);
      });
    });
  }
}
