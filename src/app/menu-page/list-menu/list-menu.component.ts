import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { DialogDetailMenuComponent } from '../dialog-detail-menu/dialog-detail-menu.component';
import { MenuPageService } from '../menu-page.service';
import { PageEvent } from '@angular/material/paginator';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddedSnackBarComponent } from 'src/app/shared/added-snack-bar/added-snack-bar.component';
import { Pagination } from 'src/app/model/pagination.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-menu',
  templateUrl: './list-menu.component.html',
  styleUrls: ['./list-menu.component.css'],
})
export class ListMenuComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  listMenu: any;
  menulist: boolean = true;
  pagination: Pagination = {
    page: 1,
    limit: 10,
  };
  totalSize = 0;
  cartForm: FormGroup;

  //filter name
  filterMenuByName: any = new FormControl('');
  menuByNameFilter = '';
  resultMenuFilter: any;
  durationInSeconds: number = 5;
  role: any;

  constructor(
    private serviceMenu: MenuPageService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getDataMenu();
    this.getCounterQuan();
    this.searchMenu();
    this.role = JSON.parse(localStorage?.getItem(environment.role));
  }

  getCounterQuan() {
    this.cartForm = this.fb.group({
      quantity: [null],
    });
  }

  get cartFormControl() {
    return this.cartForm.controls;
  }

  getDataMenu() {
    this.subs.sink = this.serviceMenu
      .getAllMenuNow(this.pagination, this.resultMenuFilter)
      .valueChanges.subscribe({
        next: (resp: any) => {
          const menu = resp?.data;
          this.listMenu = menu?.getAllRecipesNoToken?.data_recipes;
          this.totalSize = menu?.getAllRecipesNoToken?.count_publish;
          this.initStatusListMenu();
          // console.log(this.listMenu);
        },
        error: () => {
          this.menulist = false;
        },
      });
  }

  handlePage(page: PageEvent) {
    this.pagination = {
      page: page.pageIndex + 1,
      limit: page.pageSize,
    };
    this.getDataMenu();
  }

  initStatusListMenu() {
    if (this.listMenu != 0) {
      this.menulist = true;
    } else {
      this.menulist = false;
    }
  }

  onImageError(event){
    event.target.src = "https://images.unsplash.com/photo-1534939561126-855b8675edd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80";
  }

  searchMenu() {
    this.filterMenuByName.valueChanges.subscribe((result) => {
      // console.log(result);
      this.resultMenuFilter = result;
      this.getDataMenu();
    });
  }

  addToCart(id: string) {
    let state:boolean;
    if(this.role == "admin"){
      state = false;
    }else{
      state = true;
    }
    const dialogRef = this.dialog.open(DialogDetailMenuComponent, { 
      data: id,
      autoFocus: state
    });
    dialogRef.afterClosed().subscribe((resp) => {
      if(resp != null){
        this.snack.openFromComponent(AddedSnackBarComponent, {
          data:resp,
          panelClass: 'my-custom-container-class',
          duration: this.durationInSeconds * 1000
        })
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
