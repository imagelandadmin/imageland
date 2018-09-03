import { Injectable, InjectionToken } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AmplifyService } from 'aws-amplify-angular';
import { Auth } from 'aws-amplify';

export let IAuthService_Token = new InjectionToken<IAuthService>('IAuthService');

export interface IAuthService extends CanActivate {
  login(email: string, pass: string);
  logout();
  isLoggedIn(): boolean;
  register(email: string, pass: string, firstname: string, lastname: string);
  forgotPassword();
}

@Injectable({ providedIn: 'root' })
export class AuthService implements IAuthService {

  signedIn: boolean = false;

  constructor(private router: Router, private amplify: AmplifyService) {
    this.amplify.authStateChange$
      .subscribe(authState => {
        this.signedIn = authState.state === 'signedIn';
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (state.url == '/logout') {
      this.logout();
      return true;
    }
    return this.signedIn;
  }

  isLoggedIn(): boolean {
    return this.signedIn;
  }

  login(email: string, pass: string) {
    Auth.signIn(email, pass)
      .then(user => {
        this.router.navigate(["/"]);
      })
      .catch(err => console.log(err));
  }

  logout() {
    Auth.signOut().then(user => {
      this.router.navigate(["/"]);
    }).catch(err => console.log(err));
  }

  register(email: string, pass: string, firstname: string, lastname: string) {
    console.log("registering " + email);
    Auth.signUp({
      username: email,
      password: pass,
      attributes: {
        email: email,
        given_name: firstname,
        family_name: lastname
      },
      validationData: []
    }).then(user => {
      console.log('success');
      this.router.navigate(["/"]);
    }).catch(err => console.log("got an error" + err));
  }

  forgotPassword() {

  }
}
