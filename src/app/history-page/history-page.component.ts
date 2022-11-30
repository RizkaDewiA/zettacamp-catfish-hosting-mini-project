import { Component, OnInit} from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit{
  showHistoryAdmin:boolean = false;
  constructor() { }

  ngOnInit(): void {
    const role = JSON.parse(localStorage.getItem(environment.role));
    if(role == "admin"){
      this.showHistoryAdmin = true;
    }else if(role == "user"){
      this.showHistoryAdmin = false;
    }
  }
}
