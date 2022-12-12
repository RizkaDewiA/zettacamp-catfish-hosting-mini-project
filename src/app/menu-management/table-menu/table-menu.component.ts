import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Menu } from 'src/app/model/menu.model';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { DetailMenuComponent } from '../detail-menu/detail-menu.component';
import { DialogDiscountComponent } from '../dialog-discount/dialog-discount.component';
import { DialogMenuComponent } from '../dialog-menu/dialog-menu.component';
import { MenuManagementService } from '../menu-management.service';

@Component({
  selector: 'app-table-menu',
  templateUrl: './table-menu.component.html',
  styleUrls: ['./table-menu.component.css']
})
export class TableMenuComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  dataMenu:any = [];
  displayedColumns: string[] = ['recipe_name', 'detail-menu','available', 'menu-highlight', 'price', 'discount', 'special-offer','status', 'actions'];
  dataSource =  new MatTableDataSource(this.dataMenu);
  pagination = {
    page: 1,
    limit: 10
  }
  totalSize = 0;

  //checked
  checked_highlight:boolean;
  checked_offer: boolean;

  //filter name
  filterMenuName: any = new FormControl('');
  menuNameFilter = '';
  resultMenuFilter:any;

  //filter status
  statusFilter:any = [
    {viewValue: "all", value: "none"},
    {viewValue: "publish", value:"publish"},
    {viewValue: "unpublish", value:"unpublish"}
  ]

  statusMenuFilter = new FormControl('');
  status:any;

  constructor(private serviceMenu:MenuManagementService, public dialog:MatDialog, private translate:TranslateService) { }

  ngOnInit(): void {
    this.getData();
    this.searchMenu();
    console.log(this.checked_highlight);
  }

  getData(){
    this.subs.sink = this.serviceMenu.getAllMenu(this.pagination, this.resultMenuFilter, this.status).valueChanges.subscribe((resp:any)=>{
      this.dataMenu = resp.data;
      this.dataMenu = this.dataMenu?.getAllRecipes?.data_recipes;
      this.dataSource = new MatTableDataSource(this.dataMenu);
      const publish = resp?.data?.getAllRecipes?.count_publish;
      const unpublish = resp?.data?.getAllRecipes?.count_unpublish;
      if(this.status == "publish"){
        this.totalSize = publish;
      }else if(this.status == "unpublish"){
        this.totalSize = unpublish;
      }else if( this.status == null){
        this.totalSize = publish + unpublish;
      }
      // console.log(this.totalSize);
    })
  }

  handlePage(page: PageEvent){
    this.pagination = {
      page: page.pageIndex + 1,
      limit: page.pageSize
    }
    this.getData();
  }

  searchMenu(){
    this.filterMenuName.valueChanges.subscribe((result)=>{
      this.resultMenuFilter = result.toLowerCase();
      this.getData();
    })

    this.statusMenuFilter.valueChanges.subscribe((result)=>{
      if(result == "none"){
        this.status = null;
        this.getData();
      }else{
        this.status = result;
        this.getData();
      } 
    });
  }

  openDetailDialog(id:string){
    // console.log(id);
    this.dialog.open(DetailMenuComponent, {data:id});
  }

  openDialogMenu(id:string){
    this.dialog.open(DialogMenuComponent, {data:id}).afterClosed().subscribe((result)=>{
      if(result){
        this.getData();
      }
    });
  }

  updateStatus(id:string, name:string, status:string){
    let tempStatus:any;
    if(status == "publish"){
      tempStatus = "unpublish"
    }else if(status == "unpublish"){
      tempStatus = "publish"
    }

    Swal.fire({
      title: this.translate.instant('update-status.title'),
      text: this.translate.instant('update-status.text') + ' ' + this.translate.instant('update-status.'+ tempStatus) + ' ?',
      icon: 'question',
      confirmButtonText: this.translate.instant('update-status.confrim-btn'),
      showCancelButton: true
    }).then((result)=>{
      if(result.isConfirmed){
          this.subs.sink = this.serviceMenu?.updateStatusMenu(id, tempStatus)?.subscribe(()=>{
            Swal.fire(
              this.translate.instant('update-status.change'),
              this.translate.instant('update-status.text-1') + ' ' + name + ' ' + this.translate.instant('update-status.text-2') + ' ' + this.translate.instant('menu-manage.'+ tempStatus),
              'success'
            )
            this.getData();
          });

      }
    })
  }

  onUpdateHighlight(id:string, status:any){
    this.subs.sink = this.serviceMenu.updateHighlight(id, status.checked).subscribe(()=>{
      if(status.checked == true){
        Swal.fire(
          this.translate.instant('update-highlight.title'),
          this.translate.instant('update-highlight.text-activated'),
          'success'
        );
      }else{
        Swal.fire(
          this.translate.instant('update-highlight.title'),
          this.translate.instant('update-highlight.text-noactivated'),
          'success'
        );
      }
    });
    
  }
  
  onUpdateOffer(id:string, status:any, amount: number, foodName:string){
    if(status.checked == true){
      const dialogRef = this.dialog.open(DialogDiscountComponent, {data:{id_food:id, status:status.checked, defaultAmount:amount, name:foodName}});
      dialogRef.afterClosed().subscribe((res:any)=>{
        if(res.message == 'cancel'){
          status.source.checked = !status.source.checked;
        }
      })
    }else if(status.checked == false){
      this.subs.sink = this.serviceMenu.updateSpecialOffer(id, status.checked, amount).subscribe(()=>{
          Swal.fire(
            this.translate.instant('update-offer.title'),
            this.translate.instant('update-offer.text-noactivated'),
            'success'
          );
      });
    }
  }


  deleteMenu(id:Menu, name:string){
    Swal.fire({
      title: this.translate.instant('delete-confrim-menu.title'),
      text: this.translate.instant('delete-confrim-menu.text'),
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: this.translate.instant('delete-confrim-menu.cancel-btn'),
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant('delete-confrim-menu.confrim-btn')
    }).then((result) => {
      if (result.isConfirmed) {
        this.subs.sink = this.serviceMenu.deleteMenu(id).subscribe({
          next: ()=>{
            Swal.fire(
              this.translate.instant('delete-success-menu.title'),
              this.translate.instant('delete-success-menu.text-1') + ' ' + name + ' ' + this.translate.instant('delete-success-menu.text-2'),
              'success'
            ),
            this.getData();
          },
          error: ()=>{
            Swal.fire(
              this.translate.instant('delete-fail-menu.title'),
              this.translate.instant('delete-fail-menu.text-1') + ' ' + name + ' ' + this.translate.instant('delete-fail-menu.text-2'),
              'error'
            )
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}