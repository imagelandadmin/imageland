import { Component, Inject, OnInit } from '@angular/core';
import { BaseAuthenticatedComponent } from '../base/base-authenticated.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseAuthenticatedComponent {
  title = 'Imageland';

}
