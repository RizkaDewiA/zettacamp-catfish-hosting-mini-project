import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css','../homepage-restaurant.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  menuPage(){
    this.router.navigate(['/menu-page']);
  }

  loginPage(){
    this.router.navigate(['/login-page']);
  }

}
