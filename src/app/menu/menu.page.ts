import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
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
      url: '/menu/home',
      icon: 'cube'
    },
    {
      tittle: 'Pagos',
      url: '/menu/pagos',
      icon: 'add'
    },
    {
      tittle: 'Remesas',
      url: '/menu/remesas',
      icon: 'archive'
    }
  ];

  public pagesAdmin = [
    {
      tittle: 'Home',
      url: '/menu/home',
      icon: 'cube'
    },
    {
      tittle: 'Pagos',
      url: '/menu/pagos',
      icon: 'add'
    },
    {
      tittle: 'Remesas',
      url: '/menu/remesas',
      icon: 'archive'
    },
    {
      tittle: 'Mantenimiento',
      // url: '/menu/mantenimiento',
      subPages: [
        { 
          tittle: 'Usuarios', 
          url: '/menu/usuarios',
          icon: 'person-add'
        },
        { 
          tittle: 'Empresas', 
          url: '/menu/empresas',
          icon: 'podium'
        },
        { 
          tittle: 'Tipos de pago', 
          url: '/menu/tipo-pago',
          icon: 'shuffle'
        },
        { 
          tittle: 'Ordenes', 
          url: '/menu/ordenes',
          icon: 'pricetag'
        },
        { 
          tittle: 'Bancos', 
          url: '/menu/bancos',
          icon: 'pricetag'
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

  showSubmenu: boolean = false;
  textSelected = "Mantenimiento";

  constructor(private router: Router, private storage: Storage, public toastCtrl: ToastController) {
    this.router.events.subscribe((event: RouterEvent) =>{
      this.selectedPath = event.url;
      
    });
    console.log(this.selectedPath);
  }

  ionViewWillEnter(){

    this.storage.get('session_storage').then((res)=>{
      console.log(res);
      this.anggota = res;
      this.username = this.anggota.username;
      this.idusuario = this.anggota.user_id;
      this.idrol = this.anggota.idrol;
      this.idempresa = this.anggota.idempresa;

      console.log(this.idrol);
      if (this.idrol==1) {
        this.isAdmin = true;
      }else{
        this.isAdmin = false;
      }
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

  menuItemHandler(): void {
    this.showSubmenu = !this.showSubmenu;
  }

}
