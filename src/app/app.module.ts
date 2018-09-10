//modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { AmplifyAngularModule } from 'aws-amplify-angular';
import { ReactiveFormsModule }    from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";

//components
import { AppComponent } from './components/app/app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { FolderComponent } from './components/folder/folder.component';
import { UploadComponent } from './components/upload/upload.component';
import { CartComponent } from './components/cart/cart.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

//services
import { AmplifyService } from 'aws-amplify-angular';
import { IAuthService_Token, AuthService } from './services/auth.service';
import { IErrorService_Token, ErrorService } from './services/error.service';
import { FacebookSdkLoader } from './services/facebook-sdk';
import { SocialConfigProvider } from './services/social-config.provider';

@NgModule({
  declarations: [
    //components
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    HomeComponent,
    SearchComponent,
    FolderComponent,
    UploadComponent,
    CartComponent,
    SettingsComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    //modules
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FileUploadModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    AmplifyAngularModule,
    ReactiveFormsModule,
    SocialLoginModule
  ],
  providers: [
    //services
    // Note: We need the APP_INITIALIZER below to ensure the facebook sdk has 
    // finished downloading before the rest of angular bootstraps... ugh
    FacebookSdkLoader, 
    { provide: APP_INITIALIZER, 
      useFactory: (loader: FacebookSdkLoader) => () => loader.loadFacebookSdk(), 
      deps: [FacebookSdkLoader], multi: true },
    AmplifyService,
    SocialConfigProvider,
    { provide: AuthServiceConfig, useClass: SocialConfigProvider },
    { provide: IAuthService_Token, useClass: AuthService },
    { provide: IErrorService_Token, useClass: ErrorService }
  ],
  bootstrap: [AppComponent],
  entryComponents: [LoginComponent]
})
export class AppModule { 

}
