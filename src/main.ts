import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Amplify from 'aws-amplify';
import amplify from './aws-exports';

const oauth = {
  // Domain name
  domain : 'imageland.auth.us-east-1.amazoncognito.com', 
  // Authorized scopes
  scope : ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'], 
  // Callback URL
  redirectSignIn : 'https://dev.imageland.us', 
  // Sign out URL
  redirectSignOut : 'https://dev.imageland.us',
  // 'code' for Authorization code grant, 
  // 'token' for Implicit grant
  responseType: 'code',
  // optional, for Cognito hosted ui specified options
  options: {
      // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
      AdvancedSecurityDataCollectionFlag : true
  }
}

Amplify.configure(amplify);
Amplify.configure({
  Auth: {
      oauth: oauth
  }
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
