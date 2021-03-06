import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
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

  username: string;
  password: string;

  empresa = [];
  select_emp: Empresa[] = [];
  idempresa = 0;

  loginForm: FormGroup;
  validation_messages = {
    email: [
      { type: "required", message: " El email es requerido" },
      { type: "pattern", message: "ojo! este no es un email válido" }
    ],
    password: [
      { type: "required", message: " El password es requerido" },
      { type: "minlength", message: "Minimo 5 letras para el password" }
    ]
  };

  errorMessage: string = "";
  app_settigs = [];
  app_url:string;
  app_id = 0;

  constructor(private formBuilder: FormBuilder, private router: Router, private authservice: AuthenticateService, private storage: Storage, public toastCtrl: ToastController, private postPvdr: PostService, private env: EnvService) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(5)])
      )
    });
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
    if(this.username != "" && this.username != ""){
      if (this.idempresa > 0) {
        let body = {
          username: this.username,
          password: this.password,
          idempresa: this.idempresa,
          aksi: 'login'
        };
  
        this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
          console.log(data);
          var alertpesan = data['msg'];
          // console.log(data['result']);
          if(data['success']){
            console.log('True');
            this.storage.set("isUserLoggedIn", true);
            this.storage.set("LogoUrl", this.app_url);
            this.storage.set('session_storage', data['result']);
            this.router.navigate(['/menu/home']);
            const toast = await this.toastCtrl.create({
              message: 'Inicio de sesion exitoso',
              duration: 2000
            });
            toast.present();
            this.username = "";
            this.password = "";
            console.log(data);
          }else{
            console.log('False');
            const toast = await this.toastCtrl.create({
              message: alertpesan,
              duration: 2000
            });
            toast.present();
          }
        });
      }else{
        const toast = await this.toastCtrl.create({
          message: 'Debe seleccionar una empresa para continuar.',
          duration: 2000
        });
        toast.present();
      }
    }else{
      const toast = await this.toastCtrl.create({
        message: 'Nombre de usuario o contraseña no válidos.',
        duration: 2000
	    });
	    toast.present();
    }
  }

  doRefresh(){
    let body = {
      aksi: 'doRefreshEmpresa'
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

  empresaChange($event){
    console.log($event.target.value);
    this.idempresa = $event.target.value;
  }

  getLogoApp(){
    let body = {
      aksi: 'logoApp'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
      console.log(data);
      if(data['success']){
        this.app_settigs = data['result'];
        if (this.app_settigs.length > 0) {
          this.app_id = this.app_settigs[0]['idapp'];
          this.app_url = this.env.API_URL+this.app_settigs[0]['url'];
        }else{
          this.app_id = 0;
          this.app_url = this.env.API_URL+'IMG/logoApp.png';
        }
        console.log(this.app_settigs);
      }
    })
  }

}