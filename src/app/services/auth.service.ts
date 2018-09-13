import { Injectable, InjectionToken } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Params } from '@angular/router';
import { AmplifyService } from 'aws-amplify-angular';
import { Auth } from 'aws-amplify';
import { Logger } from 'aws-amplify';
import { Route } from '../app-routing.module';

const log = new Logger('auth');

export let IAuthService_Token = new InjectionToken<IAuthService>('IAuthService');

export interface IAuthService extends CanActivate {
  login(): Promise<void>;
  logout(): Promise<void>;
  isLoggedIn(): boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService implements IAuthService {

  private static signedIn: boolean = false;

  constructor(
    private router: Router, 
    private amplify: AmplifyService) 
  {
    log.debug(`Constructing auth service.`);
    this.amplify.authStateChange$
      .subscribe(authState => {
        log.debug(`Auth state changed to ${authState.state}`);
        AuthService.signedIn = (authState.state === "signedIn");
    });

    this.router.routerState.root.queryParams.subscribe((params: Params) => {

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

  async logout(): Promise<void> {
    log.debug(`Logging out.`);
    AuthService.signedIn = false;
    await Auth.signOut()
      .catch(err => {
        log.error(`While attempting to logout: \n${JSON.stringify(err)}`);
        throw err;
      });

    this.router.navigate([Route.HOME]);
  }

  async login(): Promise<void> {
    const config: any = Auth.configure({});
    const { 
        domain,  
        redirectSignIn, 
        redirectSignOut,
        responseType } = config.oauth;
    
    const clientId = config.userPoolWebClientId;
    const url = 'https://' + domain + '/login?redirect_uri=' + redirectSignIn + 
                  '&response_type=' + responseType + '&client_id=' + clientId;
    log.debug(`Redirecting to ${url}`);
    window.location.assign(url);
  }
}
