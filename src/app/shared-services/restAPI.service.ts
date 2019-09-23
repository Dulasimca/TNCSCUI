import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class RestAPIService {
  // BASEURL = 'http://180.179.49.72:8084';
  BASEURL = 'http://localhost:55922';
  public HttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':'Content-Type',
      'Access-Control-Allow-Methods' : 'Get,Post,Put,Delete,Options',
      'Access-Control-Allow-Credentials' : 'true'
    })
  };
  constructor(private httpClient: HttpClient) { }

  get(url): Observable<any> {
    return this.httpClient.get(this.BASEURL + url);
  }

  post(url, obj): Observable<any> {
    return this.httpClient.post(this.BASEURL + url, obj);
  }

  getByParameters(url, params): Observable<any> {
   return this.httpClient.get(this.BASEURL + url, { params: params });
  }

  put(url, obj): Observable<any> {
   return this.httpClient.put(this.BASEURL + url, obj);
  }
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

}
