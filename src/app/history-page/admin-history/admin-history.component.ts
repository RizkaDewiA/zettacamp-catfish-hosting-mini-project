import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DetailTransaction } from 'src/app/model/transaction.model';
import { SubSink } from 'subsink';
import { DetailHistoryComponent } from '../detail-history/detail-history.component';
import { HistoryPageService } from '../history-page.service';

@Component({
  selector: 'app-admin-history',
  templateUrl: './admin-history.component.html',
  styleUrls: ['./admin-history.component.css']
})
export class AdminHistoryComponent implements OnInit {
  private subs = new SubSink();
  dataHistoryAdmin:any = [];
  displayedColumns: string[] = ['last_name','order_date', 'order_total', 'total_price', 'status', 'details_order'];
  dataSource =  new MatTableDataSource(this.dataHistoryAdmin);
  pagination:any = {
    page: 1,
    limit: 10
  }
  totalSize = 0;

  statusTransFilter = new FormControl('');
  status:any;

  statusFilter:any = [
    {viewValue: "All", value: "none"},
    {viewValue: "Success", value:"success"},
    {viewValue: "Failed", value:"failed"}
  ]

  filterTransName: any = new FormControl('');
  transNameFilter = '';
  resultNameFilter:any;
  
  constructor(private serviceHistory:HistoryPageService, public dialog:MatDialog) { }

  ngOnInit(): void {
    this.getDataHistory();
    this.filteredStatusName();
  }

  getDataHistory(){
    const order_status = this.status;
    this.subs.sink = this.serviceHistory?.getAllHistoryAdmin(this.pagination, order_status, this.resultNameFilter)?.valueChanges?.subscribe((resp:any)=>{
      this.dataHistoryAdmin = resp?.data?.getHistory?.data_transaction;
      this.dataSource = new MatTableDataSource(this.dataHistoryAdmin);
      const failed = resp?.data?.getHistory?.count_failed;
      const success = resp?.data?.getHistory?.count_success;
      if(order_status == "success"){
        this.totalSize = success;
      }else if(order_status == "failed"){
        this.totalSize= failed;
      }else if(order_status == null){
        this.totalSize = failed + success;
      }
      console.log(order_status);
    });
  }

  handlePage(page: PageEvent){
    this.pagination = {
      page: page.pageIndex + 1,
      limit: page.pageSize,
    }
    this.getDataHistory();
  }

  filteredStatusName(){
    this.filterTransName.valueChanges.subscribe((result)=>{
      this.resultNameFilter = result.toLowerCase();
      this.getDataHistory();
    });

    this.statusTransFilter.valueChanges.subscribe((value)=>{
      if(value == "none"){
        this.status = null;
        this.getDataHistory();
      }else{
        this.status = value;
        this.getDataHistory();
      } 
    });
  }
  
  detailsTransaction(transaction:DetailTransaction){
    this.dialog.open(DetailHistoryComponent, {data:transaction});
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
