import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EnvService } from '../services/env.service';
import { PostService } from '../services/post.service';
import { ToastController, Platform, ModalController,AlertController} from '@ionic/angular';
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
    private env: EnvService, private modalController: ModalController,public alertCtrl: AlertController) { }

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
      idempresa: this.idempresa,
      aksi: 'getBancos'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        
      if(data['success']){
       
        this.bancos = data['result'];
    
        if (this.bancos.length > 0) {
          this.rows = this.bancos;
      

        }else{
          const toast = await this.toastCtrl.create({
            message: 'No existen bancos a mostrar',
            duration: 2000
          });
          toast.present();
        }
      }else{
        const toast = await this.toastCtrl.create({
          message: data['result'],
          duration: 2000
        });
        toast.present();
      }
    })
  }

  async actionModal(item){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      message: '¿Que deseas actualizar?',
      buttons: [
        {
          text: 'Cuentas',
          cssClass: 'secondary',
          handler: (blah) => {
            
            this.presentModal('update', item);

          }
        }, {
          text: 'Bancos',
          handler: () => {
            
            this.presentModal('update-banco', item);
  
          }  
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
        
          }
        }
      ]
    });

    await alert.present();
  }

  async presentModal(action, item) {

    if (action == 'add') {
      const modal = await this.modalController.create({
        component: BancoModalComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          action: action,
          isUpdate: false,
          idempresa: this.idempresa
        }
      });
  
      modal.onDidDismiss().then(data => {
    
        this.getBancos();
      });
  
      return await modal.present();
    }
    
    if (action == 'update') {
      const modal = await this.modalController.create({
        component: BancoModalComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          action: action,
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
    
        this.getBancos();
      });
  
      return await modal.present();
    }

    if (action == 'add-cuenta') {

      if (this.bancos.length == 0) {
        const toast = await this.toastCtrl.create({
          message: 'Debes agregar almenos un banco antes de continuar',
          duration: 2000
        });
        toast.present();
        return false;
      }

      const modal = await this.modalController.create({
        component: BancoModalComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          action: action,
          isUpdate: false,
          idempresa: this.idempresa
        }
      });
  
      modal.onDidDismiss().then(data => {
    
        this.getBancos();
      });
  
      return await modal.present();
    }

    if (action == 'update-banco') {
      const modal = await this.modalController.create({
        component: BancoModalComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          action: action,
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
    
        this.getBancos();
      });
  
      return await modal.present();
    }

  }


  async delete(action, item){

    if (action == 'cuenta') {
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        message: '¿Esta seguro de eliminar la cuenta <strong>' + item.cuenta + '</strong> ?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
          
            }
          }, {
            text: 'Confirmar',
            handler: () => {
              let body = {
                idempresa: this.idempresa,
                idbanco: item.idbanco,
                idcuenta: item.idcuenta,
                aksi: 'deleteCuentas'
              }
          
              this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
                
              if(data['success']){
               
                const toast = await this.toastCtrl.create({
                  message: 'Cuenta Eliminada con exito',
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
        ]
      });
  
      await alert.present();
    }

    if (action == 'banco') {
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        message: '¿Esta seguro de eliminar el banco <strong>' + item.nombre_banco + '</strong> ?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
          
            }
          }, {
            text: 'Confirmar',
            handler: () => {
              let body = {
                idempresa: this.idempresa,
                idbanco: item.idbanco,
                idcuenta: item.idcuenta,
                aksi: 'deleteBancos'
              }
          
              this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
                
              if(data['success']){
               
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
        ]
      });
  
      await alert.present();
    }

  }

  async deleteOption(item){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      message: '¿Que deseas eliminar?',
      buttons: [
        
        {
          text: 'Cuentas',
          cssClass: 'secondary',
          handler: (blah) => {
            
            this.delete('cuenta',item);

          }
        }, {
          text: 'Bancos',
          handler: () => {
            
            this.delete('banco',item);
  
          }  
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
        
          }
        }
      ]
    });

    await alert.present();
  }

}
