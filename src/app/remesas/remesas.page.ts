import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { PostService } from '../services/post.service';
import { ToastController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';


// export interface Data {
//   iddetallepago: number;
//   idpago: number;
//   cliente: string;
//   monto: number;
// } 
 
 interface Orden{
  id_orden : number;
  nombre_orden: string;
}

interface Banco{
  id_banco : number;
  nombre_banco: string;
}

@Component({
  selector: 'app-remesas',
  templateUrl: './remesas.page.html',
  styleUrls: ['./remesas.page.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class RemesasPage implements OnInit {

  // rows = [
  //   {
  //     "name": "Ethel Price",
  //     "gender": "female"
  //   }
  // ];

  // public data: Data;
  public columns: any;
  public rows: any;

  // idordenInput: string;
  // idOrden : string;
  // idorden = 0;
  ordenes = [];
  ishidden = true;

  orden_remesa: [];
  select_orden: Orden[] = [];
  selectedValues:string[] =[];
  idOrden : string;
  pagoOrden : string;

  banco: [];
  select_banco: Banco[] = [];
  selectedBanco: string;


  constructor(public toastCtrl: ToastController, private postPvdr: PostService, private storage: Storage) { 
    this.columns = [
      { name: 'Orden', prop: 'Orden' },
      { name: 'Cliente', prop: 'Cliente' },
      { name: 'Monto', prop: 'Monto' }
    ];
  }

  ngOnInit() {
    this.doRefresh();
    this.doRefreshBanco();
  }

  doRefresh(){
    let body = {
      aksi: 'doRefreshOrdenRemesa'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
      console.log(data);
      if(data['success']){
        this.orden_remesa = data['result'];
        if (this.orden_remesa.length > 0) {
          for (let index = 0; index < this.orden_remesa.length; index++) {
            
            this.select_orden[index] = <Orden>{id_orden: this.orden_remesa[index]['idorden'], nombre_orden: this.orden_remesa[index]['identifier_order']};
          }
        }else{
          
          this.select_orden[0] = <Orden>{id_orden: 0, nombre_orden: 'No hay datos'};
        }
        console.log(this.select_orden);
      }
    })

  }

  doRefreshBanco(){
    let body = {
      aksi: 'doRefreshBanco'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
      console.log(data);
      if(data['success']){
        this.banco = data['result'];
        if (this.banco.length > 0) {
          for (let index = 0; index < this.banco.length; index++) {
            
            this.select_banco[index] = <Banco>{id_banco: this.banco[index]['idbanco'], nombre_banco: this.banco[index]['banco']};
          }
        }else{
          
          this.select_banco[0] = <Banco>{id_banco: 0, nombre_banco: 'No hay datos'};
        }
        console.log(this.select_banco);
      }
    })
  }



  doFilterPago (){
  //   // if (this.idOrden != "") {

    console.log(this.selectedValues);
      

      let body = {
        idOrden: this.selectedValues.toString(),
        aksi: 'doFilterPago'
      }

      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
  // //     //   // console.log(data['result'].minLength);
  // //     //   console.log(data);
        if(data['success']){
          console.log('success');
          // console.log(data['result']);
          this.ordenes = data['result'];
          this.rows = this.ordenes;
          console.log(this.rows);
          // console.log(this.rows );
        //   if (this.ordenes.length > 0) {
        //     console.log(this.ordenes[0]['identifier_order']);

        //   }
        }
        // else{
        //   console.log(data['result']);
        // }
      })
    // }
  }

}
