import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { EmpresasPage } from './empresas.page';

const routes: Routes = [
  {
    path: '',
    component: EmpresasPage
  }
];

@NgModule({
  imports: [CommonModule,RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpresasPageRoutingModule {}
