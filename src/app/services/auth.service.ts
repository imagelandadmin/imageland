import { Injectable, InjectionToken } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Params } from '@angular/router';
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
  confirmRegistration(email: string, code: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  changePassword(email: string, oldPass: string, newPass: string): Promise<void>;
}

@Injectable({ providedIn: 'root' })
export class AuthService implements IAuthService {

  private static signedIn: boolean = false;
  private static verificationCode: string = "";

  constructor(private router: Router, private amplify: AmplifyService) {
    this.amplify.authStateChange$
      .subscribe(authState => {
        log.debug(`Auth state changed to ${authState.state}`);
        AuthService.signedIn = authState.state == "signedIn";
    });

    this.router.routerState.root.queryParams.subscribe((params: Params) => {
      AuthService.verificationCode = params['code'];
    });

    let self = this;
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        self.loginFacebook();
      }
    });

    FB.Event.subscribe('auth.authResponseChange', function(response) {
      if (response.status === 'connected') {
        self.loginFacebook();
      }
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

  async loginFacebook() {
    let fbAuth = FB.getAuthResponse();
    let self = this;
    FB.api('/me', async function(response) {
      await Auth.federatedSignIn('facebook', {
        token: fbAuth.accessToken,
        expires_at: fbAuth.expiresIn
      }, {
        user: response.email
      }).catch(err => {
        log.error(`While attempting to facebook login ${response.email}: \n${JSON.stringify(err)}`);
        throw err;
      });

      AuthService.signedIn = (await Auth.currentAuthenticatedUser) != undefined;
      self.router.navigate([Route.HOME]);
    });
  }

  async login(email: string, pass: string): Promise<User> {
    if(AuthService.verificationCode) {
      await this.confirmRegistration(email, AuthService.verificationCode);
      AuthService.verificationCode = "";
    }

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

  async confirmRegistration(email: string, code: string): Promise<void> {
    log.info(`Confirming registration code=${code}`);
    return await Auth.confirmSignUp(email, code, { forceAliasCreation: true })
      .catch(err => {
        log.error(`While confirming user registration for ${email}: \n${JSON.stringify(err)}`);
        throw err;
      });
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
