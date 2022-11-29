import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { DialogDetailMenuComponent } from '../dialog-detail-menu/dialog-detail-menu.component';
import { MenuPageService } from '../menu-page.service';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-menu',
  templateUrl: './list-menu.component.html',
  styleUrls: ['./list-menu.component.css']
})
export class ListMenuComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  listMenu:any;
  menulist:boolean = true;
  pagination = {
    page: 1,
    limit: 10
  }
  totalSize = 0;
  cartForm: FormGroup;

  constructor(private serviceMenu:MenuPageService, private dialog:MatDialog, private fb:FormBuilder) { }

  ngOnInit(): void {
    this.getDataMenu();
    this.getCounterQuan();
  }

  getCounterQuan(){
    this.cartForm = this.fb.group({
      quantity: [null]
    })
  }

  get cartFormControl(){
    return this.cartForm.controls;
  }

  getDataMenu(){
    this.subs.sink = this.serviceMenu.getAllMenuNow(this.pagination).valueChanges.subscribe((resp:any)=>{
      const menu = resp?.data;
      this.listMenu = menu?.getAllRecipesNoToken?.data_recipes;
      this.totalSize = menu?.getAllRecipesNoToken?.count_publish;
      this.initStatusListMenu();  
    })
  }

  handlePage(page: PageEvent){
    this.pagination = {
      page: page.pageIndex + 1,
      limit: page.pageSize
    }
    this.getDataMenu();
  }

  initStatusListMenu(){
    if(this.listMenu != 0){
      this.menulist = true;
    }else{
      this.menulist = false;
    }
  }

  imageHasBeenLoaded(data){
    console.log(data);
  }

  addToCart(id:string){
    const dialogRef = this.dialog.open(DialogDetailMenuComponent, {data:id});
    dialogRef.afterClosed().subscribe(()=>{
      this.getDataMenu();
    })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
