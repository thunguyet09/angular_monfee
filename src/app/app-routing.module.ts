import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: 'home', loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule) },
  { path: '', loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule) },
  { path: 'admin', loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
