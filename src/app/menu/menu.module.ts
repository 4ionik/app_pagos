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
import { ViaticosPage } from '../viaticos/viaticos.page';
import { ReportesPage } from '../reportes/reportes.page';
import { AppConfPage } from '../app-conf/app-conf.page';

import { UserModalComponent } from '../user-modal/user-modal.component';
import { EmpresaModalComponent } from '../empresa-modal/empresa-modal.component';
import { BancosPage } from '../bancos/bancos.page';
import { BancoModalComponent } from '../banco-modal/banco-modal.component';
import { ViaticosModalComponent } from '../viaticos-modal/viaticos-modal.component';
import { ReportModalComponent } from '../report-modal/report-modal.component';

import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ionic4DatepickerModule,
    MenuPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MenuPage,HomePage,RemesasPage,PagosPage,OrdenesPage, UsuariosPage, EmpresasPage, TipoPagoPage, ViaticosPage, ReportesPage, AppConfPage, UserModalComponent, ViaticosModalComponent, ReportModalComponent, UserModalComponent,EmpresaModalComponent,BancosPage,BancoModalComponent],
  entryComponents: [UserModalComponent,EmpresaModalComponent,BancoModalComponent, ViaticosModalComponent, ReportModalComponent]
})
export class MenuPageModule {}
