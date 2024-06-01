import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guard/admin.guard';
const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule) },
  { path: '**', redirectTo: 'home', pathMatch: 'full'},
  { path: 'admin', loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule), canActivate:[AdminGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
