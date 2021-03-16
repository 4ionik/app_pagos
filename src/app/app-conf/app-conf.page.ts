import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EnvService } from '../services/env.service';
import { PostService } from '../services/post.service';
import { ToastController, Platform, ModalController} from '@ionic/angular';

@Component({
  selector: 'app-app-conf',
  templateUrl: './app-conf.page.html',
  styleUrls: ['./app-conf.page.scss'],
})
export class AppConfPage implements OnInit {

  idusuario: string;
  anggota: any;
  username:string;
  idrol = 0;
  idempresa = 0;
  filename = "";
  app_url:string;

  constructor(public toastCtrl: ToastController, private postPvdr: PostService, private storage: Storage,
    private env: EnvService, private changeRef: ChangeDetectorRef) { }

  async ionViewWillEnter(){
    this.app_url = await this.storage.get("LogoUrl");
    this.storage.get('session_storage').then((res)=>{
      this.anggota = res;
      this.username = this.anggota.username;
      this.idusuario = this.anggota.user_id;
      this.idrol = this.anggota.idrol;
      this.idempresa = this.anggota.idempresa;
    });
    
  }

  ngOnInit() {
  }

  uploadListener($event: any): void {
    let files = $event.srcElement.files;

    this.filename = files[0].name;

    this.postPvdr.uploadImageApp(files[0], this.filename, 'addImageApp').subscribe(async data =>{
      if(data['success']){
        console.log('success');
        console.log(data['result']);
        
        this.storage.set("LogoUrl", this.env.API_URL+'IMG/'+this.filename);
        this.app_url = this.env.API_URL+'IMG/'+this.filename;
        this.changeRef.detectChanges();

      }else{
        const toast = await this.toastCtrl.create({
          message: data['msg'],
          duration: 2000
        });
        toast.present();

      }
      // this.images.push(newImage);
    });
  }

}
