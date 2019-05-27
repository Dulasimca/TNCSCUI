export class TableConstants {
  DailyStockStatement: any;
  GodownMasterData: any;
  CrsData: any;
  MrmData: any;
  HullingAgenciesData:any;
  FciData: any;
  RegionData: any;
  SupplierData:any;
  AadsData: any;
  Notification: any;
  SchemeData: any;
  StockPurchase: any;

  constructor() {
    this.DailyStockStatement = [
      { "field": "serialNo", "header": "S.No", "width": "40px"},
      { "field": 'Name', "header": 'Commodity' },
      { "field": 'OpeningBalance', "header": 'OB', "text-align": "right" },
      { "field": 'TotalReceipt', "header": 'Receipt' },
      { "field": 'Receipt', "header": 'Total Receipt' },
      { "field": 'IssueSales', "header": 'Sales' },
      { "field": 'IssueOthers', "header": 'Other Issue' },
      { "field": 'TotalIssue', "header": 'Total Issue' },
      { "field": 'ClosingBalance', "header": 'Closing Balance' },
      { "field": 'CSBalance', "header": 'Cummilative Shortage' },
      { "field": 'Shortage', "header": 'Current CS' },
      { "field": 'PhycialBalance', "header": 'Physical Balance' },
    ]

    this.GodownMasterData = [
      { "field": "serialNo", "header": "S.No"},
      { "field": 'Name', "header": 'Region Name' },
      { "field": 'Capacity', "header": 'Capacity' },
      { "field": 'Carpet', "header": 'Carpet' }
    ]
    this.CrsData = [
      { "field": 'SlNo', "header": 'S.No' },
      { "field": 'RegionName', "header": 'Region' },
      { "field": 'GodownName', "header": 'Godown Name' },
      { "field": 'Issuername', "header": 'Shop Name' },
      { "field": '', "header": 'Shop Code (TNCSC)' },
      //{ "field": '', "header": 'Shop Code (CCS)'}
    ]
    this.MrmData = [
      { "field": 'SlNo', "header": 'S.No' },
      { "field": 'DepositorName', "header": 'Depositor Name' }
    ]
    this.HullingAgenciesData = [
      { "field": 'SlNo', "header": 'S.No' },
      { "field": 'DepositorName', "header": 'Depositor Name' }
    ]
    this.FciData = [
      { "field": 'SlNo', "header": 'S.No' },
      { "field": 'DepositorName', "header": 'Depositor Name' }
    ]
    this.SupplierData = [
      { "field": 'SlNo', "header": 'S.No' },
      { "field": 'DepositorName', "header": 'Depositor Name' }
    ]
    this.RegionData = [
      { "field": 'SlNo', "header": 'S.No' },
      { "field": 'RGCODE', "header": 'Region Code'},
      { "field": 'RGNAME', "header": 'Region Name' }
    ]
    this.AadsData = [
      { "field": 'SlNo', "header": 'S.No' },
      { "field": 'RegionName', "header": 'Region' },
      { "field": 'AADSType', "header": 'AADS Code' },
      { "field": 'Name', "header": 'AADS Name' },
    ]
    this.SchemeData = [
      { "field": "SlNo", "header" : "S.No"},
      { "field": "Name", "header" : "Name"}
    ]
    this.Notification = [
      { "field": 'SlNo', "header": 'S.No' },
      { "field": 'Notes', "header": 'Description' }
    ]

    this.StockPurchase = [
      {
        "field": 'depositorName', "header": 'Depositor Name'
      },
      { "field": 'itemName', "header": 'Item Name' },
      { "field": 'qty', "header": 'Quantity' },
      { "field": 'orderNumber', "header": 'Order Number' },
      { "field": 'remarks', "header": 'Remarks' }]
  }
  }
