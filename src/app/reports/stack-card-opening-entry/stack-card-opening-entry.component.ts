import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';

@Component({
  selector: 'app-stack-card-opening-entry',
  templateUrl: './stack-card-opening-entry.component.html',
  styleUrls: ['./stack-card-opening-entry.component.css']
})
export class StackCardOpeningEntryComponent implements OnInit {
  stackOpeningCols: any;
  stackOpeningData: any;
  yearOptions: SelectItem[];
  year: string;

  constructor(private tableConstants: TableConstants) { }

  ngOnInit() {
    this.stackOpeningCols = this.tableConstants.StackCardOpeningEntryReport;
  }

  onSelect(selectedItem) {
    let yearArr = [];
    const range = 50;
    switch(selectedItem) {
    case 'y':
      const year = new Date().getFullYear();
      for (let i = 0; i <= range ; i ++) {
    //  let yearLabel = year - i;
        yearArr.push({'label': (year - i).toString(), 'value': year - 1});
      }
      this.yearOptions = yearArr;
      break;
  }
}
}
