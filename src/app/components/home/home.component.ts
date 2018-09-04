import { Component, OnInit } from '@angular/core';
import { BaseAuthenticatedComponent } from '../base/base-authenticated.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseAuthenticatedComponent {

  msg: String = "Welcome to Imageland!";

}
