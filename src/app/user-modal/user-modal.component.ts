import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, ToastController } from '@ionic/angular';
import { EnvService } from '../services/env.service';
import { PostService } from '../services/post.service';
import { Storage } from '@ionic/storage';

interface Empresa {
  idempresa: number;
  nombre_empresa: string;
}

interface Rol {
  idrol: number;
  nombre_rol: string;
}

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
})
export class UserModalComponent implements OnInit {

  isUpdate: any;
  idempresaLogin: 0;

  empresa = [];
  select_emp: Empresa[] = [];
  idempresa = 0;

  roles = [];
  select_rol: Rol[] = [];
  idrol = 0;

  username: string;
  name: string;
  password: string;
  id: number;
  estatus = 1;

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
      this.id = this.items.user_id;
      this.username = this.items.username;
      this.name = this.items.nombre_usuario;
      this.password = this.items.password;
      this.idempresa = this.items.idempresa;
      this.idrol = this.items.idrol;

      console.log(this.items.password);
    }
    
    
  }

  ngOnInit() {
    console.log('aqui');
    this.doRefreshEmp();
    this.doRefreshRol();

  }

  compareWithFn(o1, o2) {
    return o1 === o2;
  };

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  async submitForm(action:string) {
    
    if (action == 'add') {

      if (this.username == '') {
        const toast = await this.toastCtrl.create({
          message: 'Debe ingresar un username para continuar.',
          duration: 2000
        });
        toast.present();

        return false;
      }

      if (this.idempresa == 0) {
        const toast = await this.toastCtrl.create({
          message: 'Debe ingresar una empresa para continuar.',
          duration: 2000
        });
        toast.present();

        return false;
      }

      if (this.idrol == 0) {
        const toast = await this.toastCtrl.create({
          message: 'Debe ingresar un rol para continuar.',
          duration: 2000
        });
        toast.present();

        return false;
      }
      
      let body = {
        username: this.username,
        name: this.name,
        password: this.password,
        idempresa: this.idempresa,
        idrol: this.idrol,
        aksi: 'addUsuarios'
      }
  
      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        //  console.log(data);
      if(data['success']){
        // console.log(data['result']);
        const toast = await this.toastCtrl.create({
          message: 'Usuario agregado con exito',
          duration: 2000
        });
        toast.present();

        this.username = "";
        this.name = "";
        this.password = "";

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
        user_id: this.id,
        username: this.username,
        name: this.name,
        password: this.password,
        idempresa: this.idempresa,
        idrol: this.idrol,
        estatus: this.estatus,
        aksi: 'updateUsuarios'
      }
  
      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        //  console.log(data);
      if(data['success']){
        // console.log(data['result']);
        const toast = await this.toastCtrl.create({
          message: 'Usuario actualizado correctamente',
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

  doRefreshRol(){
    let body = {
      aksi: 'getRoles'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
      console.log(data);
      if(data['success']){
        this.roles = data['result'];
        if (this.roles.length > 0) {
          for (let index = 0; index < this.roles.length; index++) {
            
            this.select_rol[index] = <Rol>{idrol: this.roles[index]['idrol'], nombre_rol: this.roles[index]['nombre_rol']};
          }
        }else{
          
          this.select_rol[0] = <Rol>{idrol: 0, nombre_rol: 'No hay datos'};
        }
        console.log(this.select_rol);
      }
    })
  }

  doRefreshEmp(){
    let body = {
      idempresa: this.idempresaLogin,
      aksi: 'getEmpresa'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
      console.log(data);
      if(data['success']){
        this.empresa = data['result'];
        if (this.empresa.length > 0) {
          for (let index = 0; index < this.empresa.length; index++) {
            
            this.select_emp[index] = <Empresa>{idempresa: this.empresa[index]['idempresa'], nombre_empresa: this.empresa[index]['nombre_empresa']};
          }
        }else{
          
          this.select_emp[0] = <Empresa>{idempresa: 0, nombre_empresa: 'No hay datos'};
        }
        console.log(this.select_emp);
      }
    })
  }

}
