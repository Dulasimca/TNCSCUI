import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, retry, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class RestAPIService {
   //  BASEURL = 'http://180.179.49.72:8084';
   BASEURL = 'http://localhost:55922';
  public HttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': 'http://180.179.49.72:8084',
    })
  };
  querParams = new HttpParams();
  constructor(private httpClient: HttpClient) { }

  private fetchData(response: Response) {
    let data = response;
    return data || {};
  }

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
    let errorMessage = 'err occurred';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
      console.log(errorMessage);
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      console.log(errorMessage);
    }
    return throwError(errorMessage);
  }

}
