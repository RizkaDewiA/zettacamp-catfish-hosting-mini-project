import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { DetailTransaction } from 'src/app/model/transaction.model';
import { SubSink } from 'subsink';
import { DetailHistoryComponent } from '../detail-history/detail-history.component';
import { HistoryPageService } from '../history-page.service';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.css']
})
export class UserHistoryComponent implements OnInit {
  private subs =  new SubSink();
  panelOpenState = false;
  statusFilter:any = [
    {viewValue: "all", value: "none"},
    {viewValue: "success", value:"success"},
    {viewValue: "failed", value:"failed"}
  ]

  statusTransFilter = new FormControl('');
  status:any;

  cartList:any;
  lengthCart: any;

  //Pagination
  pagination = {
    page: 1,
    limit: 10,
  }

  totalPrice:number = 0;

  indexToShow = [];

  constructor(private serviceHistory:HistoryPageService, private dialog:MatDialog) { }

  ngOnInit(): void {
    this.initCart();
    this.filteredStatus();
  }

  initCart(){
    const order_status = this.status;
    this.subs.sink = this.serviceHistory?.getAllCartStatus(this.pagination, order_status)?.valueChanges?.subscribe((resp:any)=>{
      this.cartList = resp?.data?.getAllTransaction?.data_transaction?.filter((stat)=>stat?.order_status == 'success' || stat?.order_status == 'failed');
      this.cartList.forEach((element)=>{
        console.log(element);
      })
      const failed = resp?.data?.getAllTransaction?.count_failed;
      const success = resp?.data?.getAllTransaction?.count_success;
      if(order_status == "success"){
        this.lengthCart = success;
      }else if(order_status == "failed"){
        this.lengthCart = failed;
      }else if(order_status == null){
        this.lengthCart = failed + success;
      }
      this.cartList.forEach(()=>{
        this.indexToShow.push(1);
      })

      console.log(resp);
    });
  }

  imageHasBeenLoaded(data){
    console.log(data);
  }

  filteredStatus(){
    this.statusTransFilter.valueChanges.subscribe((value)=>{
      if(value == "none"){
        this.status = null;
        this.initCart();
      }else{
        this.status = value;
        this.initCart();
      } 
    });
  }

  handlePageSuccess(page: PageEvent){
    this.pagination = {
      page: page.pageIndex + 1,
      limit: page.pageSize
    }
    this.initCart();
  }

  detailsTransaction(transaction:DetailTransaction){
    this.dialog.open(DetailHistoryComponent, {data:transaction});
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
