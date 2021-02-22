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

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {

  username: string;
  password: string;

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

  constructor(private formBuilder: FormBuilder, private router: Router, private authservice: AuthenticateService, private storage: Storage, public toastCtrl: ToastController, private postPvdr: PostService) {
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

  ngOnInit() {}

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
      let body = {
        username: this.username,
        password: this.password,
        aksi: 'login'
      };

      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        console.log(data);
        var alertpesan = data['msg'];
        // console.log(data['result']);
        if(data['success']){
          console.log('True');
          this.storage.set("isUserLoggedIn", true);
          this.storage.set('session_storage', data['result']);
          this.router.navigate(['/menu/home']);
          const toast = await this.toastCtrl.create({
            message: 'Login Succesfully.',
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
        message: 'Username or Password Invalid.',
        duration: 2000
	    });
	  toast.present();
    }
  }

}