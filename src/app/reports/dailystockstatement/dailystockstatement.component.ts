import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { TreeNode } from 'primeng/api';
import { HttpParams } from '@angular/common/http';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-dailystockstatement',
  templateUrl: './dailystockstatement.component.html',
  styleUrls: ['./dailystockstatement.component.css']
})
export class DailyStockStatementComponent implements OnInit {
  dailyStockDataColumns: any;
  dailyStockData: any;
  treeData: any[];
  fromDate: Date;
  toDate: Date;
  itemCodes: any = [];
  ITCODE1: any;
  ITCODE2: any;
  canShowMenu: boolean;

  constructor(private tableConstants: TableConstants,private excelService: ExcelService, private restApiService: RestAPIService,
    private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    let tempArray = [];
    this.treeData = [];
    this.dailyStockDataColumns = this.tableConstants.DailyStockStatement;
    this.restApiService.get(PathConstants.DAILY_STOCK_STATEMENT_ITEM_MASTER).subscribe(itemCodes => {
      if (itemCodes !== undefined) {
        for (let c = 0; c < itemCodes.length; c++) {
          this.ITCODE1 = itemCodes[c].ITCode;
          this.ITCODE2 = itemCodes[c + 1].ITCode;
          c = c + 1;
          let params = new HttpParams().set('ITCode1', this.ITCODE1).append('ITCode2', this.ITCODE2);
          this.restApiService.getByParameters(PathConstants.DAILY_STOCK_STATEMENT, params).subscribe((response: any[]) => {
            let childNode: TreeNode;
            let regionChildNode: TreeNode;
            let regionData = [];
            let godownData = [];
            response.forEach(x => {
              let list = x.ListItems;
              for (let i = 0; i < list.length; i++) {
                let godownList = list[i].ListItems;
                for (let i = 0; i < godownList.length; i++) {
                  regionChildNode = {
                    'data': {
                      'Name': godownList[i].Name,
                      'OpeningBalance': godownList[i].OpeningBalance,
                      "ClosingBalance": godownList[i].ClosingBalance,
                      "TotalReceipt": godownList[i].TotalReceipt,
                      "Receipt": parseInt(godownList[i].OpeningBalance, 0) + parseInt(godownList[i].TotalReceipt, 0),
                      "IssueSales": godownList[i].IssueSales,
                      "IssueOthers": godownList[i].IssueOthers,
                      "TotalIssue": parseInt(godownList[i].IssueSales, 0) + parseInt(godownList[i].IssueOthers, 0),
                      "CSBalance": godownList[i].CSBalance,
                      "PhycialBalance": godownList[i].PhycialBalance,
                      "Shortage": godownList[i].Shortage,
                    }
                  }
                  godownData.push(regionChildNode);
                }
                childNode = {
                  'data': {
                    'Name': list[i].Name,
                    'OpeningBalance': list[i].OpeningBalance,
                    "ClosingBalance": list[i].ClosingBalance,
                    "TotalReceipt": list[i].TotalReceipt,
                    "Receipt": parseInt(list[i].OpeningBalance, 0) + parseInt(list[i].TotalReceipt, 0),
                    "IssueSales": list[i].IssueSales,
                    "IssueOthers": list[i].IssueOthers,
                    "TotalIssue": parseInt(list[i].IssueSales, 0) + parseInt(list[i].IssueOthers, 0),
                    "CSBalance": list[i].CSBalance,
                    "PhycialBalance": list[i].PhycialBalance,
                    "Shortage": list[i].Shortage,
                  }, "children": godownData
                }
                regionData.push(childNode);
                godownData = [];
              }
              this.treeData.push(
                {
                  "data": {
                    "Name": x.Name,
                    "OpeningBalance": x.OpeningBalance,
                    "ClosingBalance": x.ClosingBalance,
                    "TotalReceipt": x.TotalReceipt,
                    "Receipt": parseInt(x.OpeningBalance, 0) + parseInt(x.TotalReceipt, 0),
                    "IssueSales": x.IssueSales,
                    "IssueOthers": x.IssueOthers,
                    "TotalIssue": parseInt(x.IssueSales, 0) + parseInt(x.IssueOthers, 0),
                    "CSBalance": x.CSBalance,
                    "PhycialBalance": x.PhycialBalance,
                    "Shortage": x.Shortage,
                  },
                  "children": regionData,
                },
              );
              regionData = [];
            });
            for (let i = 0; i < this.treeData.length; i++) {
              tempArray.push({ 'data': this.treeData[i].data, 'children': this.treeData[i].children });
            }
            this.treeData = [];
            this.dailyStockData = tempArray;
          });
        }
      }
    })
  }
  exportAsXLSX():void{
    let tempArray = [];
    this.dailyStockData.forEach(x => {
      tempArray.push(x.data);
      let childNode = x.children;
      childNode.forEach(y => {
        tempArray.push(y.data);
      })
    })
    this.excelService.exportAsExcelFile(tempArray,'GODOWN_DATA');
  }
  exportAsPDF() {
    var doc = new jsPDF('p','pt','a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office",100,30,);
    var col = this.dailyStockDataColumns;
    var rows = [];
    this.dailyStockData.forEach(element => {
      var temp = [element.data.Name,element.data.OpeningBalance,element.data.TotalReceipt,element.data.Receipt,element.data.IssueSales,element.data.IssueOthers,element.data.TotalIssue,element.data.ClosingBalance,element.data.CSBalance,element.data.Shortage,element.data.PhycialBalance];
      rows.push(temp);
      let regionData = element.children;
      regionData.forEach(element => {
        let godownData = element.children;
        var temp = [element.data.Name,element.data.OpeningBalance,element.data.TotalReceipt,element.data.Receipt,element.data.IssueSales,element.data.IssueOthers,element.data.TotalIssue,element.data.ClosingBalance,element.data.CSBalance,element.data.Shortage,element.data.PhycialBalance];
        rows.push(temp);
        godownData.forEach(element => {
          var temp = [element.data.Name,element.data.OpeningBalance,element.data.TotalReceipt,element.data.Receipt,element.data.IssueSales,element.data.IssueOthers,element.data.TotalIssue,element.data.ClosingBalance,element.data.CSBalance,element.data.Shortage,element.data.PhycialBalance];
          rows.push(temp);
        })
      })
    });
      doc.autoTable(col,rows);
      doc.save('GODOWN_DATA.pdf');
  }
  print(){
    window.print();
  }
}