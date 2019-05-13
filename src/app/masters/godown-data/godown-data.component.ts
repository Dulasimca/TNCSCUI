import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { TreeNode } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';


@Component({
  selector: 'app-godown-data',
  templateUrl: './godown-data.component.html',
  styleUrls: ['./godown-data.component.css']
})
export class GodownDataComponent implements OnInit {
  tableData?: any;
  data?: any = [];
  children?: TreeNode[];
  column: any;

  constructor(private restApiService: RestAPIService, private http: HttpClient, private tableConstants: TableConstants) { }

  ngOnInit() {
    this.column = this.tableConstants.GodownMasterData;
    this.restApiService.get(PathConstants.GODOWN_MASTER).subscribe((response: any[]) => {
      response.forEach(x => {
        this.data.push(Object.assign({},
          {
            "data": {
              "RGNAME": x.RGNAME,
              "TNCSCapacity": x.TNCSCapacity,
              "TNCSCarpet": x.TNCSCarpet
            },
            "children": [
              {
                "data": {
                  "RGNAME": x.TNCSName,
                  "TNCSCapacity": x.TNCSRegn,
                  "TNCSCarpet": x.TNCSCode
                }
              },
              {
                "data": {
                  "RGNAME": x.TNCSName,
                  "TNCSCapacity": x.TNCSRegn,
                  "TNCSCarpet": x.TNCSCode
                }
              }]
          },
        ));
      });
    });
  }

}
