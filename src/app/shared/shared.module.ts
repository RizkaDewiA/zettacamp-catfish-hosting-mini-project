import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddedSnackBarComponent } from './added-snack-bar/added-snack-bar.component';
import { MaterialModule } from '../material/material.module';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';



@NgModule({
  declarations: [
    AddedSnackBarComponent
  ],
  imports: [
    CommonModule,
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
    AddedSnackBarComponent
  ]
})
export class SharedModule { }
