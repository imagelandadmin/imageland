import { Inject } from '@angular/core';
import { IAuthService_Token, IAuthService } from '../../services/auth.service';
import { BaseComponent } from './base.component';

/**
 * Base component that confirms user is authenticated on init.
 */
export abstract class BaseAuthenticatedComponent extends BaseComponent {

    constructor(@Inject(IAuthService_Token) private auth: IAuthService) {
        super();
    }

    async ngOnInit() {
        super.ngOnInit();
        if(this.needsAuth()) {
            await this.auth.login();
        }
    }

    private needsAuth(): boolean {
        return !this.auth.isLoggedIn() && this.requiresAuth();
    }
    
    /**
     * Subcomponents that don't always require the user to be logged in
     * should override this and return false in such circumstances;
     */
    protected requiresAuth(): boolean {
        return true;
    }
}