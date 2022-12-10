import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrReplacePipe } from './curr-replace.pipe';



@NgModule({
  declarations: [
    CurrReplacePipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    CurrReplacePipe
  ]
})
export class SharedPipeModule { }
