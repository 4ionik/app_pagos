import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, ToastController } from '@ionic/angular';
import { EnvService } from '../services/env.service';
import { PostService } from '../services/post.service';
import { Storage } from '@ionic/storage';

interface Banco {
  idbanco: number;
  banco: string;
}

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

  action:string;

  select_banco: Banco[] = [];
  selectedBanco = 0;
  

  constructor(private navParams: NavParams, private modalCtrl: ModalController, private postPvdr: PostService, private storage: Storage,
    private env: EnvService, public toastCtrl: ToastController) { 

      this.isUpdate = this.navParams.get('isUpdate');
      this.action = this.navParams.get('action');

      if (this.action == 'add') {
        this.idEmpresa = this.navParams.get('idempresa');
      }

      if (this.action == 'update') {
        this.idEmpresa = this.navParams.get('idempresa');
        this.idbanco = this.navParams.get('idbanco');
        this.banco = this.navParams.get('nombre_banco');
        this.idcuenta = this.navParams.get('idcuenta');
        this.cuenta = this.navParams.get('cuenta');  
      }

      if (this.action == 'add-cuenta') {
        this.idEmpresa = this.navParams.get('idempresa');
        this.doRefresh();
      }

      if (this.action == 'update-banco') {
        this.idEmpresa = this.navParams.get('idempresa');
        this.idbanco = this.navParams.get('idbanco');
        this.banco = this.navParams.get('nombre_banco');
        this.idcuenta = this.navParams.get('idcuenta');
        this.cuenta = this.navParams.get('cuenta');  
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
          this.clearInput();
          this.empresa = "";

        }else{
          const toast = await this.toastCtrl.create({
            message: data['msg'],
            duration: 2000
          });
          toast.present();
        }
      })
    }

  if (action == 'update') {


      let body = {
        idEmpresa: this.idEmpresa,
        idbanco: this.idbanco,
        banco: this.banco,
        idcuenta: this.idcuenta,
        cuenta: this.cuenta,
        aksi: 'updateCuentas'
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
          this.clearInput();
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

    if (action == 'update-banco') {


      let body = {
        idEmpresa: this.idEmpresa,
        idbanco: this.idbanco,
        banco: this.banco,
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
          this.clearInput();
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

    if (action == 'add-cuenta') {


      if (this.selectedBanco == 0) {
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
        idbanco: this.selectedBanco,
        cuenta: this.cuenta,
        aksi: 'addCuenta'
      }
  
      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        //  console.log(data);
      if(data['success']){
        // console.log(data['result']);
        const toast = await this.toastCtrl.create({
          message: 'Cuenta agregada con exito',
          duration: 2000
        });
        toast.present();

        this.clearInput();
        this.cerrarModal();

      }else{
        const toast = await this.toastCtrl.create({
          message: data['msg'],
          duration: 2000
        });
        toast.present();
      }
    })
  }
      
  }

  doRefresh(){
    let body = {
      idempresa: this.idEmpresa,
      aksi: 'doFilterBancos'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
      console.log(data);
      if(data['success']){
        this.empresa = data['result'];
        if (this.empresa.length > 0) {
          for (let index = 0; index < this.empresa.length; index++) {
            
            this.select_banco[index] = <Banco>{idbanco: this.empresa[index]['idbanco'], banco: this.empresa[index]['nombre_banco']};
          }
        }else{
          
          this.select_banco[0] = <Banco>{idbanco: 0, banco: 'No hay datos'};
        }
      }
    })
  }

  clearInput(){
    this.idbanco = 0;
    this.banco = "";
    this.cuenta = "";
    this.select_banco = [];
    this.selectedBanco = 0;
  }

}
