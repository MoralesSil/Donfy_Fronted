import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { Users } from '../../../models/Users';

@Component({
  selector: 'app-listar-user',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './listar-user.component.html',
  styleUrl: './listar-user.component.css'
})
export class ListarUserComponent implements OnInit{
  dataSource:MatTableDataSource<Users>=new MatTableDataSource();

  displayedColumns: string[] = ['c1', 'c2', 'c3','c4','c5','c6','c7','c8','c9','c10','c11','c12'];

  constructor(private uS: UsersService) {}

  ngOnInit(): void {
    this.uS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.uS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number): void {
    this.uS.delete(id).subscribe(() => {
      this.uS.list().subscribe((data) => {
        this.uS.setList(data);
      });
    });
  }
}
