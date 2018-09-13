import { Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IAuthService_Token, IAuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { BaseComponent } from './base.component';

/**
 * Base component that confirms user is authenticated on init.
 */
export abstract class BaseAuthenticatedComponent extends BaseComponent {

    private static dialogOpen = false;

    constructor(
        @Inject(IAuthService_Token) private auth: IAuthService,
        private router: Router,
        private dialog: MatDialog) 
    {
        super();
    }

    async ngOnInit() {
        super.ngOnInit();
        if(this.needsAuth() && !BaseAuthenticatedComponent.dialogOpen) {
            this.auth.login();
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