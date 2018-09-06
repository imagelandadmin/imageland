import { Injectable, InjectionToken } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AmplifyService } from 'aws-amplify-angular';
import { Auth } from 'aws-amplify';
import { User } from '../models/schema';
import { Logger } from 'aws-amplify';
import { Route } from '../app-routing.module';

const log = new Logger('auth');

export let IAuthService_Token = new InjectionToken<IAuthService>('IAuthService');

export interface IAuthService extends CanActivate {
  login(email: string, pass: string): Promise<User>;
  logout(): Promise<void>;
  isLoggedIn(): boolean;
  register(email: string, pass: string, firstname: string, lastname: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  changePassword(email: string, oldPass: string, newPass: string): Promise<void>;
}

@Injectable({ providedIn: 'root' })
export class AuthService implements IAuthService {

  private static signedIn: boolean = false;

  constructor(private router: Router, private amplify: AmplifyService) {
    this.amplify.authStateChange$
      .subscribe(authState => {
        log.debug(`Auth state changed to ${authState.state}`);
        AuthService.signedIn = authState.state == "signedIn";
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (state.url == Route.LOGOUT) {
      this.logout();
      return true;
    }

    let canActivate = AuthService.signedIn;
    return canActivate;
  }

  isLoggedIn(): boolean {
    return AuthService.signedIn;
  }

  async login(email: string, pass: string): Promise<User> {
    let user = await Auth.signIn(email, pass)
      .catch(err => {
        log.error(`While attempting to login ${email}: \n${JSON.stringify(err)}`);
        throw err;
      });

    this.router.navigate([Route.HOME]);
    return user;
  }

  async logout(): Promise<void> {
    await Auth.signOut()
      .catch(err => {
        log.error(`While attempting to logout: \n${JSON.stringify(err)}`);
        throw err;
      });

    this.router.navigate([Route.HOME]);
  }

  async register(email: string, pass: string, firstname: string, lastname: string): Promise<any> {
    await Auth.signUp({
      username: email,
      password: pass,
      attributes: {
        email: email,
        given_name: firstname,
        family_name: lastname
      },
      validationData: []
    }).catch(err => {
      log.error(`While registering user ${email}: \n${JSON.stringify(err)}`);
      throw err;
    });

    this.router.navigate([Route.HOME]);
  }

  async forgotPassword(email: string): Promise<void> {
    await Auth.forgotPassword(email)
      .catch(err => {
        log.error(`While resetting password for ${email}: \n${JSON.stringify(err)}`);
        throw err;
      });
  }

  async changePassword(email: string, oldPass: string, newPass: string): Promise<void> {
    await Auth.changePassword(email, oldPass, newPass)
      .catch(err => {
        log.error(`While changing password for ${email}: \n${JSON.stringify(err)}`);
        throw err;
      });
  }
}
