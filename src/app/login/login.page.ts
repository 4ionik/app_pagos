import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticateService } from "../services/authenticate.service";
import { Storage } from "@ionic/storage";
import { ToastController } from '@ionic/angular';
import { PostService } from '../services/post.service'
import { EnvService } from '../services/env.service';

interface Empresa {
  idempresa: number;
  nombre_empresa: string;
}

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {

  username = "";
  password = "";

  empresa = [];
  select_emp: Empresa[] = [];
  idempresa = 0;

  errorMessage: string = "";
  app_settigs = [];
  app_url:string;
  app_id = 0;

  constructor(private formBuilder: FormBuilder, private router: Router, private authservice: AuthenticateService, private storage: Storage, public toastCtrl: ToastController, private postPvdr: PostService, private env: EnvService) {
  }

  ngOnInit() {
    
    this.getLogoApp();
    this.doRefresh();
  }

  loginUser(credentials) {
    this.authservice.loginUser(credentials).then(res => {
      this.errorMessage = "";
      this.storage.set("isUserLoggedIn", true);
      this.router.navigate(['/menu/home']);
    }).catch(err => {
      this.errorMessage = err;
    });
  }

  async prosesLogin(){

    if(this.username == ""){
      const toast = await this.toastCtrl.create({
        message: 'Debes ingresar un Nombre de usuario.',
        duration: 2000
	    });
	    toast.present();
      return false;
    }

    if(this.password == ""){
      const toast = await this.toastCtrl.create({
        message: 'Debes ingresar una contraseña.',
        duration: 2000
	    });
	    toast.present();
      return false;
    }

    if (this.idempresa == 0) {
      const toast = await this.toastCtrl.create({
        message: 'Debe seleccionar una empresa para continuar.',
        duration: 2000
      });
      toast.present();
      return false;
    }

    let body = {
      username: this.username,
      password: this.password,
      idempresa: this.idempresa,
      aksi: 'login'
    };

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{

      var alertpesan = "";

      let result = await Promise.all(alertpesan);

      alertpesan = data['msg'];
      
      if(data['success']){
        this.storage.set("isUserLoggedIn", true);
        this.storage.set("LogoUrl", this.app_url);
        this.storage.set('session_storage', data['result']);

        this.username = "";
        this.password = "";

        setTimeout(()=>{
          this.router.navigate(['/menu/home']);
        },800)
        
     
      }else{
        const toast = await this.toastCtrl.create({
          message: alertpesan,
          duration: 2000
        });
        toast.present();
      }

    });
  }

  doRefresh(){
    let body = {
      aksi: 'doRefreshEmpresa'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
   
      if(data['success']){
        this.empresa = data['result'];
        if (this.empresa.length > 0) {
          for (let index = 0; index < this.empresa.length; index++) {
            
            this.select_emp[index] = <Empresa>{idempresa: this.empresa[index]['idempresa'], nombre_empresa: this.empresa[index]['nombre_empresa']};
          }
        }else{
          
          this.select_emp[0] = <Empresa>{idempresa: 0, nombre_empresa: 'No hay datos'};
        }
     
      }
    })
  }

  empresaChange($event){
 
    this.idempresa = $event.target.value;
  }

  getLogoApp(){
    let body = {
      aksi: 'logoApp'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
   
      if(data['success']){
        this.app_settigs = data['result'];
        if (this.app_settigs.length > 0) {
          this.app_id = this.app_settigs[0]['idapp'];
          this.app_url = this.env.API_URL+this.app_settigs[0]['url'];
        }else{
          this.app_id = 0;
          this.app_url = this.env.API_URL+'IMG/logo.png';
        }
     
      }
    })
  }

}