import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from './env.service';
import { map } from 'rxjs/operators';

export interface ApiImage {
	_id: string;
	name: string;
	// createdAt: Date;
	url: string;
  }

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient, private env: EnvService) { }

  	postData(body, file){
		let type = "application/json; charset=UTF-8";
		let headers = new HttpHeaders({ 'Content-Type': type });
		let options =  {headers: headers };

		return this.http.post(this.env.API_URL + file, JSON.stringify(body), options)
    		.pipe(map((res: Response) => res ))
			// .subscribe(data => console.log(data));
				// .pipe(data => data);
	}

	getImages() {
		return this.http.get<ApiImage[]>(`${this.env.API_URL}proses-api.php`);
	}

	uploadImage(blobData, name, ext) {
		let type = "application/json; charset=UTF-8";
		let headers = new HttpHeaders({ 'Content-Type': type });
		let options =  {headers: headers };

		const formData = new FormData();
		formData.append('archivo', blobData, `myimage.${ext}`);
		formData.append('name', name);
		formData.append('aksi', 'uploadImage');
		
		return this.http.post(`${this.env.API_URL}proses-api.php`, formData).pipe(map((res: Response) => res ));
	}

	uploadImageFile(file: File) {
		const ext = file.name.split('.').pop();
		const formData = new FormData();
		formData.append('file', file, `myimage.${ext}`);
		formData.append('name', file.name);
	 
		return this.http.post(`${this.env.API_URL}IMG`, formData);
	}

	deleteImage(id) {
		let type = "application/json; charset=UTF-8";
		let headers = new HttpHeaders({ 'Content-Type': type });
		let options =  {headers: headers };

		let body = {
			id: id,
			aksi: 'doFilterPago'
		}

		return this.http.post(`${this.env.API_URL}proses-api.php`, JSON.stringify(body), options);
	}
}
