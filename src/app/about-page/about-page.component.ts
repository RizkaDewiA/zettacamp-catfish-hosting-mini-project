import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})
export class AboutPageComponent implements OnInit {
  role:any = null;
  constructor() { }

  ngOnInit(): void {
    this.role = JSON.parse(localStorage.getItem(environment.role));
  }

}
