import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, ToastController } from '@ionic/angular';
import { EnvService } from '../services/env.service';
import { PostService } from '../services/post.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-empresa-modal',
  templateUrl: './empresa-modal.component.html',
  styleUrls: ['./empresa-modal.component.scss'],
})
export class EmpresaModalComponent implements OnInit {

  isUpdate: any;
  empresa: string;
  idEmpresa:string;

  constructor(private navParams: NavParams, private modalCtrl: ModalController, private postPvdr: PostService, private storage: Storage,
    private env: EnvService, public toastCtrl: ToastController) {

      this.isUpdate = this.navParams.get('isUpdate');

      console.log(this.navParams.get('idempresa'));
      if (!this.isUpdate) {
        this.idEmpresa = this.navParams.get('idempresa');
      }else{
        this.idEmpresa = this.navParams.get('idempresa');
        this.empresa = this.navParams.get('nombre_empresa');

  
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
      if (this.empresa == '') {
        const toast = await this.toastCtrl.create({
          message: 'Debe ingresar una empresa para continuar.',
          duration: 2000
        });
        toast.present();

        return false;
      }
      
      let body = {
        empresa: this.empresa,
        aksi: 'addEmpresas'
      }
  
      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        //  console.log(data);
      if(data['success']){
        // console.log(data['result']);
        const toast = await this.toastCtrl.create({
          message: 'Empresa agregada con exito',
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
        empresa: this.empresa,
        aksi: 'updateEmpresas'
      }
  
      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        //  console.log(data);
      if(data['success']){
        // console.log(data['result']);
        const toast = await this.toastCtrl.create({
          message: 'Empresa actualizado correctamente',
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

