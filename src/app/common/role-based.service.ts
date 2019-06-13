import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { RestAPIService } from '../shared-services/restAPI.service';
import { PathConstants } from '../constants/path.constants';
import { AuthService } from '../shared-services/auth.service';


@Injectable({
    providedIn: 'root'
})

export class RoleBasedService {
     instance?: any;

    constructor(private restApiService: RestAPIService, private authService: AuthService) { }

    getInstance() {
        let roleId = JSON.parse(this.authService.getUserAccessible().roleId);
        let gCode = this.authService.getUserAccessible().gCode;
        let rCode = this.authService.getUserAccessible().rCode;
        let godownList;
        if (this.instance === undefined) {
            this.instance = [];
            this.restApiService.get(PathConstants.GODOWN_MASTER).subscribe((res: any) => {
                res.forEach(x => {
                    if (roleId === 1) {
                        godownList = x.list;
                    } else if (roleId === 2) {
                        if (x.Code === rCode) {
                            godownList = x.list;
                        }
                    } else {
                        if (x.Code === rCode) {
                            godownList = x.list;
                        }
                    }
                    godownList.forEach(value => {
                        this.instance.push({ 'GName': value.Name, 'GCode': value.GCode });
                    });
                });
            });
        }
        return this.instance;


    }

}