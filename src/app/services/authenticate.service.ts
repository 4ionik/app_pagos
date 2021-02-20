import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class AuthenticateService {
  constructor() {}
  loginUser(credential) {
    return new Promise((accept, reject) => {

      //PARA HACER INVOCACION A UN BACKEND SE USA return fetch(URL_SUPER_SERVER)
      if (
        credential.email == "test@test.com" &&
        credential.password == "12345"
      ) {
        accept("Login correcto");
      } else {
        reject("login incorrecto");
      }
    });
  }
}