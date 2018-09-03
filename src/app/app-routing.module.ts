import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { SearchComponent } from './search/search.component'; 
import { CartComponent } from './cart/cart.component'; 
import { FolderComponent } from './folder/folder.component'; 
import { UploadComponent } from './upload/upload.component'; 
import { SettingsComponent } from './settings/settings.component'; 
import { ProfileComponent } from './profile/profile.component'; 
import { RegisterComponent } from './register/register.component'; 
import { AuthService } from './auth.service';

const routes: Routes = [
  {
    path: "",
    component: MainComponent
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
    component: MainComponent,
    canActivate: [AuthService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
