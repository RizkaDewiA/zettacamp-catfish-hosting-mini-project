import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-menu-higlight',
  templateUrl: './menu-higlight.component.html',
  styleUrls: ['./menu-higlight.component.css']
})
export class MenuHiglightComponent implements OnInit {
  @Input() itemMenu:any;
  constructor() { }

  ngOnInit(): void {
  }

}
