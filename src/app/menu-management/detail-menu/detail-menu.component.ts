import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Menu } from 'src/app/model/menu.model';
import { SubSink } from 'subsink';
import { MenuManagementService } from '../menu-management.service';

@Component({
  selector: 'app-detail-menu',
  templateUrl: './detail-menu.component.html',
  styleUrls: ['./detail-menu.component.css']
})
export class DetailMenuComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  dataMenu:any;
  id:Menu;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private serviceMenu:MenuManagementService) { }

  ngOnInit(): void {
    this.id = this.data;
    this.subs.sink = this.serviceMenu.getOneMenu(this.id).subscribe((resp)=>{
      this.dataMenu = resp.data.getOneRecipes;
    })
  }

  onImageError(event){
    event.target.src = "https://images.unsplash.com/photo-1534939561126-855b8675edd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
