import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppConfPage } from './app-conf.page';

const routes: Routes = [
  {
    path: '',
    component: AppConfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppConfPageRoutingModule {}
