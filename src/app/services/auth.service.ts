import { Injectable, InjectionToken } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Params } from '@angular/router';
import { AmplifyService } from 'aws-amplify-angular';
import { Auth } from 'aws-amplify';
import { User } from '../models/schema';
import { Logger } from 'aws-amplify';
import { Route } from '../app-routing.module';
import { AuthService as SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider, SocialUser } from "angularx-social-login";

const log = new Logger('auth');

export let IAuthService_Token = new InjectionToken<IAuthService>('IAuthService');

export interface IAuthService extends CanActivate {
  login(email: string, pass: string): Promise<User>;
  loginFacebook(): Promise<User>;
  loginGoogle(): Promise<User>;
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

  constructor(
    private router: Router, 
    private socialAuth: SocialAuthService,
    private amplify: AmplifyService) 
  {
    log.debug(`Constructing auth service.`);
    this.amplify.authStateChange$
      .subscribe(authState => {
        log.debug(`Auth state changed to ${authState.state}`);
        AuthService.signedIn = (authState.state == "signedIn");
    });

    this.router.routerState.root.queryParams.subscribe((params: Params) => {
      AuthService.verificationCode = params['code'];
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

  async loginFacebook(): Promise<User> {
    var user = await this.loginSocial(FacebookLoginProvider.PROVIDER_ID);
    log.debug(`Facebook auth response=${JSON.stringify(FB.getAuthResponse())}`);
    return await this.federatedCognitoLogin(user, FB.getAuthResponse().expiresIn);
  }

  async loginGoogle(): Promise<User> {
    let user = await this.loginSocial(GoogleLoginProvider.PROVIDER_ID);
    let googleUser = (<any>window).gapi.auth2.getAuthInstance().currentUser.get();
    log.debug(`Google user is ${JSON.stringify(googleUser)}`);
    log.debug(`Google auth response=${JSON.stringify(googleUser.getAuthResponse())}`);
    let expiry = googleUser.getAuthResponse().expires_in;
    return await this.federatedCognitoLogin(user, expiry);
  }

  private async loginSocial(provider: string): Promise<SocialUser> {
    log.debug(`Logging in with ${provider}.`);
    let socialUser = await this.socialAuth.signIn(provider)
    .catch(err => {
      log.error(`While attempting to login with ${provider}: \n${JSON.stringify(err)}`);
      throw err;
    });
    
    log.debug(`Login social response User=${JSON.stringify(socialUser)}`);

    return socialUser;
  }

  private async federatedCognitoLogin(socialUser: SocialUser, tokenExpiration: number):  Promise<User> {
    log.debug(`Performing federated login for ${socialUser.email} with expiration ${tokenExpiration}`);
    let user = await Auth.federatedSignIn(socialUser.provider.toLowerCase(), {
      token: socialUser.authToken,
      identity_id: socialUser.idToken,
      expires_at: tokenExpiration
    }, {
      username: socialUser.id,
      email: socialUser.email,
      given_name: socialUser.firstName,
      family_name: socialUser.lastName
    }).catch(err => {
      log.error(`While attempting to federated login ${socialUser.email}: \n${JSON.stringify(err)}`);
      throw err;
    });

    await this.loginCompletion();
    return user;
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

    await this.loginCompletion();
    return user;
  }

  private async loginCompletion() {
    let currentUser = await Auth.currentAuthenticatedUser();
    log.debug(`CurrentAuthenticatedUser=${JSON.stringify(currentUser)}`);
    AuthService.signedIn = (currentUser != undefined);
    if(!currentUser) { 
      throw Error(`No authenticated user available after login.`);
    }
  }

  async logout(): Promise<void> {
    log.debug(`Logging out.`);
    AuthService.signedIn = false;
    this.socialAuth.signOut();
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
