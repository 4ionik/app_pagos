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

  public pages = [
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
  ];

  public pagesAdmin = [
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
    },
    {
      tittle: 'Mantenimiento',
      subPages: [
        { 
          tittle: 'Usuarios', 
          url: 'usuarios' 
        },
        { 
          tittle: 'Empresas', 
          url: 'empresas' 
        },
        { 
          tittle: 'Tipos de pago', 
          url: 'tipo-pago' 
        },
        { 
          tittle: 'Ordenes', 
          url: 'ordenes' 
        }
      ]
    }
  ];

  selectedPath = '';

  idusuario: string;
  anggota: any;
  username:string;
  idrol = 0;
  idempresa = 0;
  isAdmin = true;

  constructor(private router: Router, private storage: Storage, public toastCtrl: ToastController) {
    this.router.events.subscribe((event: RouterEvent) =>{
      this.selectedPath = event.url;
    });
  }

  ionViewWillEnter(){
    this.storage.get('session_storage').then((res)=>{
      console.log(res);
      this.anggota = res;
      this.username = this.anggota.username;
      this.idusuario = this.anggota.user_id;
      this.idrol = this.anggota.idrol;
      this.idempresa = this.anggota.idempresa;
    });
    if (this.idrol==1) {
      this.isAdmin = false;
    }else{
      this.isAdmin = true;
    }
    console.log(this.isAdmin);
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
