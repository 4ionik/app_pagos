import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoPagoPage } from './tipo-pago.page';

const routes: Routes = [
  {
    path: '',
    component: TipoPagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TipoPagoPageRoutingModule {}
