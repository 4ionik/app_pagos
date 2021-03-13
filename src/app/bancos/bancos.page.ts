import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EnvService } from '../services/env.service';
import { PostService } from '../services/post.service';
import { ToastController, Platform, ModalController} from '@ionic/angular';
import { BancoModalComponent } from '../banco-modal/banco-modal.component';


@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.page.html',
  styleUrls: ['./bancos.page.scss'],
})
export class BancosPage implements OnInit {

  bancos = [];
  idusuario: string;
  anggota: any;
  username:string;
  idrol = 0;
  idempresa = 0;
  idbanco = 0;
  idcuenta = 0;

  public rows: any;



  constructor(public toastCtrl: ToastController, private postPvdr: PostService, private storage: Storage,
    private env: EnvService, private modalController: ModalController) { }

    ionViewWillEnter(){
      this.storage.get('session_storage').then((res)=>{
        this.anggota = res;
        this.username = this.anggota.username;
        this.idusuario = this.anggota.user_id;
        this.idrol = this.anggota.idrol;
        this.idempresa = this.anggota.idempresa;
  
        this.getBancos();
      });
      
    }


  ngOnInit() {
  }

  async getBancos (){

    let body = {
      idrol: this.idrol,
      aksi: 'getBancos'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        //  console.log(data);
      if(data['success']){
        // console.log(data['result']);
        this.bancos = data['result'];
        console.log(this.bancos.length);
        if (this.bancos.length > 0) {
          this.rows = this.bancos;
          console.log(this.rows);

        }else{
          const toast = await this.toastCtrl.create({
            message: 'No existen bancos a mostrar',
            duration: 2000
          });
          toast.present();
        }
      }else{
        const toast = await this.toastCtrl.create({
          message: 'Problemas al cargar el listado de bancos',
          duration: 2000
        });
        toast.present();
      }
    })
  }

  async presentModal(action, item) {

    if (action == 'add') {
      const modal = await this.modalController.create({
        component: BancoModalComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          isUpdate: false,
          idempresa: this.idempresa
        }
      });
  
      modal.onDidDismiss().then(data => {
        console.log('dismissed', data);
        this.getBancos();
      });
  
      return await modal.present();
    }else{
      const modal = await this.modalController.create({
        component: BancoModalComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          isUpdate: true,
          idempresa: this.idempresa,
          idbanco: item.idbanco,
          nombre_banco: item.nombre_banco, 
          idcuenta: item.idcuenta,
          cuenta: item.cuenta,
          item: item
        }
      });
  
      modal.onDidDismiss().then(data => {
        console.log('dismissed', data);
        this.getBancos();
      });
  
      return await modal.present();
    }
  }


  delete(item){
    let body = {
      idempresa: this.idempresa,
      idbanco: item.idbanco,
      idcuenta: item.idcuenta,
      aksi: 'deleteBancos'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
      //  console.log(data);
    if(data['success']){
      // console.log(data['result']);
      const toast = await this.toastCtrl.create({
        message: 'Banco Eliminado con exito',
        duration: 2000
      });
      toast.present();

      this.getBancos();
    }else{
      const toast = await this.toastCtrl.create({
        message: 'Problemas al eliminar el banco',
        duration: 2000
      });
      toast.present();
    }
  })

  }

}
