import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { CartPageService } from '../cart-page.service';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogCartComponent } from '../dialog-cart/dialog-cart.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-cart',
  templateUrl: './list-cart.component.html',
  styleUrls: ['./list-cart.component.css']
})

export class ListCartComponent implements OnInit, OnDestroy {
  private subs =  new SubSink();
  panelOpenState = false;

  //Pending State
  cartListPending:any;
  pendingCart: any;
  tempCondition:any;

  //Pagination
  pagination = {
    page: 1,
    limit: 10,
  }

  totalPrice:number = 0;
  addSuccess:boolean = true;

  indexToShowSuccess = [];
  indexToShowFailed = [];

  constructor(private serviceCart:CartPageService, private dialog:MatDialog) { }

  ngOnInit(): void {
    this.initCartPending();
  }

  initCartPending(){
    const order_status = "pending";
    const role_in = JSON.parse(localStorage.getItem(environment.role));
    this.subs.sink = this.serviceCart?.getAllCartStatus(this.pagination, order_status)?.valueChanges?.subscribe((resp:any)=>{
        this.cartListPending = resp?.data?.getAllTransaction?.data_transaction?.filter((stat)=>stat?.status == "active");
        this.cartListPending.forEach(element => {
          if(element.user_id.role == role_in){
            this.cartListPending = element;
            this.tempCondition = element.menu.length;
          }
        });
        this.pendingCart = resp?.data?.getAllTransaction?.count_pending;
    });
  }


  handlePagePending(page: PageEvent){
    this.pagination = {
      page: page.pageIndex + 1,
      limit: page.pageSize
    }
    this.initCartPending();
  }

  addAmount(id:string){
    this.subs.sink = this.serviceCart.updateAmountPlus(id).subscribe();
    this.initCartPending();
  }

  minAmount(id:string){
    this.subs.sink = this.serviceCart.updateAmountMinus(id).subscribe();
    this.initCartPending();
  }

  orderNow(){
      Swal.fire({
        title: 'Are you sure want to order this cart?',
        text: "You won't be able to revert this!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, i order it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.subs.sink = this.serviceCart.orderCart().subscribe({
            next: ()=>{
              Swal.fire(
                'Success!',
                'Your cart has been order it.',
                'success'
              ),
              this.initCartPending();
            },
            error: ()=>{
              Swal.fire(
                'Error!',
                'Your cart cannot be order it.',
                'error'
              )
              this.initCartPending();
            }
          });
        }
      })
  }

  editCartDialog(idRecipe:any){
    const dialogRef = this.dialog.open(DialogCartComponent, {data: {id_recipe:idRecipe}});
    dialogRef.afterClosed().subscribe(()=>{
      this.initCartPending();
    })
    // console.log(idRecipe);
  }

  deleteCart(id:string, name:string){
    Swal.fire({
      title: 'Are you sure want to delete this cart?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subs.sink = this.serviceCart.deleteCart(id).subscribe({
          next: ()=>{
            Swal.fire(
              'Deleted!',
              'Your cart '+ name +' has been deleted.',
              'success'
            ),
            this.initCartPending();
          },
          error: ()=>{
            Swal.fire(
              'Error!',
              'Your cart '+ name +' cannot be deleted.',
              'error'
            )
            this.initCartPending();
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
