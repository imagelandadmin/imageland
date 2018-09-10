import { AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, LoginOpt } from "angularx-social-login";
import { Injectable } from '@angular/core';

const fbLoginOptions: LoginOpt = {
    scope: 'email',
    return_scopes: true
}; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11
  
const googleLoginOptions: LoginOpt = {
    scope: 'profile email'
}; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig
  

@Injectable({ providedIn: 'root' })
export class SocialConfigProvider extends AuthServiceConfig {
    private static socialLoginConfig = [
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("960588352957-646d1sjhilj4nb57gskb916k10a1gbhn.apps.googleusercontent.com", googleLoginOptions)
    },
    {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider("495152287625522", fbLoginOptions)
    }];

    constructor() {
        super(SocialConfigProvider.socialLoginConfig);
    }
}


