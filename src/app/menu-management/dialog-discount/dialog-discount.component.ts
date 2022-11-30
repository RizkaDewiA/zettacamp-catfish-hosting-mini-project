import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { MenuManagementService } from '../menu-management.service';

@Component({
  selector: 'app-dialog-discount',
  templateUrl: './dialog-discount.component.html',
  styleUrls: ['./dialog-discount.component.css']
})
export class DialogDiscountComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  foodData:any;
  formDiscount: FormControl;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private dialogRef: MatDialogRef<DialogDiscountComponent>, private serviceOffer:MenuManagementService) { }

  ngOnInit(): void {
    this.foodData = this.data;
    this.initForm();
    console.log(this.foodData.status)
  }

  initForm(){
    this.formDiscount = new FormControl('', [Validators.min(1), Validators.required]);
    if(this.foodData.id_food){
      this.formDiscount.patchValue(this.foodData.defaultAmount);
    }
  }

  onSubmit(){
    if(this.formDiscount.valid){
      this.subs.sink = this.serviceOffer.updateSpecialOffer(this.foodData.id_food, this.foodData.status, this.formDiscount.value).subscribe({
        next: ()=>{
          Swal.fire(
          'Success!',
          'Your Special Offer is Activated!',
          'success'
          ).then(()=>{
            this.dialogRef.close();
          });
        },
        error: (error)=>{
          Swal.fire(
            'Error!',
            error.message,
            'error'
          )
        }
      });
    } else {
      Swal.fire(
        'Error!',
        'Discount Invalid!',
        'error'
      )
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
