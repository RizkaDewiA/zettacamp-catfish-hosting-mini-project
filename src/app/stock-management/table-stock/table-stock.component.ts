import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { SubSink } from 'subsink';
import { StockManagementService } from '../stock-management.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogStockComponent } from '../dialog-stock/dialog-stock.component';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Ingredients } from 'src/app/model/ingredients.model';
import { PaginStock } from 'src/app/model/pagination.model';

@Component({
  selector: 'app-table-stock',
  templateUrl: './table-stock.component.html',
  styleUrls: ['./table-stock.component.css']
})
export class TableStockComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  dataStock:any = [];
  displayedColumns: string[] = ['name','stock', 'status','actions'];
  dataSource =  new MatTableDataSource(this.dataStock);
  pagination:PaginStock = {
    page: 1,
    limit: 10,
    stock: 1
  }
  totalSize = 0;

  //filter name
  filterStockName: any = new FormControl('');
  stockNameFilter = '';
  resultFilter:any;
  
  constructor(private serviceStock:StockManagementService, public dialog:MatDialog, private translate:TranslateService) { }

  ngOnInit(): void {
    this.getData();
    this.searchNameStockFilter();
  }

  getData(){
    this.subs.sink = this.serviceStock.getAllStock(this.pagination, this.resultFilter).valueChanges.subscribe((resp:any)=>{
      this.dataStock = resp?.data;
      this.dataStock = this.dataStock?.getAllIngredients.data;
      this.dataSource = new MatTableDataSource(this.dataStock);
      this.totalSize = resp?.data?.getAllIngredients?.count_active;
    });
  }

  handlePage(page: PageEvent){
    this.pagination = {
      page: page.pageIndex + 1,
      limit: page.pageSize,
      stock: 1
    }

    this.getData();
  }

  searchNameStockFilter(){
    this.filterStockName.valueChanges.subscribe((name)=>{
      this.resultFilter = name.toLowerCase();
      this.getData();
    })
  }
  
  openDialog(id:Ingredients){
    const dialogRef = this.dialog.open(DialogStockComponent, {data:id});
    dialogRef.afterClosed().subscribe((hasResult)=>{
      if(hasResult){
        this.getData();
      }
    });
  }

  deleteStock(id:Ingredients, name:string){
    Swal.fire({
      title: this.translate.instant('delete-confrim.title'),
      text: this.translate.instant('delete-confrim.text'),
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: this.translate.instant('delete-confrim.cancel-btn'),
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant('delete-confrim.confrim-btn')
    }).then((result) => {
      if (result.isConfirmed) {
        this.subs.sink = this.serviceStock.deleteStock(id).subscribe({
          next: ()=>{
            Swal.fire(
              this.translate.instant('delete-success.title'),
              this.translate.instant('delete-success.text-1') +' '+ name +' '+ this.translate.instant('delete-success.text-2'),
              'success'
            ),
            this.getData();
          },
          error: ()=>{
            Swal.fire(
              this.translate.instant('delete-fail.title'),
              this.translate.instant('delete-fail.text-1') +' '+ name +' '+ this.translate.instant('delete-fail.text-2'),
              'error'
            )
          }
        });
      };
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
