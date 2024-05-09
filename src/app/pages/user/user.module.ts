import { NgModule } from '@angular/core';
import { UserRoutingModule } from './user-routing.module';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [
    UserComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [UserComponent],
})
export class UserModule { }
