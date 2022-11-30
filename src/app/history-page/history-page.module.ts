import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryPageComponent } from './history-page.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { DetailHistoryComponent } from './detail-history/detail-history.component';
import { UserHistoryComponent } from './user-history/user-history.component';
import { AdminHistoryComponent } from './admin-history/admin-history.component';

const routes : Routes = [
  {path:"", component: HistoryPageComponent}
]

@NgModule({
  declarations: [
    HistoryPageComponent,
    DetailHistoryComponent,
    UserHistoryComponent,
    AdminHistoryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule
  ],
  exports: [
    HistoryPageComponent,
    UserHistoryComponent,
    AdminHistoryComponent,
    DetailHistoryComponent
  ]
})
export class HistoryPageModule { }
