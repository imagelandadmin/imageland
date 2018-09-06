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

export const enum Route {
  HOME = "/",
  REGISTER = "/register",
  SEARCH = "/search",
  FOLDER = "/folder",
  CART = "/cart",
  UPLOAD = "/upload",
  SETTINGS = "/settings",
  PROFILE = "/profile",
  LOGOUT = "/logout"
}

const routes: Routes = [
  {
    path: Route.HOME.substring(1),
    component: HomeComponent
  },{
    path: Route.REGISTER.substring(1),
    component: RegisterComponent
  },{
    path: Route.SEARCH.substring(1),
    component: SearchComponent,
    canActivate: [AuthService]
  },{
    path: Route.FOLDER.substring(1),
    component: FolderComponent,
    canActivate: [AuthService]
  },{
    path: Route.CART.substring(1),
    component: CartComponent,
    canActivate: [AuthService]
  },{
    path: Route.UPLOAD.substring(1),
    component: UploadComponent,
    canActivate: [AuthService]
  },{
    path: Route.SETTINGS.substring(1),
    component: SettingsComponent,
    canActivate: [AuthService]
  },{
    path: Route.PROFILE.substring(1),
    component: ProfileComponent,
    canActivate: [AuthService]
  },{
    path: Route.LOGOUT.substring(1),
    component: HomeComponent,
    canActivate: [AuthService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
