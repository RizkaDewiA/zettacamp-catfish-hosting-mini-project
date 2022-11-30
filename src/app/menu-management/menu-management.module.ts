import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuManagementComponent } from './menu-management.component';
import { RouterModule, Routes } from '@angular/router';
import { TableMenuComponent } from './table-menu/table-menu.component';
import { DialogMenuComponent } from './dialog-menu/dialog-menu.component';
import { MaterialModule } from '../material/material.module';
import { DetailMenuComponent } from './detail-menu/detail-menu.component';
import { DialogDiscountComponent } from './dialog-discount/dialog-discount.component';

const routes : Routes = [
  {path:"", component:MenuManagementComponent}
]

@NgModule({
  declarations: [
    MenuManagementComponent,
    TableMenuComponent,
    DialogMenuComponent,
    DetailMenuComponent,
    DialogDiscountComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    MenuManagementComponent,
    TableMenuComponent,
    DialogMenuComponent,
    DialogDiscountComponent
  ]
})
export class MenuManagementModule { }
