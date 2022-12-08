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
  selector: 'app-special-offer',
  templateUrl: './special-offer.component.html',
  styleUrls: ['./special-offer.component.css'],
})
export class SpecialOfferComponent implements OnInit {
  @Input() itemMenu: any;
  constructor(
    private routes: Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private translate: TranslateService
  ) {}
  durationInSeconds: number = 5;
  role: any;

  ngOnInit(): void {
    this.role = JSON.parse(localStorage?.getItem(environment.role));
  }

  onImageError(event){
    event.target.src = "https://images.unsplash.com/photo-1534939561126-855b8675edd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
  }

  addToCart(id: string) {
    const token = localStorage.getItem(environment.tokenKey);
    if (token == null) {
      Swal.fire({
        title: this.translate.instant('login-first.title'),
        text: this.translate.instant('login-first.text'),
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: this.translate.instant('login-first.cancel-btn'),
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.translate.instant('login-first.confirm-btn'),
      }).then((result) => {
        if (result.isConfirmed) {
          this.routes.navigate(['login-page']);
        }
      });
    } else if (token !== null) {
      let state: boolean;
      if (this.role == 'admin') {
        state = false;
      } else {
        state = true;
      }
      const dialogRef = this.dialog.open(DialogDetailMenuComponent, {
        data: id,
        autoFocus: state
      });
      dialogRef.afterClosed().subscribe((resp) => {
        if (resp != null) {
          this.snack.openFromComponent(AddedSnackBarComponent, {
            data: resp,
            panelClass: 'my-custom-container-class',
            duration: this.durationInSeconds * 1000,
          });
        }
      });
    }
  }
}
