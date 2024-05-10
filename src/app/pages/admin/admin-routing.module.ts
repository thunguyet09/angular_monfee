import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CategoryComponent } from './category/category.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'category',
    component: CategoryComponent,
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
