import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, ToastController } from '@ionic/angular';
import { EnvService } from '../services/env.service';
import { PostService } from '../services/post.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-viaticos-modal',
  templateUrl: './viaticos-modal.component.html',
  styleUrls: ['./viaticos-modal.component.scss'],
})
export class ViaticosModalComponent implements OnInit {

  isUpdate: any;
  idempresaLogin: 0;

  nombre: string;
  monto = 0;
  estatus = 1;
  id: number;

  public items: any;

  constructor(private navParams: NavParams, private modalCtrl: ModalController, private postPvdr: PostService, private storage: Storage,
    private env: EnvService, public toastCtrl: ToastController) { 
      console.log(this.navParams.get('isUpdate'));
      this.isUpdate = this.navParams.get('isUpdate');
      if (!this.isUpdate) {
        this.idempresaLogin = this.navParams.get('idempresaLogin');
      }else{
        this.idempresaLogin = this.navParams.get('idempresaLogin');
        this.items = this.navParams.get('item');
        console.log(this.items.user_id);
        this.id = this.items.idviatico;
        this.nombre = this.items.viatico;
        this.monto = this.items.monto;
      }
    }

  ngOnInit() {}

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  async submitForm(action:string) {
    
    if (action == 'add') {

      if (this.nombre == '') {
        const toast = await this.toastCtrl.create({
          message: 'Debe ingresar un nombre de viatico para continuar.',
          duration: 2000
        });
        toast.present();

        return false;
      }

      if (this.monto == 0) {
        const toast = await this.toastCtrl.create({
          message: 'Debe ingresar un monto para continuar.',
          duration: 2000
        });
        toast.present();

        return false;
      }
      
      let body = {
        viatico: this.nombre,
        monto: this.monto,
        idempresa: this.idempresaLogin,
        aksi: 'addViaticos'
      }
  
      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        //  console.log(data);
      if(data['success']){
        // console.log(data['result']);
        const toast = await this.toastCtrl.create({
          message: 'Viatico agregado con exito',
          duration: 2000
        });
        toast.present();

        this.nombre = "";
        this.monto = 0;

      }else{
        const toast = await this.toastCtrl.create({
          message: data['msg'],
          duration: 2000
        });
        toast.present();
      }
    })

    }else{

      let body = {
        idviatico: this.id,
        viatico: this.nombre,
        monto: this.monto,
        estatus: this.estatus,
        aksi: 'updateViaticos'
      }
  
      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        //  console.log(data);
      if(data['success']){
        // console.log(data['result']);
        const toast = await this.toastCtrl.create({
          message: 'Viatico actualizado correctamente',
          duration: 2000
        });
        toast.present();

        this.cerrarModal();
      }else{
        const toast = await this.toastCtrl.create({
          message: data['result'],
          duration: 2000
        });
        toast.present();
      }
    })

    }

  }

}
