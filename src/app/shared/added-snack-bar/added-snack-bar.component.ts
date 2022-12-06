import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Router} from '@angular/router';

@Component({
  selector: 'app-added-snack-bar',
  templateUrl: './added-snack-bar.component.html',
  styleUrls: ['./added-snack-bar.component.css']
})
export class AddedSnackBarComponent implements OnInit {
  notif:any;
  constructor(public snackBarRef: MatSnackBarRef<AddedSnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any, private router:Router) { }

  ngOnInit(): void {
    this.notif = this.data.data.recipe_name;
    this.notif = this.notif.toUpperCase();
  }

  seeCart(){
    this.router.navigate(['main-page/cart-page']);
  }

}
