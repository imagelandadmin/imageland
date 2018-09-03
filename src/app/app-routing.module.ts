import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component'; 
import { CartComponent } from './components/cart/cart.component'; 
import { FolderComponent } from './components/folder/folder.component'; 
import { UploadComponent } from './components/upload/upload.component'; 
import { SettingsComponent } from './components/settings/settings.component'; 
import { ProfileComponent } from './components/profile/profile.component'; 
import { RegisterComponent } from './components/register/register.component'; 
import { AuthService } from './services/auth.service';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },{
    path: "register",
    component: RegisterComponent
  },{
    path: "search",
    component: SearchComponent,
    canActivate: [AuthService]
  },{
    path: "folder",
    component: FolderComponent,
    canActivate: [AuthService]
  },{
    path: "cart",
    component: CartComponent,
    canActivate: [AuthService]
  },{
    path: "upload",
    component: UploadComponent,
    canActivate: [AuthService]
  },{
    path: "settings",
    component: SettingsComponent,
    canActivate: [AuthService]
  },{
    path: "profile",
    component: ProfileComponent,
    canActivate: [AuthService]
  },{
    path: "logout",
    component: HomeComponent,
    canActivate: [AuthService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
