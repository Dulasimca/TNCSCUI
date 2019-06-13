import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { RestAPIService } from '../shared-services/restAPI.service';
import { PathConstants } from '../constants/path.constants';
import { AuthService } from '../shared-services/auth.service';


@Injectable({
    providedIn: 'root'
})

export class RoleBasedService {
    static instance?: any;

    constructor(private restApiService: RestAPIService, private authService: AuthService) { }

    getInstance() {
        let roleId = JSON.parse(this.authService.getUserAccessible().roleId);
        let gCode = JSON.parse(this.authService.getUserAccessible().gCode);
        let rCode = JSON.parse(this.authService.getUserAccessible().rCode);
        let godownList;
        if (RoleBasedService.instance === undefined) {
            RoleBasedService.instance = [];
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
                        RoleBasedService.instance.push({ 'GName': value.Name, 'GCode': value.GCode });
                    });
                });
            });
            return RoleBasedService.instance;
        }

    }

}