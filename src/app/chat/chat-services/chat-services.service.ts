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

  botMessageRequest(m: any): Observable<any> {
    const data = JSON.stringify({
      sender: 'User',
      message: m,
    });

    return this.httpClient.post<any>(this.url, data, httpOptions).pipe(
      map((res) => {
        console.log('service', res);
        return JSON.stringify(res);
      })
    );
  }
}
