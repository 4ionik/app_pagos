import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TipoPagoPageRoutingModule } from './tipo-pago-routing.module';

import { TipoPagoPage } from './tipo-pago.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TipoPagoPageRoutingModule
  ],
  declarations: [TipoPagoPage]
})
export class TipoPagoPageModule {}
