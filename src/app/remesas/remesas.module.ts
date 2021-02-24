import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RemesasPageRoutingModule } from './remesas-routing.module';

import { RemesasPage } from './remesas.page';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RemesasPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [RemesasPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RemesasPageModule {}
