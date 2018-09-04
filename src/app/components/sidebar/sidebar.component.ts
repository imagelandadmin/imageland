import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent extends BaseComponent {

  currentUrl: string;

  constructor(private router: Router) { 
    super();
    router.events.subscribe((_: NavigationEnd) => {
      if(_.url != null) {
        this.currentUrl = _.url;
      }
    });
  }
}
