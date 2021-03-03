import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomePage } from '../home/home.page';
import { PagosPage } from '../pagos/pagos.page';
import { RemesasPage } from '../remesas/remesas.page';
import { UsuariosPage } from '../usuarios/usuarios.page';
import { EmpresasPage } from '../empresas/empresas.page';
import { TipoPagoPage } from '../tipo-pago/tipo-pago.page';
import { OrdenesPage } from '../ordenes/ordenes.page';

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
  },
  {
    path: '',
    component: MenuPage,
    children: [{
      path: 'usuarios',
      component: UsuariosPage
    }]
  },
  {
    path: '',
    component: MenuPage,
    children: [{
      path: 'empresas',
      component: EmpresasPage
    }]
  },
  {
    path: '',
    component: MenuPage,
    children: [{
      path: 'tipo-pago',
      component: TipoPagoPage
    }]
  },
  {
    path: '',
    component: MenuPage,
    children: [{
      path: 'ordenes',
      component: OrdenesPage
    }]
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
