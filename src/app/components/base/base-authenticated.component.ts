import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
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

    ngOnInit() {
        super.ngOnInit();
        if(this.needsAuth() && !BaseAuthenticatedComponent.dialogOpen) {
            this.showLoginDialog();
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

    private showLoginDialog() {
        BaseAuthenticatedComponent.dialogOpen = true;
        this.log.info("Showing login dialog.");
        this.dialog.open(LoginComponent, {
            disableClose: true,
            closeOnNavigation: true
        }).afterClosed().subscribe(() => {
            BaseAuthenticatedComponent.dialogOpen = false;
        });
    }
}