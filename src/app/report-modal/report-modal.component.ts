import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, ToastController } from '@ionic/angular';
import { EnvService } from '../services/env.service';
import { PostService } from '../services/post.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.scss'],
})
export class ReportModalComponent implements OnInit {

  constructor(private navParams: NavParams, private modalCtrl: ModalController, private postPvdr: PostService, private storage: Storage,
    private env: EnvService, public toastCtrl: ToastController) { }

  ngOnInit() {}

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

}
