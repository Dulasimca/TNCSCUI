import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { TreeNode } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { LoginService } from 'src/app/login/login.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AuthService } from 'src/app/shared-services/auth.service';

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
  filterArray: any;

  constructor(private restApiService: RestAPIService, private authService: AuthService, private loginService: LoginService,
    private http: HttpClient, private tableConstants: TableConstants, private excelService: ExcelService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.column = this.tableConstants.GodownMasterData;
    this.restApiService.get(PathConstants.GODOWN_MASTER).subscribe((response: any[]) => {
      let treeData = [];
      let childNode: TreeNode;
      let regionData = [];
      response.forEach(x => {
        let list = x.list;
        for (let i = 0; i < list.length; i++) {
          childNode = {
            'data': {
              'serialNo': i + 1 + ")",
              'Name': list[i].Name,
              'Code': list[i].Code,
              'Capacity': list[i].Capacity,
              'Carpet': list[i].Carpet
            }
          }
          regionData.push(childNode);
        }
        var index = response.findIndex(index => index.Name === x.Name);
        treeData.push(Object.assign({},
          {
            "data": {
              "serialNo": index + 1,
              "Name": x.Name,
              "Code": x.Code,
              "Capacity": x.Capacity,
              "Carpet": x.Carpet
            },
            "children": regionData
          },
        ));
        regionData = [];
      });
      this.data = treeData;
      this.filterArray = treeData;

      this.items = [
        {
          label: 'Excel', icon: 'fa fa-table', command: () => {
            this.exportAsXLSX();
          }
        },
        {
          label: 'PDF', icon: "fa fa-file-pdf-o", command: () => {
            this.exportAsPDF();
          }
        }]
    });
  }
  onSearch(value) {
    this.data = this.filterArray;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.data = this.data.filter(item => {
        return item.data.Name.toString().startsWith(value);
      });
    }
  }
  exportAsXLSX(): void {
    let tempArray = [];
    this.data.forEach(x => {
      tempArray.push(x.data);
      let childNode = x.children;
      childNode.forEach(y => {
        tempArray.push(y.data);
      })
    })
    this.excelService.exportAsExcelFile(tempArray, 'GODOWN_DATA', this.column);
  }
  exportAsPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
    var col = this.column;
    var rows = [];
    this.data.forEach(element => {
      var temp = [element.data.serialNo, element.data.Name, element.data.Code, element.data.Capacity, element.data.Carpet];
      rows.push(temp);
      let childNode = element.children;
      childNode.forEach(element => {
        var temp = [element.data.serialNo, element.data.Name, element.data.Code, element.data.Capacity, element.data.Carpet];
        rows.push(temp);
      })
    });
    doc.autoTable(col, rows);
    doc.save('GODOWN_DATA.pdf');
  }
  print() {
    window.print();
  }

  onRowSelect(index) {
    console.log('orking', index);
  }

  public getColor(name: string, index): string {
    let color;
    this.data.forEach(x => {
      if (x.serialNo - 1 === index) {
        color = "#53aae4";
      } else {
        color = "white"
      }
    })
    return color;
  }
}
