import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { PostService, ApiImage } from '../services/post.service';
import { ToastController, Platform, ActionSheetController} from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { EnvService } from '../services/env.service';
import { Plugins, CameraResultType, CameraSource, Capacitor, CameraPhoto } from '@capacitor/core';
const { Camera } = Plugins;
 
 interface Orden{
  id_orden : number;
  nombre_orden: string;
}

interface Viaticos{
  id_viatico : number;
  nombre_viatico: string;
  montoV: number;
}

interface Banco{
  id_banco : number;
  nombre_banco: string;
}

@Component({
  selector: 'app-remesas',
  templateUrl: './remesas.page.html',
  styleUrls: ['./remesas.page.scss'],
})
export class RemesasPage implements OnInit {
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  isDesktop: boolean;

  // public data: Data;
  public columns: any;
  public rows: any;

  // idordenInput: string;
  // idOrden : string;
  // idorden = 0;
  ordenes = [];
  ishidden = true;
  ishidden_1 = true;
  ishidden_2 = true;

  orden_remesa: [];
  select_orden: Orden[] = [];
  selectedValues = "0";
  idOrden : string;
  pagoOrden : string;

  banco: [];
  select_banco: Banco[] = [];
  selectedBanco = "0";
  guestPicture: any;

  viaticos: [];
  select_viat: Viaticos[] = [];
  selectedViaticos:string[] = [];

  props: any = {};
  state: any = {};
  photo: any;
  blobData: Blob;
  image: CameraPhoto;
  imageName: string;
  isTakePhoto = false;

  URL_base: string;
  box_price = 0;
  box_price_formatted= "$0";

  box_price_a = 0;
  box_price_formatted_a= "$0";

  box_price_b = 0;
  box_price_formatted_b= "$0";

  box_price_c = 0;
  box_price_formatted_c= "$0";

  idusuario: string;
  anggota: any;
  username:string;
  idrol = 0;
  idempresa = 0;
  remesaTotal: string;
  total_colectado: number;
  viaticosTotal: number;
  viaticosString:string;

  id_voucher: string;

  images: ApiImage[] = [];
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;


