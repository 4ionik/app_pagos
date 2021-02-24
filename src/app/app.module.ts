import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { FormsModule } from '@angular/forms';

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { IonicStorageModule } from "@ionic/storage";

import { PostService } from './services/post.service';
import { HttpClientModule } from '@angular/common/http';
import { NumberInputComponent } from '../app/components/number-input/number-input.component';
import { CurrencyPipe } from '@angular/common';

@NgModule({
  declarations: [AppComponent, NumberInputComponent],
  entryComponents: [NumberInputComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    PostService,
    CurrencyPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}