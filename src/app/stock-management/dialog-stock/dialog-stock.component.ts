import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { StockManagementService } from '../stock-management.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-stock',
  templateUrl: './dialog-stock.component.html',
  styleUrls: ['./dialog-stock.component.css'],
})
export class DialogStockComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  private id: any;
  dataStock: any;
  addNewStock: boolean = true;
  formStock: FormGroup;
  addData: boolean = true;
  pagination: any = {
    page: 1,
    limit: 10,
    stock: 1,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceStock: StockManagementService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogStockComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formStock = this.fb.group({
      name: ['', [Validators.required]],
      stock: ['', [Validators.required, Validators.min(1)]],
    });

    if (this.data) {
      this.id = this.data;
      this.id = String(this.id);
      this.addData = false;
      this.subs.sink = this.serviceStock.getOneStock(this.id).subscribe((resp) => {
        this.dataStock = resp.data.getOneIngredients;
        this.formStock.patchValue(this.dataStock);
      });
    }
  }

  //kurang swal untuk error server and server
  onSubmit() {
    const updatedId = this.id;
    const updatedValue = this.formStock.value;
    if (this.id) {
      if (this.formStock.valid) {
        this.subs.sink = this.serviceStock
          .updateStock(updatedId, updatedValue.name, updatedValue.stock)
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
            error: (error) => {
              Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK',
              });
            },
          });
      } else if(updatedValue.stock < 1){
        Swal.fire({
          title: 'Error!',
          text: 'Stock Cannot Minus!',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Stock Invalid!',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } else {
      const stockData = this.formStock.value;
      if (this.formStock.valid) {
        this.subs.sink = this.serviceStock
          .createNewStock(stockData.name, stockData.stock)
          .subscribe({
            next: () => {
              Swal.fire({
                title: 'Success',
                text: 'Data Has Been Added',
                icon: 'success',
                confirmButtonText: 'Ok',
              }).then(() => {
                this.dialogRef.close();
              });
            },
            error: (error) => {
              Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK',
              });
            },
          });
      } else if(updatedValue.stock < 1){
        Swal.fire({
          title: 'Error!',
          text: 'Stock Cannot Minus!',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }else {
        Swal.fire({
          title: 'Error!',
          text: 'Stock Invalid!',
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