  constructor(public toastCtrl: ToastController, private postPvdr: PostService, private storage: Storage, private platform: Platform,
    private sanitizer: DomSanitizer, private actionSheetCtrl: ActionSheetController, private env: EnvService, private currencyPipe: CurrencyPipe) { 
    
    this.URL_base = this.env.API_URL;
    this.doRefresh();
    this.doRefreshBanco();
    this.doRefreshViaticos();

    this.columns = [
      { name: 'Orden', prop: 'Orden' },
      { name: 'Cliente', prop: 'Cliente' },
      { name: 'Monto', prop: 'Monto' }
    ];

  }

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
    if ((this.platform.is('mobile') && this.platform.is('hybrid')) || this.platform.is('desktop')) {
      this.isDesktop = true;
    }
  }

  doRefresh(){
    let body = {
      aksi: 'doRefreshTipoTrans'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
      console.log(data);
      if(data['success']){
        this.orden_remesa = data['result'];
        if (this.orden_remesa.length > 0) {
          for (let index = 0; index < this.orden_remesa.length; index++) {
            
            this.select_orden[index] = <Orden>{id_orden: this.orden_remesa[index]['idtipo_trans'], nombre_orden: this.orden_remesa[index]['nombre_transaccion']};
          }
        }else{
          
          this.select_orden[0] = <Orden>{id_orden: 0, nombre_orden: 'No hay datos'};
        }
        console.log(this.select_orden);
      }
    })

  }

  doRefreshViaticos(){
    let body = {
      aksi: 'doFilterViatico'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
      console.log(data);
      if(data['success']){
        this.viaticos = data['result'];
        if (this.viaticos.length > 0) {
          for (let index = 0; index < this.viaticos.length; index++) {
            
            this.select_viat[index] = <Viaticos>{id_viatico: this.viaticos[index]['idviatico'], nombre_viatico: this.viaticos[index]['viatico'], montoV: this.viaticos[index]['monto']};
          }
        }else{
          
          this.select_viat[0] = <Viaticos>{id_viatico: 0, nombre_viatico: 'No hay datos', montoV: 0};
        }
        console.log(this.select_viat);
      }
    })

  }

  doRefreshBanco(){
    let body = {
      aksi: 'doRefreshBanco'
    }

    this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
      console.log(data);
      if(data['success']){
        this.banco = data['result'];
        if (this.banco.length > 0) {
          for (let index = 0; index < this.banco.length; index++) {
            
            this.select_banco[index] = <Banco>{id_banco: this.banco[index]['idbanco'], nombre_banco: this.banco[index]['banco']};
          }
        }else{
          
          this.select_banco[0] = <Banco>{id_banco: 0, nombre_banco: 'No hay datos'};
        }
        console.log(this.select_banco);
      }
    })
  }



  async doFilterPago (){


    if (this.selectedValues == '0') {
      this.ishidden = true;
      this.ishidden_1 = true;
      this.ishidden_2 = true;
    }

    if (this.selectedValues == '5') {
      let body = {
        idOrden: this.selectedValues,
        idusuario: this.idusuario,
        idempresa: this.idempresa,
        aksi: 'doFilterPago'
      }

      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
          //  console.log(data);
        if(data['success']){
          console.log('success');
          // console.log(data['result']);
          this.ordenes = data['result'];
          // console.log(this.rows );
          if (this.ordenes.length > 0) {
            this.rows = this.ordenes;
            this.calculateTota(this.rows);
            console.log(this.rows);
            this.ishidden = false;
            this.ishidden_1 = true;
            this.ishidden_2 = true;
          }else{
            const toast = await this.toastCtrl.create({
              message: 'No existen pagos a remesar',
              duration: 2000
            });
            toast.present();
          }
        }else{
          this.ishidden = true;
        }
      })
    }

    if (this.selectedValues == '6') {

      let body = {
        idOrden: this.selectedValues,
        idusuario: this.idusuario,
        idempresa: this.idempresa,
        aksi: 'doFilterPago'
      }

      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
          //  console.log(data);
        if(data['success']){
          console.log('success');
          // console.log(data['result']);
          this.ordenes = data['result'];
          // console.log(this.rows );
          if (this.ordenes.length > 0) {
            this.rows = this.ordenes;
            this.calculateTota(this.rows);
            console.log(this.rows);
            this.ishidden = true;
            this.ishidden_1 = false;
            this.ishidden_2 = true;
          }else{
            const toast = await this.toastCtrl.create({
              message: 'No existen pagos a finiquitar',
              duration: 2000
            });
            toast.present();
          }
        }else{
          this.ishidden = true;
        }
      })
    }

    if (this.selectedValues == '7') {
      console.log(this.selectedValues);
      let body = {
        idusuario: this.idusuario,
        idempresa: this.idempresa,
        aksi: 'doFilterPago'
      }

      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        //  console.log(data);
      if(data['success']){
          console.log('success');
          // console.log(data['result']);
          this.ordenes = data['result'];
          // console.log(this.rows );
          if (this.ordenes.length > 0) {
            this.rows = this.ordenes;
            this.calculateTota(this.rows);
            console.log(this.rows);
            console.log("Aqui estoy")
            // this.ishidden = false;
            // this.ishidden_1 = true;
            this.ishidden = true;
            this.ishidden_1 = true;
            this.ishidden_2 = false;
          }else{
            const toast = await this.toastCtrl.create({
              message: 'No existen pagos a remesar',
              duration: 2000
            });
            toast.present();
          }
        }else{
          this.ishidden = true;
        }
      })
    }

  }

  async selectImageSource() {
    const buttons = [
      {
        text: 'Tomar Foto',
        icon: 'camera',
        handler: () => {
          this.addImage(CameraSource.Camera);
        }
      },
      {
        text: 'Seleccionar de la galeria',
        icon: 'image',
        handler: () => {
          this.addImage(CameraSource.Photos);
        }
      }
    ];
 
    // Only allow file selection inside a browser
    if (!this.platform.is('hybrid')) {
      buttons.push({
        text: 'Elige un archivo',
        icon: 'attach',
        handler: () => {
          this.fileInput.nativeElement.click();
        }
      });
    }
 
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Seleccione una opcion',
      buttons
    });
    await actionSheet.present();
  }

  async addImage(source: CameraSource) {

    if (this.id_voucher == "") {
      const toast = await this.toastCtrl.create({
        message: 'Debes ingresar antes un voucher para continuar',
        duration: 2000
      });
      toast.present();
      return false;
    }

    this.image = await Camera.getPhoto({
      quality: 60,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source
    });
 
    this.blobData = this.b64toBlob(this.image.base64String, `image/${this.image.format}`);
    const imageName = 'image'+this.id_voucher;

    this.postPvdr.uploadImage(this.blobData, imageName, this.image.format).subscribe(async data =>{
      if(data['success']){
        console.log('success');
        console.log(data['result']);
        this.images = data['result'];

        this.isTakePhoto = true;

      }else{
        const toast = await this.toastCtrl.create({
          message: 'Problemas al subir la imagen ',
          duration: 2000
        });
        toast.present();

        this.isTakePhoto = false;
      }
      // this.images.push(newImage);
    });

    

  }

  // Used for browser direct file upload
  uploadFile(event: EventTarget) {
    const eventObj: MSInputMethodContext = event as MSInputMethodContext;
    const target: HTMLInputElement = eventObj.target as HTMLInputElement;
    const file: File = target.files[0];
    this.postPvdr.uploadImageFile(file).subscribe((newImage: ApiImage) => {
      this.images.push(newImage);
    });
  }
 
  deleteImage(image: ApiImage, index) {
    console.log(image);
    // this.images.splice(index, 1);
    this.postPvdr.deleteImage(image._id).subscribe(res => {
      this.images.splice(index, 1);
      this.isTakePhoto = false;
    });
  }

  getCurrency(amount: number) {
    return this.currencyPipe.transform(amount, 'USD', true, '1.2-2');
  }

  onChangePrice($event) {
    this.box_price = $event.target.value.replace(/[^0-9.]/g, "");
    if (this.box_price) {
        this.box_price_formatted = this.getCurrency(this.box_price)
        console.log("box_price_formatted: " + this.box_price_formatted);
    }
  }
  onPriceUp($event){
      this.box_price = $event.target.value.replace(/[^0-9.]/g, "");
      this.box_price_formatted = String(this.box_price);
  }

  onChangePrice_a($event) {
    this.box_price_a = $event.target.value.replace(/[^0-9.]/g, "");
    if (this.box_price_a) {
        this.box_price_formatted_a = this.getCurrency(this.box_price_a)
        console.log("box_price_formatted: " + this.box_price_formatted_a);
    }
  }
  onPriceUp_a($event){
      this.box_price_a = $event.target.value.replace(/[^0-9.]/g, "");
      this.box_price_formatted_a = String(this.box_price_a);
  }

  async onChangePrice_b($event) {
    this.box_price_b = $event.target.value.replace(/[^0-9.]/g, "");

    console.log(this.box_price_b );
    this.box_price_a = Number(this.box_price_formatted_a.replace(/[^0-9.]/g, ""));

    if (this.box_price_b) {
        this.box_price_formatted_b = this.getCurrency(this.box_price_b)
        console.log("box_price_formatted: " + this.box_price_formatted_b);
        if (this.box_price_b > this.box_price_a) {
          const toast = await this.toastCtrl.create({
            message: 'El monto a remesar debe ser menor al total recolectado ',
            duration: 2000
          });
          toast.present();
        }else{
          this.box_price_formatted_c = this.getCurrency(this.box_price_a - this.box_price_b);
          this.box_price_c =  Number(this.box_price_formatted_c.replace(/[^0-9.]/g, ""));
        }
    }
  }
  onPriceUp_b($event){
      this.box_price_b = $event.target.value.replace(/[^0-9.]/g, "");
      this.box_price_formatted_b = String(this.box_price_b);
  }
  
  async onChangePrice_c($event) {
    this.box_price_c = $event.target.value.replace(/[^0-9.]/g, "");
    this.box_price_a = Number(this.box_price_formatted_a.replace(/[^0-9.]/g, ""));
  
    
    console.log("Change Price c variable efectivo disponible:  " + this.box_price_formatted_b) ;

    if (this.box_price_c) {
        this.box_price_formatted_c = this.getCurrency(this.box_price_c)
        console.log("box_price_formatted: " + this.box_price_c);
        console.log("total recolectado: " + this.box_price_a);
        if (this.box_price_c > this.box_price_a) {
          const toast = await this.toastCtrl.create({
            message: 'El monto a remesar debe ser menor al total recolectado ',
            duration: 2000
          });
          toast.present();
        }else{
          this.box_price_formatted_b = this.getCurrency(this.box_price_a - this.box_price_c);
          this.box_price_b =  Number(this.box_price_formatted_b.replace(/[^0-9.]/g, ""));
        }
    }
  }
  onPriceUp_c($event){
      this.box_price_c = $event.target.value.replace(/[^0-9.]/g, "");
      this.box_price_formatted_c = String(this.box_price_c);
  }

  summaryVaticos(){
    let totalReturn = 0;
    var string_ = [];
    console.log(this.selectedViaticos);
    for (let index = 0; index < this.selectedViaticos.length; index++) {
      // const element = this.selectedViaticos[index]['monto'];
      totalReturn = totalReturn + parseInt(this.selectedViaticos[index]['monto']);
      string_.push(this.selectedViaticos[index]['value']);
      // console.log(this.selectedViaticos[index]['monto']);
    }
    this.viaticosTotal = totalReturn;
    this.viaticosString = string_.join(',');

    console.log(this.viaticosTotal);
  }

  calculateTota(items){
    // this.remesaTotal = 0;
    let totalReturn = 0;
    for(let i = 0; i< items.length; i++){
      totalReturn = totalReturn + parseInt(items[i]['Monto']);    
    }
    this.total_colectado = totalReturn;
    this.remesaTotal = this.getCurrency(totalReturn);
    this.box_price_formatted_a = this.getCurrency(totalReturn)
    return this.remesaTotal;
  }

  async sendRemesa(){

    if (this.selectedValues == '0') {
      const toast = await this.toastCtrl.create({
        message: 'Debes elegir una opción para poder continuar',
        duration: 2000
      });
      toast.present();
      return false;
    }

    if (this.selectedValues == '5') {
      if (this.isTakePhoto) {

        let body = {
          tiptrans: this.selectedValues,
          idbanco: this.selectedBanco,
          idusuario: this.idusuario,
          idviatico: this.viaticosString.toString(),
          image: this.images[0].name,
          montoViatico: this.viaticosTotal,
          viaticosTotal: this.viaticosTotal,
          total_colectado: this.total_colectado,
          id_voucher: this.id_voucher,
          aksi: 'addRemesas'
        }
  
        if (this.id_voucher == "") {
          const toast = await this.toastCtrl.create({
            message: 'Debes ingresar un voucher para poder continuar',
            duration: 2000
          });
          toast.present();
          return false;
        }
  
        if (this.selectedBanco == "0") {
          const toast = await this.toastCtrl.create({
            message: 'Debes elegir una cuenta de banco para poder continuar',
            duration: 2000
          });
          toast.present();
          return false;
        }
  
        if (this.selectedViaticos.length == 0) {
          const toast = await this.toastCtrl.create({
            message: 'Debe elegir una opcion del listado de viaticos',
            duration: 2000
          });
          toast.present();
          return false;
        }
  
        this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
          console.log(data);
          if(data['success']){
            console.log('success');
            console.log(data['result']);
  
            const toast = await this.toastCtrl.create({
              message: 'La remesa ha sido generada exitosamente',
              duration: 2000
            });
            toast.present();
            this.isTakePhoto = false;
            this.clearData();
          }else{
            const toast = await this.toastCtrl.create({
              message: 'Problemas al generar la remesa',
              duration: 2000
            });
            toast.present();
          }
    
        })
  
      }else{
        const toast = await this.toastCtrl.create({
          message: 'Debe agregar una foto para poder remesar ',
          duration: 2000
        });
        toast.present();
      }
    }

    if (this.selectedValues == '6') {

      if (this.box_price_b == 0) {
        const toast = await this.toastCtrl.create({
          message: 'Debe ingresar el efectivo disponible para poder continuar',
          duration: 2000
        });
        toast.present();
        return false;
      }

      if (this.selectedViaticos.length == 0) {
        const toast = await this.toastCtrl.create({
          message: 'Debe elegir una opcion del listado de viaticos',
          duration: 2000
        });
        toast.present();
        return false;
      }
      
      let body = {
        tiptrans: this.selectedValues,
        // idbanco: this.selectedBanco,
        idusuario: this.idusuario,
        idviatico: this.viaticosString.toString(),
        montoViatico: this.viaticosTotal,
        viaticosTotal: this.viaticosTotal,
        total_colectado: this.total_colectado,
        efectivo_disp: this.box_price_b,
        aksi: 'addRemesas'
      }

      console.log(body.viaticosTotal);

      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        console.log(data);
        if(data['success']){
          console.log('success');
          console.log(data['result']);

          const toast = await this.toastCtrl.create({
            message: 'El Finiquito a ha sido generada exitosamente',
            duration: 2000
          });
          toast.present();
          this.isTakePhoto = false;
          this.clearData();
        }else{
          const toast = await this.toastCtrl.create({
            message: 'Problemas al generar el finiquito',
            duration: 2000
          });
          toast.present();
        }
  
      })

    }

    if (this.selectedValues == '7') {

      id_voucher: this.id_voucher;

      

      if (this.isTakePhoto) {

        let body = {
          tiptrans: this.selectedValues,
          idbanco: this.selectedBanco,
          idusuario: this.idusuario,
          idviatico: this.viaticosString.toString(),
          image: this.images[0].name,
          montoViatico: this.viaticosTotal,
          viaticosTotal: this.viaticosTotal,
          efectivo_disp: this.box_price_b,
          total_colectado: this.box_price_c,
          id_voucher: this.id_voucher,
          aksi: 'addRemesas'
        }

          // console.log('tiptrans: ' + this.selectedValues);
          // console.log('idbanco: ' + this.selectedBanco);
          // console.log('idusuario: ' + this.idusuario);
          // console.log('idviatico: ' + this.viaticosString.toString());
          // console.log('image: ' + this.images[0].name);
          // console.log('montoViatico: ' + this.viaticosTotal);
          // console.log('viaticosTotal: ' + this.viaticosTotal);
          // console.log('efectivo_disp: ' + this.box_price_b);
          // console.log(' total_colectado: ' + this.box_price_c);

      if (this.box_price_b == 0) {
        const toast = await this.toastCtrl.create({
          message: 'Debe ingresar el efectivo disponible para poder continuar',
          duration: 2000
        });
        toast.present();
        return false;
      }

      if (this.box_price_c == 0) {
        const toast = await this.toastCtrl.create({
          message: 'Debe ongresar el monto a remesar para poder continuar',
          duration: 2000
        });
        toast.present();
        return false;
      }

      if (this.selectedViaticos.length == 0) {
        const toast = await this.toastCtrl.create({
          message: 'Debe elegir una opcion del listado de viaticos',
          duration: 2000
        });
        toast.present();
        return false;
      }

      this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        console.log(data);
        if(data['success']){
          console.log('success');
          console.log(data['result']);

          const toast = await this.toastCtrl.create({
            message: 'La remesa ha sido generada exitosamente',
            duration: 2000
          });
          toast.present();
          this.isTakePhoto = false;
          this.clearData();
        }else{
          const toast = await this.toastCtrl.create({
            message: 'Problemas al generar la remesa',
            duration: 2000
          });
          toast.present();
        }
  
      })

      }else{
        const toast = await this.toastCtrl.create({
          message: 'Debe agregar una foto para poder remesar ',
          duration: 2000
        });
        toast.present();
      }



    }

    


  }
  
  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
 
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
 
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
 
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
 
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  clearData(){
    this.selectedValues = "0";
    this.selectedBanco = "0";
    this.selectedViaticos = [];
    this.box_price_formatted = this.getCurrency(0);
    this.images.splice(0, 1);
    this.rows = [];
    this.ishidden = true;
  }


}
