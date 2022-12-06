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

@Component({
  selector: 'app-list-menu',
  templateUrl: './list-menu.component.html',
  styleUrls: ['./list-menu.component.css'],
})
export class ListMenuComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  listMenu: any;
  menulist: boolean = true;
  pagination = {
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
          console.log(this.listMenu);
        },
        error: (error: any) => {
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

  searchMenu() {
    this.filterMenuByName.valueChanges.subscribe((result) => {
      console.log(result);
      this.resultMenuFilter = result.toLowerCase();
      this.getDataMenu();
    });
  }

  addToCart(id: string) {
    const dialogRef = this.dialog.open(DialogDetailMenuComponent, { data: id });
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
