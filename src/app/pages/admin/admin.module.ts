import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CategoryComponent } from './category/category.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { CategoryDetailsComponent } from './category-details/category_details.component';
@NgModule({
  declarations: [
   AdminComponent,
   HeaderComponent,
   FooterComponent,
   CategoryComponent,
   DashboardComponent,
   CategoryDetailsComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    FormsModule
  ],
  providers: [],
})
export class AdminModule { }
