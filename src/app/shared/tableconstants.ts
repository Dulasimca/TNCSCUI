export class TableConstants {
  DailyStockStatement: any;
  constructor() {
    this.DailyStockStatement = [
      {
        "field": 'commodity', "header": 'Commodity'
      },
      { "field": 'openingBalance', "header": 'Opening Balance' },
      { "field": 'totalReceipt', "header": 'Total Receipt' },
      { "field": 'grandTotalIssue', "header": 'Grand Total Issue' },
      { "field": 'saleIssue', "header": 'Sale Issue' },
      { "field": 'totalIssue', "header": 'Total Issue' },
      { "field": 'otherISsue', "header": 'Other Issue' },
      { "field": 'bookBalance', "header": 'Book Balance' },
      { "field": 'woff', "header": 'Cs0104+CU.YrCS-WOFF' },
      { "field": 'physicalBalance', "header": 'Physical Balance' }

    ]
  }
}
