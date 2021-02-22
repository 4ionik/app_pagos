import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  API_URL = 'http://34.195.109.155/app_pagos/server_api/';

  constructor() { }
}
