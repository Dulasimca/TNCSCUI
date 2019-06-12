import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { RestAPIService } from '../shared-services/restAPI.service';
import { PathConstants } from '../constants/path.constants';


@Injectable({
  providedIn: 'root'
})

export class RoleBasedService {
    static instance?: any;

    constructor(private restApiService: RestAPIService){ }

     getInstance() {
        if (RoleBasedService.instance === undefined) {
            RoleBasedService.instance = [];
        this.restApiService.get(PathConstants.GODOWN_MASTER).subscribe((res: any) => {
            res.forEach(value => {
                RoleBasedService.instance.push({'Name': value.Name, 'Code': value.Code});
            });
       });
       return RoleBasedService.instance;

    } 

    }

}