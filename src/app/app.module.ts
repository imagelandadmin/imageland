//modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { MatButtonModule, MatCheckboxModule, MatDialogModule } from '@angular/material';
import { AmplifyAngularModule } from 'aws-amplify-angular';
import { ReactiveFormsModule }    from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

//components
import { AppComponent } from './app.component';
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
    AppRoutingModule,
    HttpClientModule,
    FileUploadModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    AmplifyAngularModule,
    ReactiveFormsModule
  ],
  providers: [
    //services
    AmplifyService,
    { provide: IAuthService_Token, useClass: AuthService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
