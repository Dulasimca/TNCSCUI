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
    scheme_data?: any;
    loggedInRegion: any;
    roleId: any;
    gCode: any;
    rCode: any;
    rgData: any;
    constructor(private restApiService: RestAPIService, private authService: AuthService) { }

    getInstance() {
        this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
        this.gCode = this.authService.getUserAccessible().gCode;
        this.rCode = this.authService.getUserAccessible().rCode;
        let godownList;
        if (this.instance === undefined) {
            this.instance = [];
            this.rgData = [];
            this.restApiService.get(PathConstants.GODOWN_MASTER).subscribe((res: any) => {
                    res.forEach(x => {
                        if (this.roleId === 1) {
                            godownList = x.list;
                        } else if (this.roleId === 2) {
                            if (x.Code === this.rCode) {
                                godownList = x.list;
                            }
                        } else {
                            if (x.Code === this.rCode) {
                                godownList = x.list;
                            }
                        }
                        godownList.forEach(value => {
                            this.instance.push({ 'GName': value.Name, 'GCode': value.GCode });
                        });
                    });
                if (this.roleId === 3) {
                    res.filter(value => {
                        if (value.Code === this.rCode) {
                            this.rgData.push({ 'RName': value.Name, 'RCode': value.Code });
                        }
                    });
                    godownList.filter(value => {
                        if (value.GCode === this.gCode) {
                            this.rgData.push({ 'GName': value.Name, 'GCode': value.GCode });
                        }
                    });
                }
                let godownData = this.instance;
                let rgData = this.rgData;
                return { godownData, rgData };
            });
        }
     
    }

    getSchemeData() {
        if (this.scheme_data === undefined) {
            this.scheme_data = [];
            this.restApiService.get(PathConstants.SCHEMES).subscribe((res: any) => {
                if (res !== undefined) {
                    res.forEach(value => {
                        this.scheme_data.push({ 'SName': value.Name, 'SCode': value.SCCode });
                    })
                }
            });
        }
        return this.scheme_data;
    }

}