import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from '../home/home.page';
import { PagosPage } from '../pagos/pagos.page';
import { RemesasPage } from '../remesas/remesas.page';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [{
      path: 'home',
      component: HomePage
    }]
  },
  {
    path: '',
    component: MenuPage,
    children: [{
      path: 'pagos',
      component: PagosPage
    }]
  },
  {
    path: '',
    component: MenuPage,
    children: [{
      path: 'remesas',
      component: RemesasPage
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
