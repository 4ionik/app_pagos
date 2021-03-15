import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EnvService } from '../services/env.service';
import { PostService } from '../services/post.service';
import { ToastController, Platform, ModalController, AlertController} from '@ionic/angular';
import { EmpresaModalComponent } from '../empresa-modal/empresa-modal.component';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.page.html',
  styleUrls: ['./empresas.page.scss'],
})
export class EmpresasPage implements OnInit {

  empresas: [];
  idusuario: string;
  anggota: any;
  username:string;
  idrol = 0;
  idempresa = 0;

  public rows: any;

  constructor(public toastCtrl: ToastController, private postPvdr: PostService, private storage: Storage,
    private env: EnvService, private modalController: ModalController, public alertCtrl: AlertController) { }


    ionViewWillEnter(){
      this.storage.get('session_storage').then((res)=>{
        this.anggota = res;
        this.username = this.anggota.username;
        this.idusuario = this.anggota.user_id;
        this.idrol = this.anggota.idrol;
        this.idempresa = this.anggota.idempresa;
  
        this.getEmpresas();
      });
      
    }

  ngOnInit() {
  }


  async getEmpresas (){

    let body = {
      idrol: this.idrol,
      aksi: 'getEmpresas'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        //  console.log(data);
      if(data['success']){
        // console.log(data['result']);
        this.empresas = data['result'];
        console.log(this.empresas.length);
        if (this.empresas.length > 0) {
          this.rows = this.empresas;
          console.log(this.rows);

        }else{
          const toast = await this.toastCtrl.create({
            message: 'No existen empresas a mostrar',
            duration: 2000
          });
          toast.present();
        }
      }else{
        const toast = await this.toastCtrl.create({
          message: 'Problemas al cargar el listado de empresas',
          duration: 2000
        });
        toast.present();
      }
    })
  }

  async presentModal(action, item) {

    if (action == 'add') {
      const modal = await this.modalController.create({
        component: EmpresaModalComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          isUpdate: false,
          idempresa: this.idempresa
        }
      });
  
      modal.onDidDismiss().then(data => {
        console.log('dismissed', data);
        this.getEmpresas();
      });
  
      return await modal.present();
    }else{
      const modal = await this.modalController.create({
        component: EmpresaModalComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          isUpdate: true,
          idempresa: item.idempresa,
          nombre_empresa: item.nombre_empresa,
          item: item
        }
      });
  
      modal.onDidDismiss().then(data => {
        console.log('dismissed', data);
        this.getEmpresas();
      });
  
      return await modal.present();
    }
  }

  async delete(item){

 
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        message: '<strong>¿Esta seguro de eliminar la empresa ' + item.nombre_empresa + ' ?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Confirmar',
            handler: () => {
                 let body = {
                  idempresa: item.idempresa,
                  aksi: 'deleteEmpresa'
                }


                this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
                  //  console.log(data);
                if(data['success']){
                  // console.log(data['result']);
                  const toast = await this.toastCtrl.create({
                    message: 'Empresa Eliminada con exito',
                    duration: 2000
                  });
                  toast.present();

                  this.getEmpresas();
                }else{
                  const toast = await this.toastCtrl.create({
                    message: 'Problemas al eliminar la empresa',
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
