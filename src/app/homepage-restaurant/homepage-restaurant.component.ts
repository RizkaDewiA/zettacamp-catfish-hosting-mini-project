import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { UserType } from '../model/user-type.model';
import { HomepageRestaurantService } from './homepage-restaurant.service';

@Component({
  selector: 'app-homepage-restaurant',
  templateUrl: './homepage-restaurant.component.html',
  styleUrls: ['./homepage-restaurant.component.css'],
})
export class HomepageRestaurantComponent implements OnInit {
  opened: boolean = false;
  landingPage: boolean = false;
  menuAllow: UserType;
  currentLanguage = 'en';
  srcImages: string = 'https://cdn-icons-png.flaticon.com/512/323/323329.png';

  constructor(private router: Router, private translate: TranslateService, private serviceHomepage: HomepageRestaurantService) {
    translate.addLangs(['en', 'id']);
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    const token = localStorage.getItem(environment.tokenKey);
    const usertype = JSON.parse(localStorage.getItem(environment.usertype));
    if (token == null) {
      this.landingPage = true;
    } else if (token !== null) {
      this.landingPage = false;
      this.menuAllow = usertype.filter((resp) => resp.view === true);
      this.router.navigate(['main-page']);
    }
  }

  changeLanguage(lang: any) {
    console.log(lang);
    if (lang === 'en') {
      this.translate.use('id');
      this.currentLanguage = 'id';
      this.srcImages =
        'https://cdn-icons-png.flaticon.com/512/3053/3053985.png';
    } else {
      this.translate.use('en');
      this.currentLanguage = 'en';
      this.srcImages = 'https://cdn-icons-png.flaticon.com/512/323/323329.png';
    }
  }

  loginPage() {
    this.router.navigate(['/login-page']);
  }

  logoutPage() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You Want To Logout",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout'
    }).then((result) => {
      if(result.isConfirmed){
        this.serviceHomepage.userLogout();
        this.router.navigate(['home-page']);
        this.landingPage = true;
      }
    })
  }
}
