import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ChatServicesService {
  constructor(private httpClient: HttpClient) {}

  url: string = 'http://localhost:5005/webhooks/rest/webhook';
  data;
  botMessageRequest(m: any): Observable<any> {
   

    this.data = JSON.stringify({
      sender: 'User',
      message: m,
    });
       
    console.log("Data", this.data);
    return this.httpClient.post<any>(this.url, this.data, httpOptions).pipe(
      map((res) => {
        console.log('service', res);
        return JSON.stringify(res);
      })
    );
  }
}
