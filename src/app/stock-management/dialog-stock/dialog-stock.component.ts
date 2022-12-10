import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { StockManagementService } from '../stock-management.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

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
    private dialogRef: MatDialogRef<DialogStockComponent>,
    private translate:TranslateService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formStock = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      stock: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
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

  onSubmit() {
    const updatedId = this.id;
    const updatedValue = this.formStock.value;
    if (this.id) {
      if (this.formStock.valid) {
        this.subs.sink = this.serviceStock
          .updateStock(updatedId, updatedValue)
          .subscribe({
            next: () => {
              Swal.fire({
                title: this.translate.instant('stock-update.title'),
                text: this.translate.instant('stock-update.text'),
                icon: 'success',
                confirmButtonText: this.translate.instant('stock-update.confrim-btn'),
              }).then(() => {
                this.dialogRef.close();
              });
            },
            error: (error) => {
              Swal.fire({
                title: this.translate.instant('alert-error.title'),
                text: error.message,
                icon: 'error',
                confirmButtonText: this.translate.instant('alert-error.confrim-btn'),
              });
            },
          });
      } else if(updatedValue.stock < 1){
        Swal.fire({
          title: this.translate.instant('stock-minus.title'),
          text: this.translate.instant('stock-minus.text'),
          icon: 'error',
          confirmButtonText: this.translate.instant('stock-minus.confrim-btn'),
        });
      } else {
        Swal.fire({
          title: this.translate.instant('stock-invalid.title'),
          text: this.translate.instant('stock-invalid.text'),
          icon: 'error',
          confirmButtonText: this.translate.instant('stock-invalid.confrim-btn'),
        });
      }
    } else {
      const stockData = this.formStock.value;
      if (this.formStock.valid) {
        this.subs.sink = this.serviceStock
          .createNewStock(stockData)
          .subscribe({
            next: () => {
              Swal.fire({
                title: this.translate.instant('stock-added.title'),
                text: this.translate.instant('stock-added.text'),
                icon: 'success',
                confirmButtonText: this.translate.instant('stock-added.confrim-btn'),
              }).then(() => {
                this.dialogRef.close();
              });
            },
            error: (error) => {
              Swal.fire({
                title: this.translate.instant('alert-error.title'),
                text: error.message,
                icon: 'error',
                confirmButtonText: this.translate.instant('alert-error.confrim-btn'),
              });
            },
          });
      } else if(updatedValue.stock < 0){
        Swal.fire({
          title: this.translate.instant('stock-minus.title'),
          text: this.translate.instant('stock-minus.text'),
          icon: 'error',
          confirmButtonText: this.translate.instant('stock-minus.confrim-btn'),
        });
      }else {
        Swal.fire({
          title: this.translate.instant('stock-invalid.title'),
          text: this.translate.instant('stock-invalid.text'),
          icon: 'error',
          confirmButtonText: this.translate.instant('stock-invalid.confrim-btn'),
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
