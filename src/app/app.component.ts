import { Component, Inject } from '@angular/core';
import { IAuthService_Token, IAuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ui';

  constructor(@Inject(IAuthService_Token) private auth: IAuthService) {

  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
  
}
