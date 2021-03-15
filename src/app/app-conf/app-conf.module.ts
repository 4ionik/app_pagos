import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppConfPageRoutingModule } from './app-conf-routing.module';

import { AppConfPage } from './app-conf.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppConfPageRoutingModule
  ],
  declarations: [AppConfPage]
})
export class AppConfPageModule {}
