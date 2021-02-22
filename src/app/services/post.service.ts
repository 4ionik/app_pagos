import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from './env.service';
import { map, catchError } from 'rxjs/operators';

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
}
