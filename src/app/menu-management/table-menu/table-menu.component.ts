import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { DetailMenuComponent } from '../detail-menu/detail-menu.component';
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
  displayedColumns: string[] = ['recipe_name', 'detail-menu','available', 'menu-highlight', 'price', 'special-offer','status', 'actions'];
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
    {viewValue: "All", value: "none"},
    {viewValue: "Publish", value:"publish"},
    {viewValue: "Unpublish", value:"unpublish"}
  ]

  statusMenuFilter = new FormControl('');
  status:any;

  constructor(private serviceMenu:MenuManagementService, public dialog:MatDialog) { }

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
    let textStatus: any;
    if(status == 'publish'){
      textStatus = 'Unpublish'
    } else {
      textStatus = 'Publish'
    }
    Swal.fire({
      title: 'Change Status',
      text: 'Are You Sure Want To Change Status To ' + textStatus + ' ?',
      icon: 'question',
      confirmButtonText: 'Yes, Change Status',
      showCancelButton: true
    }).then((result)=>{
      if(result.isConfirmed){
        if(status=="publish"){
          const tempStatus = "unpublish";
          this.subs.sink = this.serviceMenu?.updateStatusMenu(id, tempStatus)?.subscribe(()=>{
            Swal.fire(
              'Change Success!',
              'Your Menu ' + name + ' Has Been ' + tempStatus,
              'success'
            )
            this.getData();
          });
        } else if(status=="unpublish"){
          const tempStatus = "publish";
          this.subs.sink = this.serviceMenu?.updateStatusMenu(id, tempStatus)?.subscribe(()=>{
            Swal.fire(
              'Change Success!',
              'Your Menu ' + name + ' Has Been ' + tempStatus,
              'success'
            )
            this.getData();
          });
        }
      }
    })
  }

  onUpdateHighlight(id:string, status:any){
    this.subs.sink = this.serviceMenu.updateHighlight(id, status.checked).subscribe(()=>{
      if(status.checked == true){
        Swal.fire(
          'Success!',
          'Your Menu Highlight is Activated!',
          'success'
        );
      }else{
        Swal.fire(
          'Success!',
          'Your Menu Highlight is Not Activated!',
          'success'
        );
      }
    });
    
  }
  
  onUpdateOffer(id:string, status:any){
    this.subs.sink = this.serviceMenu.updateSpecialOffer(id, status.checked).subscribe(()=>{
      if(status.checked == true){
        Swal.fire(
          'Success!',
          'Your Special Offer is Activated!',
          'success'
        );
      }else{
        Swal.fire(
          'Success!',
          'Your Special Offer is Not Activated!',
          'success'
        );
      }
    });
  }


  deleteMenu(id:string, name:string){
    Swal.fire({
      title: 'Are you sure want to delete this menu?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subs.sink = this.serviceMenu.deleteMenu(id).subscribe({
          next: ()=>{
            Swal.fire(
              'Deleted!',
              'Your stock '+ name +' has been deleted.',
              'success'
            ),
            this.getData();
          },
          error: ()=>{
            Swal.fire(
              'Error!',
              'Your stock '+ name +' cannot be deleted.',
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