import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import { CurrencyPipe } from '@angular/common';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit{

  @ViewChild("barCanvas", { static: false }) barCanvas: ElementRef;
  @ViewChild("doughnutCanvas", { static: false }) doughnutCanvas: ElementRef;
  @ViewChild("lineCanvas", { static: false }) lineCanvas: ElementRef;

  barChart: Chart;
  doughnutChart: Chart;
  lineChart: Chart;

  idusuario: string;
  anggota: any;
  username:string;
  idrol = 0;
  idempresa = 0;
  app_url:string;

  box_price = 0;
  box_price_formatted= "$0";
  today = "";

  remesado = 0;
  premesar = 0;

  colectadoData = [];
  colectadoMes = [];

  num_emp = 0;
  today_emp = "";

  constructor(private storage: Storage, private currencyPipe: CurrencyPipe, private postPvdr: PostService) {
  }

  async ionViewWillEnter(){
    this.app_url = await this.storage.get("LogoUrl");
    this.storage.get('session_storage').then((res)=>{
      this.anggota = res;
      this.username = this.anggota.username;
      this.idusuario = this.anggota.user_id;
      this.idrol = this.anggota.idrol;
      this.idempresa = this.anggota.idempresa;
      if (this.idrol == 1) {
        this.getSAdminEmp();
      }else{
        this.getRecolectado();
        this.getRecolectadovsPen();
        this.getRecolectadoMes();
        // this.doughnutChartMethod();
        // this.lineChartMethod();
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.idrol == 1) {

      }else{
        this.doughnutChartMethod();
        this.lineChartMethod();
      }
    }, 3000);
  }

  getCurrency(amount: number) {
    return this.currencyPipe.transform(amount, 'USD', true, '1.2-2');
  }

  onChangePrice(value) {
    this.box_price = value.replace(/[^0-9.]/g, "");
    if (this.box_price) {
        this.box_price_formatted = this.getCurrency(this.box_price)
     
    }
  }

  getSAdminEmp(){
    let body = {
      idusuario: this.idusuario,
      idempresa: this.idempresa,
      idrol: this.idrol,
      aksi: 'getGlobalEmp'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
      if(data['success']){
        this.num_emp = data['result']['cantidad'];
        this.today_emp = data['result']['created'];
      }else{
        this.num_emp = data['result']['cantidad'];
        this.today_emp = data['result']['created'];
      }
    })
  }


  getRecolectado(){
    let body = {
      idusuario: this.idusuario,
      idempresa: this.idempresa,
      idrol: this.idrol,
      aksi: 'getRecolectado'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
      if(data['success']){
        this.onChangePrice(data['result']['monto_pago']);
        this.today = data['result']['created'];
      }else{
        this.onChangePrice(data['result']['monto_pago']);
        this.today = data['result']['created'];
      }
    })
  }

  getRecolectadovsPen(){
    let body = {
      idusuario: this.idusuario,
      idempresa: this.idempresa,
      idrol: this.idrol,
      aksi: 'getRemesadovsPen'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
      if(data['success']){
        
        this.remesado = data['result']['num_remesa'];
        this.premesar = data['result']['num_pen_remesa'];
        
      }else{
        this.remesado = data['result']['num_remesa']; 
        this.premesar = data['result']['num_pen_remesa'];
      }
    })
  }

  getRecolectadoMes(){
    let body = {
      idusuario: this.idusuario,
      idempresa: this.idempresa,
      idrol: this.idrol,
      aksi: 'getRecolectadoMes'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
      if(data['success']){
        // this.colectadoData = data['result']['monto_pago'];
        // this.colectadoMes = data['result']['created'];
        
        for (let index = 0; index < data['result'].length; index++) {
          this.colectadoData.push(data['result'][index]['monto_pago']);
          this.colectadoMes.push(data['result'][index]['created']);
        }

      }else{
        for (let index = 0; index < data['result'].length; index++) {
          this.colectadoData.push(data['result'][index]['monto_pago']);
          this.colectadoMes.push(data['result'][index]['created']);
        }
      }
    })
  }

  doughnutChartMethod() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Remesado', 'Pendiente remesar'],
        datasets: [{
          label: 'Estadisticas',
          data: [this.remesado, this.premesar],
          backgroundColor: [
            '#00796B',
            '#536DFE'
          ],
          hoverBackgroundColor: [
            '#00796B',
            '#536DFE'
          ]
        }]
      }
    });
  }

  lineChartMethod() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.colectadoMes,
        datasets: [
          {
            label: 'Colectado por dia',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.colectadoData,
            spanGaps: false,
            
          }
        ]
      }
    });
  }

}
