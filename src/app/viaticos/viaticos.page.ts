import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EnvService } from '../services/env.service';
import { PostService } from '../services/post.service';
import { ToastController, Platform, ModalController,AlertController} from '@ionic/angular';
import { ViaticosModalComponent } from '../viaticos-modal/viaticos-modal.component';

@Component({
  selector: 'app-viaticos',
  templateUrl: './viaticos.page.html',
  styleUrls: ['./viaticos.page.scss'],
})
export class ViaticosPage implements OnInit {

  usuarios = [];
  public rows: any;

  idusuario: string;
  anggota: any;
  username:string;
  idrol = 0;
  idempresa = 0;

  constructor(public toastCtrl: ToastController, private postPvdr: PostService, private storage: Storage,
    private env: EnvService, private modalController: ModalController,public alertCtrl: AlertController) { }

  ionViewWillEnter(){
    this.storage.get('session_storage').then((res)=>{
      this.anggota = res;
      this.username = this.anggota.username;
      this.idusuario = this.anggota.user_id;
      this.idrol = this.anggota.idrol;
      this.idempresa = this.anggota.idempresa;

      this.doFilterPago();
    });
    
  }

  ngOnInit() {
    
  }

  async doFilterPago (){

    let body = {
      idusuario: this.idusuario,
      idempresa: this.idempresa,
      idrol: this.idrol,
      aksi: 'getViaticos'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        
      if(data['success']){
       
        this.usuarios = data['result'];
    
        if (this.usuarios.length > 0) {
          this.rows = this.usuarios;
      

        }else{
          const toast = await this.toastCtrl.create({
            message: 'No existen viaticos a mostrar',
            duration: 2000
          });
          toast.present();

          this.rows = [];
        }
      }else{
        const toast = await this.toastCtrl.create({
          message: 'Problemas al cargar el listado de viaticos',
          duration: 2000
        });
        toast.present();
      }
    })
  }

  async presentModal(action, item) {

    if (action == 'add') {
      const modal = await this.modalController.create({
        component: ViaticosModalComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          isUpdate: false,
          idempresaLogin: this.idempresa
        }
      });
  
      modal.onDidDismiss().then(data => {
    
        this.doFilterPago();
      });
  
      return await modal.present();
    }else{
      const modal = await this.modalController.create({
        component: ViaticosModalComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          isUpdate: true,
          idempresaLogin: this.idempresa,
          item: item
        }
      });
  
      modal.onDidDismiss().then(data => {
    
        this.doFilterPago();
      });
  
      return await modal.present();
    }
  }

  async delete(item){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      message: '¿Esta seguro de eliminar el viatico <strong>' + item.viatico + '</strong> ?',
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
              idviatico: item.idviatico,
              idempresa: this.idempresa,
              idrol: this.idrol,
              aksi: 'deleteViaticos'
            }
          
            this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
              
              if(data['success']){
               
                const toast = await this.toastCtrl.create({
                  message: 'Viatico Eliminado con exito',
                  duration: 2000
                });
                toast.present();
          
                this.doFilterPago();
              }else{
                const toast = await this.toastCtrl.create({
                  message: 'Problemas al eliminar el Viatico',
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
