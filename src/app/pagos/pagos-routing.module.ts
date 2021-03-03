import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { PagosPage } from './pagos.page';

const routes: Routes = [
  {
    path: '',
    component: PagosPage
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagosPageRoutingModule {}
