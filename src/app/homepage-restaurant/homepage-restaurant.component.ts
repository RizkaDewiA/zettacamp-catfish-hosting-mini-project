import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { UserType } from '../model/user-type.model';
import { HomepageRestaurantService } from './homepage-restaurant.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-homepage-restaurant',
  templateUrl: './homepage-restaurant.component.html',
  styleUrls: ['./homepage-restaurant.component.css'],
})
export class HomepageRestaurantComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  opened: boolean = false;
  landingPage: boolean = false;
  menuAllow: UserType;
  currentLanguage:any;
  srcImages: string;
  userData:any;
  badgeLength:any;

  constructor(private router: Router, private translate: TranslateService, private serviceHomepage: HomepageRestaurantService) {
    translate.addLangs(['en', 'id']);
  }

  ngOnInit(): void {
    const token = localStorage.getItem(environment.tokenKey);
    const usertype = JSON.parse(localStorage.getItem(environment.usertype));
    this.initLanguage();
    if (token == null) {
      this.landingPage = true;
    } else if (token !== null) {
      this.landingPage = false;
      this.menuAllow = usertype.filter((resp) => resp.view === true);
      this.initUserData();
      this.badgeCart();
      this.router.navigate(['main-page']); 
    }
  }

  initLanguage(){
    let lang = JSON?.parse(localStorage?.getItem('locale'));
    if(lang) {
      this.translate.setDefaultLang(lang);
      this.translate.use(lang);
      this.currentLanguage = lang;
      if(lang == 'id'){
        this.srcImages = 'https://cdn-icons-png.flaticon.com/512/3053/3053985.png';
      }else{
        this.srcImages = 'https://cdn-icons-png.flaticon.com/512/323/323329.png';
      }
    } else {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      localStorage.setItem('locale', JSON.stringify('en'));
      this.currentLanguage = 'en';
      this.srcImages = 'https://cdn-icons-png.flaticon.com/512/323/323329.png';
    }
  }

  initUserData(){
    const user_id = JSON.parse(localStorage.getItem(environment.user_id));
    this.subs.sink = this.serviceHomepage.getUserProfile(user_id).valueChanges.subscribe((resp)=>{
      this.userData = resp?.data;
      this.userData = this.userData?.getOneUser[0];
    })
  }

  badgeCart(){
    this.subs.sink = this.serviceHomepage.getOneCart().valueChanges.subscribe((resp)=>{
      this.badgeLength = resp?.data;
      this.badgeLength = this.badgeLength?.getOneTransaction?.menu?.length; 
    });
  }

  changeLanguage(lang: any) {
    if (lang == 'en') {
      this.translate.use('id');
      this.currentLanguage = 'id';
      localStorage.setItem('locale', JSON.stringify('id'));
      this.srcImages =
        'https://cdn-icons-png.flaticon.com/512/3053/3053985.png';
    } else {
      this.translate.use('en');
      this.currentLanguage = 'en';
      localStorage.setItem('locale', JSON.stringify('en'));
      this.srcImages = 'https://cdn-icons-png.flaticon.com/512/323/323329.png';
    }
  }

  loginPage() {
    this.router.navigate(['/login-page']);
  }

  registerPage() {
    this.router.navigate(['/register-page']);
  }

  logoutPage() {
    Swal.fire({
      title: this.translate.instant("logout.title"),
      text: this.translate.instant("logout.text"),
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: this.translate.instant("logout.cancel-btn"),
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant("logout.confirm-btn")
    }).then((result) => {
      if(result.isConfirmed){
        this.serviceHomepage.userLogout();
        this.router.navigate(['home-page']);
        this.landingPage = true;
      }
    })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
