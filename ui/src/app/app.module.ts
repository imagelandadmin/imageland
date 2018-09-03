import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { ReactiveFormsModule }    from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { SearchComponent } from './search/search.component';
import { FolderComponent } from './folder/folder.component';
import { UploadComponent } from './upload/upload.component';
import { CartComponent } from './cart/cart.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    MainComponent,
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
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FileUploadModule,
    MatButtonModule,
    MatCheckboxModule,
    AmplifyAngularModule,
    ReactiveFormsModule
  ],
  providers: [
    AmplifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
