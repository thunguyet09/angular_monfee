import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';

@NgModule({
  declarations: [
   AdminComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule
  ],
  providers: [],
})
export class AdminModule { }
