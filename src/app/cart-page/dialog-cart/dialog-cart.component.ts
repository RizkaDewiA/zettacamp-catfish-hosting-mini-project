import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { CartPageService } from '../cart-page.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-cart',
  templateUrl: './dialog-cart.component.html',
  styleUrls: ['./dialog-cart.component.css']
})
export class DialogCartComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  dataCart:any;
  formCart:FormGroup;
  pagination:any = {
    page: 1,
    limit: 10,
    stock: 1
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceCart: CartPageService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogCartComponent>
    ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formCart = this.fb.group({
      note: ['', [Validators.maxLength(100)]]
    });

    if (this.data.id_recipe) {
      this.subs.sink = this.serviceCart.getOneCart().subscribe((resp) => {
        this.dataCart = resp?.data?.getOneTransaction;
        let tempNoteArray:any = [];
        this.dataCart.menu.forEach(menu => {
          tempNoteArray.push({
            id : menu._id,
            note : menu.note
          });
        });
        let tempNote = tempNoteArray.filter((res_id)=> res_id.id == this.data.id_recipe);
        let note = {
          note: tempNote[0].note
        }
        this.formCart.patchValue(note);
      });
    }
  }

  onSubmit() {
    const updatedId = this.data.id_recipe;
    const updatedValue = this.formCart.value;
    if (updatedId) {
      if (this.formCart.valid) {
        this.subs.sink = this.serviceCart
          .updateCart(updatedId, updatedValue.note)
          .subscribe({
            next: () => {
              Swal.fire({
                title: 'Updated',
                text: 'Data Has Been Updated',
                icon: 'success',
                confirmButtonText: 'Ok',
              }).then(() => {
                this.dialogRef.close();
              });
            },
            error: () => {
              Swal.fire({
                title: 'Error!',
                text: 'Something Happend!',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            },
          });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Data Invalid!',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } 
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
