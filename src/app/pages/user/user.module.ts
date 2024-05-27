import { NgModule } from '@angular/core';
import { UserRoutingModule } from './user-routing.module';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ProductComponent } from './product/product.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
@NgModule({
  declarations: [
    UserComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    ProductComponent,
    ProductDetailComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatIconModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [UserComponent],
})
export class UserModule { }
