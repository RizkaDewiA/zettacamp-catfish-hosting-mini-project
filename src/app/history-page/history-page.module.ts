import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryPageComponent } from './history-page.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { DetailHistoryComponent } from './detail-history/detail-history.component';
import { UserHistoryComponent } from './user-history/user-history.component';
import { AdminHistoryComponent } from './admin-history/admin-history.component';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';

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
    MaterialModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'en',
    }),
  ],
  exports: [
    HistoryPageComponent,
    UserHistoryComponent,
    AdminHistoryComponent,
    DetailHistoryComponent
  ]
})
export class HistoryPageModule { }
