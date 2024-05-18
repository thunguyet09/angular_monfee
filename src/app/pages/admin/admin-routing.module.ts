import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CategoryComponent } from './category/category.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoryDetailsComponent } from './category-details/category_details.component';
import { ProductComponent } from './product/product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

const routes: Routes = [
  {
    path: 'category',
    component: CategoryComponent,
    children: [
      { path: '', component: AdminComponent }
    ]
  },
  {
    path: 'category-details',
    component: CategoryDetailsComponent,
    children: [
      { path: '', component: AdminComponent }
    ]
  },
  {
    path: 'product-details',
    component: ProductDetailsComponent,
    children: [
      { path: '', component: AdminComponent }
    ]
  },
  {
    path: 'products',
    component: ProductComponent,
    children: [
      { path: '', component: AdminComponent }
    ]
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', component: AdminComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
