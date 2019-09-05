import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { ExcelService } from 'src/app/shared-services/excel.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-item-master-modification',
  templateUrl: './item-master-modification.component.html',
  styleUrls: ['./item-master-modification.component.css']
})
export class ItemMasterModificationComponent implements OnInit {
  ItemMasterCols: any;
  ItemMasterData: any;
  canShowMenu: boolean;
  items: any;
  filterArray: any;
  searchText: any;
  loading: boolean = false;

  constructor(private tableConstants: TableConstants, private excelService: ExcelService, private authService: AuthService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.ItemMasterCols = this.tableConstants.ItemMasterModification;
    this.restApiService.get(PathConstants.COMMODITY_BREAK_ITEM_MASTER_MODIFICATION).subscribe(value => {
      if (value !== undefined) {
        this.loading = false;
        this.ItemMasterData = value;
        this.filterArray = value;
        let sno = 0;
        this.ItemMasterData.forEach(data => {
          sno += 1;
          data.SlNo = sno;
        });
      }
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
    this.ItemMasterData = this.filterArray;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.ItemMasterData = this.ItemMasterData.filter(item => {
        // if (item.DepositorName.toString().startsWith(value)) {
        return item.ITDescription.toString().startsWith(value);
        // }
      });
    }
  }

  exportAsXLSX(): void {
    var ItemMaster = [];
    this.ItemMasterData.forEach(data => {
      ItemMaster.push({ SlNo: data.SlNo, Item_Code: data.ITCode, Item_Name: data.ITDescription, Group: data.GRName, ItemType: data.ItemType })
    });
    this.excelService.exportAsExcelFile(ItemMaster, 'ItemMaster', this.ItemMasterCols);
  }

  exportAsPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
    // var img ="assets\layout\images\dashboard\tncsc-logo.png";
    // doc.addImage(img, 'PNG', 150, 10, 40, 20);
    var col = this.ItemMasterCols;
    var rows = [];
    this.ItemMasterData.forEach(element => {
      var temp = [element.SlNo, element.ITCode, element.ITDescription, element.GRName, element.ItemType];
      rows.push(temp);
    });
    doc.autoTable(col, rows);
    doc.save('Commodity_Break.pdf');
  }

  onPrint() { }
}