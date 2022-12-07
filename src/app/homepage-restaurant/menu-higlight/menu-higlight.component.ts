import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogDetailMenuComponent } from 'src/app/menu-page/dialog-detail-menu/dialog-detail-menu.component';
import { AddedSnackBarComponent } from 'src/app/shared/added-snack-bar/added-snack-bar.component';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu-higlight',
  templateUrl: './menu-higlight.component.html',
  styleUrls: ['./menu-higlight.component.css']
})
export class MenuHiglightComponent implements OnInit {
  @Input() itemMenu:any;
  constructor(private routes:Router, private dialog:MatDialog, private snack: MatSnackBar, private translate:TranslateService) { }
  durationInSeconds: number = 5;
  ngOnInit(): void {
  }

  addToCart(id:string){
    const token = localStorage.getItem(environment.tokenKey);
    if (token == null) {
      Swal.fire({
        title: this.translate.instant("login-first.title"),
        text: this.translate.instant("login-first.text"),
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: this.translate.instant("login-first.cancel-btn"),
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.translate.instant("login-first.confirm-btn")
      }).then((result) => {
        if (result.isConfirmed) {
          this.routes.navigate(['login-page']);
        }
      });
    } else if (token !== null) {
        const dialogRef = this.dialog.open(DialogDetailMenuComponent, {data:id});
        dialogRef.afterClosed().subscribe((resp) => {
          if(resp != null){
            this.snack.openFromComponent(AddedSnackBarComponent, {
              data:resp,
              panelClass: 'my-custom-container-class',
              duration: this.durationInSeconds * 1000
            })
          }
        });
    }
  }
}
