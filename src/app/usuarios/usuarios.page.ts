import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EnvService } from '../services/env.service';
import { PostService } from '../services/post.service';
import { ToastController, Platform, ModalController,AlertController} from '@ionic/angular';
import { UserModalComponent } from '../user-modal/user-modal.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

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
      aksi: 'getUsuarios'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        //  console.log(data);
      if(data['success']){
        // console.log(data['result']);
        this.usuarios = data['result'];
        console.log(this.usuarios.length);
        if (this.usuarios.length > 0) {
          this.rows = this.usuarios;
          console.log(this.rows);

        }else{
          const toast = await this.toastCtrl.create({
            message: 'No existen usuarios a mostrar',
            duration: 2000
          });
          toast.present();
        }
      }else{
        const toast = await this.toastCtrl.create({
          message: 'Problemas al cargar el listado de usuarios',
          duration: 2000
        });
        toast.present();
      }
    })
  }

  async presentModal(action, item) {

    if (action == 'add') {
      const modal = await this.modalController.create({
        component: UserModalComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          isUpdate: false,
          idempresaLogin: this.idempresa
        }
      });
  
      modal.onDidDismiss().then(data => {
        console.log('dismissed', data);
        this.doFilterPago();
      });
  
      return await modal.present();
    }else{
      const modal = await this.modalController.create({
        component: UserModalComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          isUpdate: true,
          idempresaLogin: this.idempresa,
          item: item
        }
      });
  
      modal.onDidDismiss().then(data => {
        console.log('dismissed', data);
        this.doFilterPago();
      });
  
      return await modal.present();
    }
  }

  async delete(item){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      message: '<strong>¿Esta seguro de eliminar el usuario ' + item.nombre_usuario + ' ?',
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
              idusuario: item.user_id,
              idempresa: item.idempresa,
              aksi: 'deleteUsuarios'
            }
          
            this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
              //  console.log(data);
              if(data['success']){
                // console.log(data['result']);
                const toast = await this.toastCtrl.create({
                  message: 'Usuario Eliminado con exito',
                  duration: 2000
                });
                toast.present();
          
                this.doFilterPago();
              }else{
                const toast = await this.toastCtrl.create({
                  message: 'Problemas al eliminar el usuario',
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
