import { Component } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ui';
  signedIn: boolean = false;

  constructor(private amplifyService: AmplifyService) {
    this.amplifyService.authStateChange$
      .subscribe(authState => {
          this.signedIn = authState.state === 'signedIn';
      });
  }
}
