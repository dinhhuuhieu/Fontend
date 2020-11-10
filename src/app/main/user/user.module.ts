import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { KhachhangComponent } from './khachhang/khachhang.component';
@NgModule({
  declarations: [UserComponent, UserComponent, KhachhangComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: 'khachhang',
        component: KhachhangComponent,
      },
  ]),  
  ]
})
export class UserModule { }
