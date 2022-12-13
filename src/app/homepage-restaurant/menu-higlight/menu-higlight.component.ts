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
  styleUrls: ['./menu-higlight.component.css'],
})
export class MenuHiglightComponent implements OnInit {
  @Input() itemMenu: any;
  role: string;
  tempId: string;
  durationInSeconds: number = 5;
  category:any;

  constructor(
    private routes: Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.role = JSON.parse(localStorage?.getItem(environment.role));
    this.tempId = JSON.parse(localStorage.getItem('tempIdFood'));
    this.category = JSON.parse(localStorage.getItem('category'));
    if(this.role == 'user' && this.category == 'highlight'){
      this.scroll(this.tempId);
    }
  }

  onImageError(event){
    event.target.src = "https://images.unsplash.com/photo-1534939561126-855b8675edd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
  }

  scroll(id){
    let el = document?.getElementById(id);
    el?.scrollIntoView();
    el?.classList.add('glow');
    setTimeout(()=>{
      el?.classList?.remove('glow');
      localStorage.removeItem('tempIdFood');
      localStorage.removeItem('category');
    }, 5000);
  }

  addToCart(id: string) {
    const token = localStorage.getItem(environment.tokenKey);
    if (token == null) {
      localStorage.setItem('tempIdFood', JSON.stringify(id));
      localStorage.setItem('category', JSON.stringify('highlight'));
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
        } else {
          localStorage.removeItem('tempIdFood');
          localStorage.removeItem('category');
        }
      });
    } else if (token !== null) {
      const dialogRef = this.dialog.open(DialogDetailMenuComponent, {
        data: id,
        autoFocus: true
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
