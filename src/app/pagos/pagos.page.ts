import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { ToastController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/Storage';
import { CurrencyPipe } from '@angular/common';

interface Tipo {
  idtipopago: number;
  nombre_tipo_pago: string;
}

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.page.html',
  styleUrls: ['./pagos.page.scss'],
})
export class PagosPage implements OnInit {

  ishidden = true;
  idOrden: string;
  ordenes = [];
  identifier_order: string;
  idorden = 0;
  client: string;
  amount: any;
  precision = 2;
  idTipoPago = 1;
  idusuario: string;
  anggota: any;
  username:string;
  idrol = 0;
  idempresa = 0;
  box_price = 0;
  box_price_formatted= "$0";
  cost: number;

  tipo_pago = [];
  select_pago: Tipo[] = [];

  constructor(public toastCtrl: ToastController, private postPvdr: PostService, private platform: Platform, private storage: Storage, private currencyPipe: CurrencyPipe) { 
  }

  ionViewWillEnter(){
    this.storage.get('session_storage').then((res)=>{
      this.anggota = res;
      this.username = this.anggota.username;
      this.idusuario = this.anggota.user_id;
      this.idrol = this.anggota.idrol;
      this.idempresa = this.anggota.idempresa;
    });

  }

  ngOnInit() {
    this.doRefresh();
    // this.amount = 1337.1337;
    // console.log(this.getCurrency(this.amount));
  }

  doFilterOrden (){
    if (this.idOrden != "") {
      let body = {
        idOrden: this.idOrden,
        aksi: 'doFilterOrden'
      }

      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        // console.log(data['result'].minLength);
        console.log(data);
        if(data['success']){
          this.ordenes = data['result'];
          if (this.ordenes.length > 0) {
            console.log(this.ordenes[0]['client'])
            this.idorden = this.ordenes[0]['idorden'];
            this.identifier_order = this.ordenes[0]['identifier_order'];
            this.client = this.ordenes[0]['client'];
            this.cost = this.ordenes[0]['cost'];
            if (this.idTipoPago > 1) {
              this.box_price_formatted = this.getCurrency(0);
            }else{
              this.box_price_formatted = this.getCurrency(this.cost)
            }
            this.ishidden = false;
          }else{
            const toast = await this.toastCtrl.create({
              message: 'No se encuentra ninguna orden llamada ' + this.idOrden,
              duration: 2000
            });
            toast.present();
            this.ishidden = true;
          }
        }
      })
    }
  }

  doRefresh(){
    let body = {
      aksi: 'doRefreshTipoPago'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
      console.log(data);
      if(data['success']){
        this.tipo_pago = data['result'];
        if (this.tipo_pago.length > 0) {
          for (let index = 0; index < this.tipo_pago.length; index++) {
            
            this.select_pago[index] = <Tipo>{idtipopago: this.tipo_pago[index]['idtipopago'], nombre_tipo_pago: this.tipo_pago[index]['nombre_tipo_pago']};
          }
        }else{
          
          this.select_pago[0] = <Tipo>{idtipopago: 0, nombre_tipo_pago: 'No hay datos'};
        }
        console.log(this.select_pago);
      }
    })
  }

  // amountChanged(event: number) {
  //   this.amount = event;
  //   console.log(this.amount);
  // }
  getCurrency(amount: number) {
    return this.currencyPipe.transform(amount, 'USD', true, '1.2-2');
  }

  onChangePrice($event) {
    this.box_price = $event.target.value.replace(/[^0-9.]/g, "");
    if (this.box_price) {
        this.box_price_formatted = this.getCurrency(this.box_price)
        console.log("box_price_formatted: " + this.box_price_formatted);
    }
  }
  onPriceUp($event){
      this.box_price = $event.target.value.replace(/[^0-9.]/g, "");
      this.box_price_formatted = String(this.box_price);
  }

  tipoPagoChange($event){
    console.log($event.target.value);
    this.idTipoPago = $event.target.value;
    if (this.idTipoPago > 1) {
      this.box_price_formatted = this.getCurrency(0);
    }else{
      this.box_price_formatted = this.getCurrency(this.cost)
    }
  }

  async savePagos(){
    if (this.box_price > 0) {

      let body = {
        idOrden: this.idorden,
        idTipoPago: this.idTipoPago,
        idusuario: this.idusuario,
        monto: this.box_price,
        idempresa: this.idempresa,
        idrol: this.idrol,
        aksi: 'addPagos'
      }
  
      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        console.log(data);
        if(data['success']){
          console.log(data['result']);
          if (data['result'] == 'success') {
            const toast = await this.toastCtrl.create({
              message: 'Pago registrado correctamente',
              duration: 2000
            });
            toast.present();
            this.box_price_formatted = "$0";
          }else{
            const toast = await this.toastCtrl.create({
              message: 'Inconveniente al registrar el pago',
              duration: 2000
            });
            toast.present();
          }
          // data['result'];
        }
      })
  
    }else{
      const toast = await this.toastCtrl.create({
        message: 'El monto a registrar debe ser mayor a $0',
        duration: 2000
      });
      toast.present();
    }
    
  }

}
