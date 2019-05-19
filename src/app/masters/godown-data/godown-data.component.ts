import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { TreeNode } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { LoginService } from 'src/app/login/login.service';


@Component({
  selector: 'app-godown-data',
  templateUrl: './godown-data.component.html',
  styleUrls: ['./godown-data.component.css']
})
export class GodownDataComponent implements OnInit {
  data?: any = [];
  column: any;
  items: any;
  canShowMenu: boolean;

  constructor(private restApiService: RestAPIService, private loginService: LoginService,
    private http: HttpClient, private tableConstants: TableConstants, private excelService: ExcelService) { }

  ngOnInit() {
    this.canShowMenu = (this.loginService.canShow() !== undefined) ? this.loginService.canShow() : false;
    this.column = this.tableConstants.GodownMasterData;
    this.restApiService.get(PathConstants.GODOWN_MASTER).subscribe((response: any[]) => {
      let treeData = [];
      let childNode: TreeNode;
      let regionData = [];
      response.forEach(x => {
        let list = x.list;
        for (let i = 0; i < list.length; i++) {
          childNode = { 'data': {
            'Name': list[i].Name,
            'Capacity': list[i].Capacity,
            'Carpet': list[i].Carpet
          }}
          regionData.push(childNode);
        }
        treeData.push(Object.assign({},
          {
            "data": {
              "Name": x.Name,
              "Capacity": x.Capacity,
              "Carpet": x.Carpet
            },
            "children": regionData
          },
        ));
        regionData = [];
      });
      this.data = treeData;
      
      this.items = [
        {
          label: 'Excel', icon: 'fa fa-table', command: () => {
            this.exportAsXLSX();
        }},
        {
          label: 'PDF', icon: "fa fa-file-pdf-o" , command: () => {
           this.exportAsPDF();
          }
        
             
        }]
    });
  }
  exportAsXLSX():void{
    this.excelService.exportAsExcelFile(this.data,'CRS DATA');
  }
  exportAsPDF(){

  }
}
