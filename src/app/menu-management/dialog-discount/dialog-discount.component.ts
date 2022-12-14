import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { MenuManagementService } from '../menu-management.service';

@Component({
  selector: 'app-dialog-discount',
  templateUrl: './dialog-discount.component.html',
  styleUrls: ['./dialog-discount.component.css'],
})
export class DialogDiscountComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  foodData: any;
  formDiscount: FormControl;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogDiscountComponent>,
    private serviceOffer: MenuManagementService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.foodData = this.data;
    this.initForm();
    // console.log(this.foodData.status);
  }

  initForm() {
    this.formDiscount = new FormControl('', [
      Validators.min(1),
      Validators.max(100),
      Validators.required,
    ]);
    if (this.foodData.id_food) {
      this.formDiscount.patchValue(this.foodData.defaultAmount);
    }
  }

  onSubmit() {
    if (this.formDiscount.valid) {
      this.subs.sink = this.serviceOffer
        .updateSpecialOffer(
          this.foodData.id_food,
          this.foodData.status,
          this.formDiscount.value
        )
        .subscribe({
          next: () => {
            Swal.fire(
              this.translate.instant('update-offer.title'),
              this.translate.instant('update-offer.text-activated'),
              'success'
            ).then(() => {
              this.dialogRef.close();
            });
          },
          error: (error) => {
            Swal.fire(
              this.translate.instant('alert-error.title'),
              error.message,
              'error'
            );
          },
        });
    } else {
      Swal.fire(
        this.translate.instant('discount-invalid.title'),
        this.translate.instant('discount-invalid.text'),
        'error'
      );
    }
  }

  onCancel(){
    this.dialogRef.close({message: 'cancel'});
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
