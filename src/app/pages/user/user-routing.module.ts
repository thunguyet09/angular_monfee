import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user.component';
import { ProductComponent } from './product/product.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
