import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user.component';
import { ProductComponent } from './product/product.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: UserComponent }
    ]
  },

  {
    path: 'shop',
    component: ProductComponent,
    children: [
      { path: '', component: UserComponent }
    ]
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    children: [
      { path: '', component: UserComponent }
    ]
  },

  {
    path: 'register',
    component: RegisterComponent,
    children: [
      { path: '', component: UserComponent }
    ]
  },

  {
    path: 'login',
    component: LoginComponent,
    children: [
      { path: '', component: UserComponent }
    ]
  },

  {
    path: 'account',
    component: AccountComponent,
    children: [
      { path: '', component: UserComponent }
    ]
  },

  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    children: [
      { path: '', component: UserComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
