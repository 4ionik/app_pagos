import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RemesasPageRoutingModule } from './remesas-routing.module';

import { RemesasPage } from './remesas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RemesasPageRoutingModule
  ],
  declarations: [RemesasPage]
})
export class RemesasPageModule {}
