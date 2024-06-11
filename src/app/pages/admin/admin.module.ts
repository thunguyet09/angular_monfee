import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CategoryComponent } from './category/category.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryDetailsComponent } from './category-details/category_details.component';
import { AddComponent } from './category/add/add.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductComponent } from './product/product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { AddProductComponent } from './add-product/add-product.component';
import { DeleteConfirmComponent } from './product/delete-confirm/delete-confirm.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@NgModule({
  declarations: [
   AdminComponent,
   HeaderComponent,
   FooterComponent,
   CategoryComponent,
   DashboardComponent,
   CategoryDetailsComponent,
   AddComponent,
   ProductComponent,
   ProductDetailsComponent,
   AddProductComponent,
   DeleteConfirmComponent,
   EditProductComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [],
})
export class AdminModule { }
