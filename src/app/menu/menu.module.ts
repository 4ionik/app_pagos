import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuPageRoutingModule } from './menu-routing.module';

import { MenuPage } from './menu.page';
import { HomePage } from '../home/home.page';
import { RemesasPage } from '../remesas/remesas.page';
import { PagosPage } from '../pagos/pagos.page';
import { OrdenesPage } from '../ordenes/ordenes.page';
import { UsuariosPage } from '../usuarios/usuarios.page';
import { EmpresasPage } from '../empresas/empresas.page';
import { TipoPagoPage } from '../tipo-pago/tipo-pago.page';

import { UserModalComponent } from '../user-modal/user-modal.component';
import { EmpresaModalComponent } from '../empresa-modal/empresa-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MenuPage,HomePage,RemesasPage,PagosPage,OrdenesPage, UsuariosPage, EmpresasPage, TipoPagoPage, UserModalComponent,EmpresaModalComponent],
  entryComponents: [UserModalComponent,EmpresaModalComponent]
})
export class MenuPageModule {}
