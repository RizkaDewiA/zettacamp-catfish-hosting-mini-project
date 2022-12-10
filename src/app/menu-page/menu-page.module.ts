import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuPageComponent } from './menu-page.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { ListMenuComponent } from './list-menu/list-menu.component';
import { DialogDetailMenuComponent } from './dialog-detail-menu/dialog-detail-menu.component';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { CurrReplacePipe } from '../pipe/curr-replace.pipe';
import { SharedPipeModule } from '../pipe/shared-pipe.module';

const routes : Routes = [
  {path:"", component: MenuPageComponent}
]

@NgModule({
  declarations: [
    MenuPageComponent,
    ListMenuComponent,
    DialogDetailMenuComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'en',
    }),
    SharedPipeModule
  ],
  exports: [
    MenuPageComponent,
    ListMenuComponent,
    DialogDetailMenuComponent
  ]
})
export class MenuPageModule { }
