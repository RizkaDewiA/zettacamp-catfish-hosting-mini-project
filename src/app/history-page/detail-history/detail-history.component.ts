import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-history',
  templateUrl: './detail-history.component.html',
  styleUrls: ['./detail-history.component.css']
})
export class DetailHistoryComponent implements OnInit {
  detailsTrans: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.detailsTrans = this.data;
  }

  onImageError(event){
    event.target.src = "https://images.unsplash.com/photo-1534939561126-855b8675edd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
  }

}

