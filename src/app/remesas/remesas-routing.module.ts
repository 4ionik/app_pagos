import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RemesasPage } from './remesas.page';

const routes: Routes = [
  {
    path: '',
    component: RemesasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RemesasPageRoutingModule {}
