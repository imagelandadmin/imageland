import { Injectable, InjectionToken, Output, EventEmitter } from '@angular/core';
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
  loginEvent: EventEmitter<boolean>;
}

@Injectable({ providedIn: 'root' })
export class AuthService implements IAuthService {

  private static signedIn: boolean = false;
  private static verificationCode: string = "";
  @Output() 
  public loginEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(private router: Router, private amplify: AmplifyService) {
    log.debug(`Constructing auth service.`);
    this.amplify.authStateChange$
      .subscribe(authState => {
        log.debug(`Auth state changed to ${authState.state}`);
        AuthService.signedIn = (authState.state == "signedIn");
    });

    this.router.routerState.root.queryParams.subscribe((params: Params) => {
      AuthService.verificationCode = params['code'];
    });

    let self = this;
    /* FIXME is this check really needed, shouldn't they have to click the FB button?
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        log.debug(`Facebook status was connected when auth service was constructed.`);
        self.loginFacebook();
      }
    });
    */
    FB.Event.subscribe('auth.authResponseChange', function(response) {
      log.debug(`Facebook status changed to ${response.status}.`);
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
    log.debug(`AuthGuard canActivate=${canActivate} for URL=${state.url}`);
    return canActivate;
  }

  isLoggedIn(): boolean {
    return AuthService.signedIn;
  }

  async loginFacebook() {
    log.debug(`Logging in with Facebook.`);
    let fbAuth = FB.getAuthResponse();
    log.debug(`Facebook auth response: ${JSON.stringify(fbAuth)}`);
    let self = this;
    FB.api('/me?fields=email,id,first_name,last_name', async function(response) {
      log.debug(`Performing federatedSignIn with response: ${JSON.stringify(response)}`);
      Auth.verifyCurrentUserAttribute
      await Auth.federatedSignIn('facebook', {
        token: fbAuth.accessToken,
        expires_at: fbAuth.expiresIn
      }, {
        username: response.id,
        email: response.email,
        given_name: response.first_name,
        family_name: response.last_name
      }).catch(err => {
        log.error(`While attempting to facebook login ${response.email}: \n${JSON.stringify(err)}`);
        throw err;
      });

      let currentUser = await Auth.currentAuthenticatedUser();
      log.debug(`CurrentAuthenticatedUser=${JSON.stringify(currentUser)}`);
      AuthService.signedIn = (currentUser != undefined);
      log.debug(`Emitting event for FederatedSignIn result=${AuthService.signedIn}`);
      self.loginEvent.emit(AuthService.signedIn);
    });
  }

  async login(email: string, pass: string): Promise<User> {
    log.debug(`Logging in with Imageland AWS.`);
    if(AuthService.verificationCode) {
      log.debug(`Discovered verification code ${AuthService.verificationCode}`);
      await this.confirmRegistration(email, AuthService.verificationCode);
      AuthService.verificationCode = "";
    }

    let user = await Auth.signIn(email, pass)
      .catch(err => {
        log.error(`While attempting to login ${email}: \n${JSON.stringify(err)}`);
        throw err;
      });

    let currentUser = await Auth.currentAuthenticatedUser();
    log.debug(`CurrentAuthenticatedUser=${JSON.stringify(currentUser)}`);
    AuthService.signedIn = (currentUser != undefined);
    log.debug(`Emitting event for Login result=${AuthService.signedIn}`);
    this.loginEvent.emit(AuthService.signedIn);
    return user;
  }

  async logout(): Promise<void> {
    log.debug(`Logging out.`);
    await Auth.signOut()
      .catch(err => {
        log.error(`While attempting to logout: \n${JSON.stringify(err)}`);
        throw err;
      });

    this.router.navigate([Route.HOME]);
  }

  async register(email: string, pass: string, firstname: string, lastname: string): Promise<any> {
    log.debug(`Registering user ${email}.`);
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
    log.debug(`Confirming registration code=${code}`);
    return await Auth.confirmSignUp(email, code, { forceAliasCreation: true })
      .catch(err => {
        log.error(`While confirming user registration for ${email}: \n${JSON.stringify(err)}`);
        throw err;
      });
  }

  async forgotPassword(email: string): Promise<void> {
    log.debug(`Submitting forgotPassword call for email=${email}`);
    await Auth.forgotPassword(email)
      .catch(err => {
        log.error(`While resetting password for ${email}: \n${JSON.stringify(err)}`);
        throw err;
      });
  }

  async changePassword(email: string, oldPass: string, newPass: string): Promise<void> {
    log.debug(`Changing password for email=${email}`);
    await Auth.changePassword(email, oldPass, newPass)
      .catch(err => {
        log.error(`While changing password for ${email}: \n${JSON.stringify(err)}`);
        throw err;
      });
  }
}
