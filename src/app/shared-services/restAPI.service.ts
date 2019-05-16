import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, retry, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class RestAPIService {
  BASEURL = 'http://180.179.49.72:8084';
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
    return this.httpClient.post(this.BASEURL + url, obj, this.HttpOptions);
  }

  getByParameters(url, params): Observable<any> {
   // this.querParams.getAll(params);
   return this.httpClient.get(this.BASEURL + url, { params: params });
   // return this.httpClient.get(this.BASEURL + url);
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

}