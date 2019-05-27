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
  treeData: any[] = [];
  fromDate: Date;
  toDate: Date;
  itemCodes: any = [];
  ITCODE1: any;
  ITCODE2: any;
  canShowMenu: boolean;
  items: any;
  filterArray: any;

  constructor(private tableConstants: TableConstants,private excelService: ExcelService, private restApiService: RestAPIService,
    private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    let tempArray = [];
    this.dailyStockDataColumns = this.tableConstants.DailyStockStatement;
    this.restApiService.get(PathConstants.DAILY_STOCK_STATEMENT_ITEM_MASTER).subscribe(itemCodes => {
      if (itemCodes !== undefined) {
        for (let c = 0; c < itemCodes.length; c++) {
          this.ITCODE1 = itemCodes[c].ITCode;
          this.ITCODE2 = itemCodes[c + 1].ITCode;
          c = c + 1;
          var index = 1;
          let params = new HttpParams().set('ITCode1', this.ITCODE1).append('ITCode2', this.ITCODE2);
          this.restApiService.getByParameters(PathConstants.DAILY_STOCK_STATEMENT, params).subscribe((response: any[]) => {
            let childNode: TreeNode;
            let regionChildNode: TreeNode;
            let regionData = [];
            let godownData = [];
            response.forEach(x => {
              let regionList = x.ListItems;
              for (let i = 0; i < regionList.length; i++) {
                let godownList = regionList[i].ListItems;
                for (let i = 0; i < godownList.length; i++) {
                  let godownOBReceiptTotal = ((godownList[i].OpeningBalance) * 1) + ((godownList[i].TotalReceipt) * 1);
                  let godownIssueTotal = ((godownList[i].IssueSales) * 1) + ((godownList[i].IssueOthers) * 1);
                  regionChildNode = {
                    'data': {
                      'serialNo': i + 1 + '.',
                      'Name': godownList[i].Name,
                      'OpeningBalance': godownList[i].OpeningBalance,
                      'ClosingBalance': godownList[i].ClosingBalance,
                      'TotalReceipt': godownList[i].TotalReceipt,
                      'Receipt': (godownOBReceiptTotal > 0) ? godownOBReceiptTotal.toFixed(3) : godownOBReceiptTotal,
                      'IssueSales': godownList[i].IssueSales,
                      'IssueOthers': godownList[i].IssueOthers,
                      'TotalIssue': (godownIssueTotal > 0) ? godownIssueTotal.toFixed(3) : godownIssueTotal,
                      'CSBalance': godownList[i].CSBalance,
                      'PhycialBalance': godownList[i].PhycialBalance,
                      'Shortage': godownList[i].Shortage,
                    }
                  }
                  godownData.push(regionChildNode);
                }
                let regionOBReceiptTotal = ((regionList[i].OpeningBalance) * 1) + ((regionList[i].TotalReceipt) * 1);
                let regionIssueTotal = ((regionList[i].IssueSales) * 1) + ((regionList[i].IssueOthers) * 1);
                childNode = {
                  'data': {
                    'serialNo': i + 1 + ")",
                    'Name': regionList[i].Name,
                    'OpeningBalance': regionList[i].OpeningBalance,
                    'ClosingBalance': regionList[i].ClosingBalance,
                    'TotalReceipt': regionList[i].TotalReceipt,
                    'Receipt': (regionOBReceiptTotal > 0) ? regionOBReceiptTotal.toFixed(3) : regionOBReceiptTotal,
                    'IssueSales': regionList[i].IssueSales,
                    'IssueOthers': regionList[i].IssueOthers,
                    'TotalIssue': (regionIssueTotal > 0) ? regionIssueTotal.toFixed(3) : regionIssueTotal,
                    'CSBalance': regionList[i].CSBalance,
                    'PhycialBalance': regionList[i].PhycialBalance,
                    'Shortage': regionList[i].Shortage,
                  }, 'children': godownData
                }
                regionData.push(childNode);
                godownData = [];
              }
              let OBReceiptTotal = ((x.OpeningBalance) * 1) + ((x.TotalReceipt) * 1);
              let IssueTotal = ((x.IssueSales) * 1) + ((x.IssueOthers) * 1);
              this.treeData.push(
                {
                  'data': {
                    'serialNo': index,
                    'Name': x.Name,
                    'OpeningBalance': x.OpeningBalance,
                    'ClosingBalance': x.ClosingBalance,
                    'TotalReceipt': x.TotalReceipt,
                    'Receipt': (OBReceiptTotal > 0) ? OBReceiptTotal.toFixed(3) : OBReceiptTotal,
                    'IssueSales': x.IssueSales,
                    'IssueOthers': x.IssueOthers,
                    'TotalIssue': (IssueTotal > 0) ? IssueTotal.toFixed(3) : IssueTotal,
                    'CSBalance': x.CSBalance,
                    'PhycialBalance': x.PhycialBalance,
                    'Shortage': x.Shortage,
                  },
                  'children': regionData,
                },
              );
              index ++;
              regionData = [];
            });
            for (let i = 0; i < this.treeData.length; i++) {
              tempArray.push({ 'data': this.treeData[i].data, 'children': this.treeData[i].children });
            }
            this.treeData = [];
            this.dailyStockData = tempArray;
            this.filterArray=tempArray;
          });
        }
      }
    })
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
  }
  onSearch(value) {
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.dailyStockData = this.dailyStockData.filter(item => {
          return item.data.Name.toString().startsWith(value);
      });
       } else {
         this.dailyStockData = this.filterArray;
       }
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
    this.excelService.exportAsExcelFile(tempArray,'DailyStocksStatement');
  }
  exportAsPDF() {
    var doc = new jsPDF('p','pt','a4');
    doc.text('Tamil Nadu Civil Supplies Corporation - Head Office',100,30,);
    var col = this.dailyStockDataColumns;
    var rows = [];
    this.dailyStockData.forEach(element => {
      var temp = [element.data.serialNo,element.data.Name,element.data.OpeningBalance,element.data.TotalReceipt,element.data.Receipt,element.data.IssueSales,element.data.IssueOthers,element.data.TotalIssue,element.data.ClosingBalance,element.data.CSBalance,element.data.Shortage,element.data.PhycialBalance];
      rows.push(temp);
      let regionData = element.children;
      regionData.forEach(element => {
        let godownData = element.children;
        var temp = [element.data.serialNo,element.data.Name,element.data.OpeningBalance,element.data.TotalReceipt,element.data.Receipt,element.data.IssueSales,element.data.IssueOthers,element.data.TotalIssue,element.data.ClosingBalance,element.data.CSBalance,element.data.Shortage,element.data.PhycialBalance];
        rows.push(temp);
        godownData.forEach(element => {
          var temp = [element.data.serialNo,element.data.Name,element.data.OpeningBalance,element.data.TotalReceipt,element.data.Receipt,element.data.IssueSales,element.data.IssueOthers,element.data.TotalIssue,element.data.ClosingBalance,element.data.CSBalance,element.data.Shortage,element.data.PhycialBalance];
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