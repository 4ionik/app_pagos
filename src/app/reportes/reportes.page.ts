import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EnvService } from '../services/env.service';
import { PostService } from '../services/post.service';
import { ToastController, Platform, ModalController} from '@ionic/angular';
import { DataService } from '../services/data.service';
import { Ionic4DatepickerModalComponent } from '@logisticinfotech/ionic4-datepicker';
import * as moment_ from 'moment';
const moment = moment_;

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {

  mydate = '11-12-2018';

  datePickerObj: any = {};

  isDisableDatePicker: false;
  monthsList = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  weeksList = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  selectedDate = "";
  selectedDateHasta = "";

  reportes = [];
  public rows = [];

  idusuario: string;
  anggota: any;
  username:string;
  idrol = 0;
  idempresa = 0;

  typeReport = 0;
  isHidden = true;

  constructor(public toastCtrl: ToastController, private postPvdr: PostService, private storage: Storage,
    private env: EnvService, private modalController: ModalController,private data: DataService) { }

  ionViewWillEnter(){
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

  compare(dateTimeIni, dateTimeEnd) {
    var momentA = moment(dateTimeIni,"YYYY-MM-DD");
    var momentB = moment(dateTimeEnd,"YYYY-MM-DD");
    if (momentA > momentB) return 1;
    else if (momentA < momentB) return -1;
    else return 0;
  }

  async presentModal(typeReport) {
    this.typeReport = typeReport;
    if (this.typeReport == 1) {
      this.clearInfo();

      if (this.selectedDate == '') {
        const toast = await this.toastCtrl.create({
          message: 'Debe seleccionar una fecha de inicio para continuar',
          duration: 2000
        });
        toast.present();
        return false;
      }

      if (this.selectedDateHasta == '') {
        const toast = await this.toastCtrl.create({
          message: 'Debe seleccionar una fecha de fin para continuar',
          duration: 2000
        });
        toast.present();
        return false;
      }

      if (this.compare(this.selectedDate, this.selectedDateHasta) == -1) {
        const toast = await this.toastCtrl.create({
          message: 'La fecha final no puede ser mayor que la inicial',
          duration: 2000
        });
        toast.present();
        return false;
      }

      let body = {
        idempresa: this.idempresa,
        start: this.selectedDate,
        end:  this.selectedDateHasta,
        aksi: 'getReporteOrdenes'
      }
  
      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        //  console.log(data);
        if(data['success']){
          // console.log(data['result']);
          this.reportes = data['result'];
          if (this.reportes.length > 0) {
            this.rows = this.reportes;
            this.isHidden = false;
  
          }else{
            const toast = await this.toastCtrl.create({
              message: 'No existen datos a mostrar',
              duration: 2000
            });
            toast.present();
            this.clearInfo();
          }

        }else{
          const toast = await this.toastCtrl.create({
            message: data['result'],
            duration: 2000
          });
          toast.present();
        }
      })

    }
    
    if (this.typeReport == 2) {
      this.clearInfo();

      if (this.selectedDate == '') {


        const toast = await this.toastCtrl.create({
          message: 'Debe seleccionar una fecha de inicio para continuar',
          duration: 2000
        });
        toast.present();
        return false;
      }

      if (this.selectedDateHasta == '') {
        const toast = await this.toastCtrl.create({
          message: 'Debe seleccionar una fecha de fin para continuar',
          duration: 2000
        });
        toast.present();
        return false;
      }

      if (this.compare(this.selectedDate, this.selectedDateHasta) == -1) {
        const toast = await this.toastCtrl.create({
          message: 'La fecha final no puede ser mayor que la inicial',
          duration: 2000
        });
        toast.present();
        return false;
      }

      let body = {
        idempresa: this.idempresa,
        start: this.selectedDate,
        end:  this.selectedDateHasta,
        aksi: 'getReporteRemesas'
      }
  
      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        //  console.log(data);
        if(data['success']){
          // console.log(data['result']);
          this.reportes = data['result'];
          console.log(this.reportes);
          if (this.reportes.length > 0) {
            this.rows = this.reportes;
            this.isHidden = false;
  
          }else{
            const toast = await this.toastCtrl.create({
              message: 'No existen datos a mostrar',
              duration: 2000
            });
            toast.present();
            this.clearInfo();
          }

        }else{
          const toast = await this.toastCtrl.create({
            message: data['result'],
            duration: 2000
          });
          toast.present();
        }
      })
    }

    if (this.typeReport == 3) {
      this.clearInfo();

      if (this.selectedDate == '') {
        const toast = await this.toastCtrl.create({
          message: 'Debe seleccionar una fecha de inicio para continuar',
          duration: 2000
        });
        toast.present();
        return false;
      }

      if (this.selectedDateHasta == '') {
        const toast = await this.toastCtrl.create({
          message: 'Debe seleccionar una fecha de fin para continuar',
          duration: 2000
        });
        toast.present();
        return false;
      }

      if (this.compare(this.selectedDate, this.selectedDateHasta) == -1) {
        const toast = await this.toastCtrl.create({
          message: 'La fecha final no puede ser mayor que la inicial',
          duration: 2000
        });
        toast.present();
        return false;
      }

      let body = {
        idempresa: this.idempresa,
        start: this.selectedDate,
        end:  this.selectedDateHasta,
        aksi: 'getReporteRemesasPendiente'
      }
  
      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        //  console.log(data);
        if(data['success']){
          // console.log(data['result']);
          this.reportes = data['result'];
          if (this.reportes.length > 0) {
            this.rows = this.reportes;
            this.isHidden = false;
  
          }else{
            const toast = await this.toastCtrl.create({
              message: 'No existen datos a mostrar',
              duration: 2000
            });
            toast.present();
            this.clearInfo();
          }

        }else{
          const toast = await this.toastCtrl.create({
            message: data['result'],
            duration: 2000
          });
          toast.present();
          this.isHidden = false;
        }
      })
    }
  }

  clearInfo(){
    this.reportes = [];
    this.rows = [];
    this.isHidden = true;
  }

  exportToExcel(filename) {
    this.data.exportToExcel(this.reportes, filename);
  }


  async openDatePicker() {
    const datePickerObj = {
      inputdate: moment(new Date('2019-02')),
      closeOnSelect: true,
      titleLabel: 'Calendario',
      closeLabel: 'Cerrar',
      monthsList: [
        'Jan',
        'Feb',
        'March',
        'April',
        'May',
        'June',
        'July',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec'
      ],
      showTodayButton: false,
      weeksList: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      dateFormat: 'YYYY-MM-DD',
      clearButton: true
    };

    const datePickerModal = await this.modalController.create({
      component: Ionic4DatepickerModalComponent,
      cssClass: 'li-ionic4-datePicker',
      componentProps: { objConfig: datePickerObj }
    });
    await datePickerModal.present();

    datePickerModal.onDidDismiss().then(data => {
      // this.isModalOpen = false;
      this.selectedDate = data.data.date;
    });
    
  }

  async openDatePickerHasta() {
    const datePickerObj = {
      inputdate: moment(new Date('2019-02')),
      closeOnSelect: true,
      titleLabel: 'Calendario',
      closeLabel: 'Cerrar',
      monthsList: [
        'Jan',
        'Feb',
        'March',
        'April',
        'May',
        'June',
        'July',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec'
      ],
      showTodayButton: false,
      weeksList: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      dateFormat: 'YYYY-MM-DD',
      clearButton: true
    };

    const datePickerModal = await this.modalController.create({
      component: Ionic4DatepickerModalComponent,
      cssClass: 'li-ionic4-datePicker',
      componentProps: { objConfig: datePickerObj }
    });
    await datePickerModal.present();

    datePickerModal.onDidDismiss().then(data => {
      // this.isModalOpen = false;
      this.selectedDateHasta = data.data.date;
    });
    
  }

}
