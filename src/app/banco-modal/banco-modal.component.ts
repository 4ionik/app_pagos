import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, ToastController } from '@ionic/angular';
import { EnvService } from '../services/env.service';
import { PostService } from '../services/post.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-banco-modal',
  templateUrl: './banco-modal.component.html',
  styleUrls: ['./banco-modal.component.scss'],
})
export class BancoModalComponent implements OnInit {

  isUpdate: any;
  empresa: string;
  idEmpresa:number;
  idbanco:number;
  banco:string;
  idcuenta:number;
  cuenta:string;
  

  constructor(private navParams: NavParams, private modalCtrl: ModalController, private postPvdr: PostService, private storage: Storage,
    private env: EnvService, public toastCtrl: ToastController) { 

      this.isUpdate = this.navParams.get('isUpdate');

      // console.log(this.navParams.get('idempresa'));
      if (!this.isUpdate) {
        this.idEmpresa = this.navParams.get('idempresa');
      }else{
        this.idEmpresa = this.navParams.get('idempresa');
        this.idbanco = this.navParams.get('idbanco');
        this.banco = this.navParams.get('nombre_banco');
        this.idcuenta = this.navParams.get('idcuenta');
        this.cuenta = this.navParams.get('cuenta');

  
        // console.log(this.items.password);
      }


    }

  ngOnInit() {}

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  async submitForm(action:string) {
    
    if (action == 'add') {


      console.log('add');
      if (this.banco == '') {
        const toast = await this.toastCtrl.create({
          message: 'Debe ingresar un banco para continuar.',
          duration: 2000
        });
        toast.present();

        return false;
      }

      if (this.cuenta == '') {
        const toast = await this.toastCtrl.create({
          message: 'Debe ingresar una cuenta para continuar.',
          duration: 2000
        });
        toast.present();

        return false;
      }
      
      
      let body = {
        idEmpresa: this.idEmpresa,
        banco: this.banco,
        cuenta: this.cuenta,
        aksi: 'addBancos'
      }
  
      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        //  console.log(data);
      if(data['success']){
        // console.log(data['result']);
        const toast = await this.toastCtrl.create({
          message: 'Banco agregado con exito',
          duration: 2000
        });
        toast.present();

        this.empresa = "";

      }else{
        const toast = await this.toastCtrl.create({
          message: data['msg'],
          duration: 2000
        });
        toast.present();
      }
    })

    }else{


      console.log('Aqui');
      let body = {
        idEmpresa: this.idEmpresa,
        idbanco: this.idbanco,
        banco: this.banco,
        idcuenta: this.idcuenta,
        cuenta: this.cuenta,
        aksi: 'updateBancos'
      }
      
      console.log(this.idcuenta);

      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        //  console.log(data);
      if(data['success']){
        // console.log(data['result']);
        const toast = await this.toastCtrl.create({
          message: 'Banco actualizado correctamente',
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
