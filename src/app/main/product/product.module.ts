import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChitiethopdongComponent } from './chitiethopdong/chitiethopdong.component';
import { HopdongComponent } from './hopdong/hopdong.component';
import { LoaiComponent } from './loai/loai.component';
import { NhasanxuatComponent } from './nhasanxuat/nhasanxuat.component';
import { SanphamComponent } from './sanpham/sanpham.component';


@NgModule({
  declarations: [ 
    ChitiethopdongComponent, HopdongComponent, LoaiComponent, NhasanxuatComponent, SanphamComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'chitiethopdong',
        component: ChitiethopdongComponent,
      },
      {
        path: 'hopdong',
        component: HopdongComponent,
      },
      {
        path: 'loai',
        component: LoaiComponent,
      },
      {
        path: 'nhasanxuat',
        component: NhasanxuatComponent,
      },
      {
        path: 'sanpham',
        component: SanphamComponent,
      },
  ]),  
  ]
})
export class ProductModule { }
