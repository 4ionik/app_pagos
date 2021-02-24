import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { PostService } from '../services/post.service';
import { ToastController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/Storage';

export interface Data {
  iddetallepago: number;
  idpago: number;
  cliente: string;
  monto: number;
}

@Component({
  selector: 'app-remesas',
  templateUrl: './remesas.page.html',
  styleUrls: ['./remesas.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RemesasPage implements OnInit {

  public data: Data;
  public columns: any;
  public rows: any;

  idordenInput: string;
  idorden = 0;
  ordenes = [];
  ishidden = true;

  constructor(public toastCtrl: ToastController, private postPvdr: PostService, private storage: Storage) { 
    this.columns = [
      { name: 'Id' },
      { name: 'Cliente' },
      { name: 'Monto' }
    ];
  }

  ngOnInit() {
  }

  doFilterOrden (){
    if (this.idordenInput != "") {
      let body = {
        idOrden: this.idordenInput,
        aksi: 'doFilterOrden'
      }

      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        // console.log(data['result'].minLength);
        console.log(data);
        if(data['success']){
          this.ordenes = data['result'];
          if (this.ordenes.length > 0) {
            console.log(this.ordenes[0]['client'])
            // this.idorden = this.ordenes[0]['idorden'];
            // this.identifier_order = this.ordenes[0]['identifier_order'];
            // this.client = this.ordenes[0]['client'];
            // this.ishidden = false;
          }else{
            const toast = await this.toastCtrl.create({
              message: 'No se encuentra ninguna orden llamada ' + this.idordenInput,
              duration: 2000
            });
            toast.present();
            this.ishidden = true;
          }
        }
      })
    }
  }

}
