import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { ToastController, Platform } from '@ionic/angular';

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

  tipo_pago = [];
  select_pago: Tipo[] = [];

  constructor(public toastCtrl: ToastController, private postPvdr: PostService, private platform: Platform) { 
  }

  ngOnInit() {
    this.doRefresh();
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
            this.ishidden = false;
          }else{
            const toast = await this.toastCtrl.create({
              message: 'No se encuentra ninguna orden llamada ' + this.idOrden,
              duration: 2000
            });
            toast.present();
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

}
