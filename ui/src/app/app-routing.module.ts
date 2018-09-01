import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { SearchComponent } from './search/search.component'; 
import { CartComponent } from './cart/cart.component'; 
import { FolderComponent } from './folder/folder.component'; 
import { UploadComponent } from './upload/upload.component'; 

const routes: Routes = [
  {
    path: "",
    component: MainComponent
  },{
    path: "search",
    component: SearchComponent
  },{
    path: "folder",
    component: FolderComponent
  },{
    path: "cart",
    component: CartComponent
  },{
    path: "upload",
    component: UploadComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
