import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogDetailMenuComponent } from 'src/app/menu-page/dialog-detail-menu/dialog-detail-menu.component';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu-higlight',
  templateUrl: './menu-higlight.component.html',
  styleUrls: ['./menu-higlight.component.css']
})
export class MenuHiglightComponent implements OnInit {
  @Input() itemMenu:any;
  constructor(private routes:Router, private dialog:MatDialog) { }

  ngOnInit(): void {
  }

  addToCart(id:string){
    const token = localStorage.getItem(environment.tokenKey);
    if (token == null) {
      Swal.fire({
        title: 'Login First',
        text: "You dont have permission, please login first",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Login'
      }).then((result) => {
        if (result.isConfirmed) {
          this.routes.navigate(['login-page']);
        }
      });
    } else if (token !== null) {
        const dialogRef = this.dialog.open(DialogDetailMenuComponent, {data:id});
    }
  }
}
