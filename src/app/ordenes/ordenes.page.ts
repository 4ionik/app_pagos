import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EnvService } from '../services/env.service';
import { PostService } from '../services/post.service';
import { ToastController, Platform, ModalController} from '@ionic/angular';

import { CSVRecord } from '../modelos/csvrecord';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.page.html',
  styleUrls: ['./ordenes.page.scss'],
})
export class OrdenesPage implements OnInit {

  title = 'Angular7AppReadCSV';  
  
  public records: any[] = [];  
  @ViewChild('csvReader') csvReader: any;

  idusuario: string;
  anggota: any;
  username:string;
  idrol = 0;
  idempresa = 0;
  filename = "";

  constructor(public toastCtrl: ToastController, private postPvdr: PostService, private storage: Storage,
    private env: EnvService, private modalController: ModalController) { }

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

  uploadListener($event: any): void {  
  
    let text = [];  
    let files = $event.srcElement.files;  
  
    if (this.isValidCSVFile(files[0])) {  
  
      this.filename = files[0].name;
      let input = $event.target;  
      let reader = new FileReader();  
      reader.readAsText(input.files[0]);  
  
      reader.onload = () => {  
        let csvData = reader.result;  
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray);  
  
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);  
      };  
  
      reader.onerror = function () {  
        console.log('error is occured while reading file!');  
      };  
  
    } else {  
      alert("Please import valid .csv file.");  
      this.fileReset();  
    }  
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
    let csvArr = [];  
  
    for (let i = 1; i < csvRecordsArray.length; i++) {  
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
      if (curruntRecord.length == headerLength) {  
        let csvRecord: CSVRecord = new CSVRecord();  
        csvRecord.order = curruntRecord[0].trim();  
        csvRecord.latitud = curruntRecord[1].trim();  
        csvRecord.longitud = curruntRecord[2].trim();  
        csvRecord.from = curruntRecord[3].trim().replace(".", "-").replace(".", "-");  
        csvRecord.to = curruntRecord[4].trim().replace(".", "-").replace(".", "-");  
        csvRecord.cost = curruntRecord[5].trim();
        csvRecord.wight = curruntRecord[6].trim();
        csvRecord.volume = curruntRecord[7].trim();
        csvRecord.type = curruntRecord[8].trim();
        csvRecord.client = curruntRecord[9].trim();
        csvRecord.email = curruntRecord[10].trim();
        csvRecord.tag = curruntRecord[11].trim();  
        csvArr.push(csvRecord);  
      }  
    }  
    return csvArr;  
  }

  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }  
  
  getHeaderArray(csvRecordsArr: any) {  
    let headers = (<string>csvRecordsArr[0]).split(',');  
    let headerArray = [];  
    for (let j = 0; j < headers.length; j++) {  
      headerArray.push(headers[j]);  
    }  
    return headerArray;  
  }  
  
  fileReset() {  
    this.csvReader.nativeElement.value = "";  
    this.records = [];  
  }

  async saveOrdenes(){

    if (this.records.length == 0) {
      const toast = await this.toastCtrl.create({
        message: 'Debe debes agregar un csv para continuar.',
        duration: 2000
      });
      toast.present();

      return false;
    }

    let body = {
      filename: this.filename,
      arrayCSV: JSON.stringify(this.records),
      idempresa: this.idempresa,
      aksi: 'addOrdenes'
    }

    console.log(body);

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
      //  console.log(data);
      if(data['success']){
        // console.log(data['result']);
        const toast = await this.toastCtrl.create({
          message: 'Ordenes agregadas con exito',
          duration: 2000
        });
        toast.present();

        this.fileReset();

      }else{
        const toast = await this.toastCtrl.create({
          message: data['msg'],
          duration: 2000
        });
        toast.present();
      }
    })
  }

}
