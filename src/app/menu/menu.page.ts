import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { Storage } from "@ionic/storage";
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  pages = [
    {
      tittle: 'Home',
      url: 'home'
    },
    {
      tittle: 'Pagos',
      url: 'pagos'
    },
    {
      tittle: 'Remesas',
      url: 'remesas'
    }
  ]

  selectedPath = '';

  constructor(private router: Router, private storage: Storage, public toastCtrl: ToastController) {
    this.router.events.subscribe((event: RouterEvent) =>{
      this.selectedPath = event.url;
    });
  }

  ngOnInit() {
  }

  async prosesLogout(){
    this.storage.clear();
    this.router.navigate(['/login']);
    const toast = await this.toastCtrl.create({
        message: 'logout succesful',
        duration: 3000
      });
    toast.present();
  }

}
