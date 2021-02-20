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

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
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

  constructor(private formBuilder: FormBuilder, private router: Router, private authservice: AuthenticateService, private storage: Storage) {
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

}