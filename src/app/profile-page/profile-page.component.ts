import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';
import { ProfilePageService } from './profile-page.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  dataUser: any;
  constructor(private userProfile: ProfilePageService) { }

  ngOnInit(): void {
    const user_id = JSON.parse(localStorage.getItem(environment.user_id));
    this.subs.sink = this.userProfile.getUserProfile(user_id).valueChanges.subscribe((resp:any)=>{
      this.dataUser = resp?.data;
      this.dataUser = this.dataUser?.getOneUser[0];
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
