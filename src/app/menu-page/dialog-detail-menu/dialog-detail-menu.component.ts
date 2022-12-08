import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { MenuPageService } from '../menu-page.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dialog-detail-menu',
  templateUrl: './dialog-detail-menu.component.html',
  styleUrls: ['./dialog-detail-menu.component.css'],
})
export class DialogDetailMenuComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  detailMenu: any;
  cartForm: FormGroup;
  role:any;

  constructor(
    private serviceMenu: MenuPageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef:MatDialogRef<DialogDetailMenuComponent>,
    private route:Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.role = JSON.parse(localStorage?.getItem(environment.role));
    this.subs.sink = this.serviceMenu?.getOneMenu(this.data)?.subscribe({
        next: (resp) => {
        this.detailMenu = resp?.data?.getOneRecipes;
        if(this.detailMenu?.available){
          this.cartForm.get('quantity').addValidators(Validators.max(this.detailMenu?.available));
        }
      },
        error: (error)=>{
          if(error?.message){
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
    this.cartForm = this.fb?.group({
      quantity: ['', [Validators.required, Validators.min(1)]],
      message: ['', [Validators.maxLength(100)]],
    });
  }

  addToCart(id: string) {
    const quanValue = this.cartForm?.value;
    if (this.cartForm?.valid) {
      const menuOrder = {
        recipe_id : id,
        amount: quanValue?.quantity,
        note: quanValue?.message
      }
      this.subs.sink = this.serviceMenu?.addCart(menuOrder)?.subscribe({
        next: ()=>{
          Swal.fire(
            this.translate?.instant('alert-menu.title'),
            this.translate?.instant('alert-menu.text'),
            'success',
          ).then(()=>{
            this.dialogRef?.close({data:this.detailMenu});
          });
        },
        error: (error)=>{
          Swal.fire(
            this.translate?.instant('alert-menu-fail.title'),
            error?.message ,
            'error',
          );
        }
      });  
    } else {
      Swal.fire(
        this.translate?.instant('alert-menu-fail.title'),
        this.translate?.instant('alert-menu-fail.text'),
        'error',
      );
    }
  }

  cancelButton(){
    this.dialogRef?.close();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }
}
