import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { MenuPageService } from '../menu-page.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dialog-detail-menu',
  templateUrl: './dialog-detail-menu.component.html',
  styleUrls: ['./dialog-detail-menu.component.css'],
})
export class DialogDetailMenuComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  detailMenu: any;
  cartForm: FormGroup;

  constructor(
    private serviceMenu: MenuPageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef:MatDialogRef<DialogDetailMenuComponent>,
    private route:Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.serviceMenu
      .getOneMenu(this.data)
      .subscribe({
        next: (resp) => {
        this.detailMenu = resp.data.getOneRecipes;},
        error: (error)=>{
          if(error.message){
            Swal.fire({
              title: this.translate.instant('alert-login.title'),
              text: this.translate.instant('alert-login.text'),
              icon: 'warning',
              showCancelButton: true,
              cancelButtonText: this.translate.instant('alert-login.cancel-btn'),
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: this.translate.instant('alert-login.confrim-btn')
            }).then((result) => {
              if (result.isConfirmed) {
                this.route.navigate(['login-page']);
                this.dialogRef.close();
              }else{
                this.dialogRef.close();
              }
            })
          }
        }
      });
    this.getCounterQuan();
  }

  getCounterQuan() {
    this.cartForm = this.fb.group({
      quantity: [null, [Validators.min(1)]],
      message: [''],
    });
  }

  addToCart(id: string) {
    const quanValue = this.cartForm?.value;
    if (quanValue?.quantity != null && this.cartForm.valid) {
      Swal.fire({
        title: this.translate.instant('alert-menu.title'),
        text: this.translate.instant('alert-menu.text'),
        icon: 'success',
      }).then(()=>{
        const menuOrder = {
          recipe_id : id,
          amount: quanValue.quantity,
          note: quanValue.message
        }
        this.subs.sink = this.serviceMenu.addCart(menuOrder).subscribe();
        this.dialogRef.close({data:this.detailMenu});
      });
    } else {
      Swal.fire({
        title: this.translate.instant('alert-menu-fail.title'),
        text: this.translate.instant('alert-menu-fail.text'),
        icon: 'error',
      });
    }
  }

  cancelButton(){
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
