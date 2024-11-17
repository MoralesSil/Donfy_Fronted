import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../../services/users.service';
import { Users } from '../../../models/Users';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listar-user',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatPaginatorModule
  ],
  templateUrl: './listar-user.component.html',
  styleUrl: './listar-user.component.css'
})
export class ListarUserComponent implements OnInit{
  dataSource:MatTableDataSource<Users>=new MatTableDataSource();

  @ViewChild(MatPaginator) msPaginator!: MatPaginator;

  displayedColumns: string[] = ['c1', 'c2', 'c3','c4','c5','c6','c7','c8','c9','c10','c11','c12'];

  constructor(private uS: UsersService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.uS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.msPaginator;

    });

    this.uS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number): void {
    this.uS.delete(id).subscribe(() => {
      this.snackBar.open('Se elimino con éxito', 'Cerrar', {
        duration: 3000,
      });
      this.uS.list().subscribe((data) => {
        this.uS.setList(data);
      });
    });
  }

  filtro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
