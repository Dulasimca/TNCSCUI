export class TableConstants {
  DailyStockStatement: any;
  GodownMasterData: any;
  CrsData: any;
  MrmData: any;
  HullingAgenciesData: any;
  FciData: any;
  RegionData: any;
  SupplierData: any;
  AadsData: any;
  Notification: any;
  SchemeData: any;
  StockPurchase: any;
  CBStatementColumns: any;
  DeliveryDocumentcolumns: any;
  DeliveryItemColumns: any;
  DeliveryItemSchemeColumns: any;
  DeliveryPaymentcolumns: any;
  DeliveryPaymentBalanceCols: any;
  StockReceiptRegisterReport: any;
  StockIssueRegisterReport: any;
  TruckMemoRegisterReport: any;
  DeliveryMemoRegisterReport: any;

  constructor() {
    this.DailyStockStatement = [
      { "field": "serialNo", "header": "S.No", "width": "40px" },
      { "field": 'Name', "header": 'Commodity' },
      { "field": 'OpeningBalance', "header": 'OB', "text-align": "right" },
      { "field": 'Receipt', "header": 'Receipt' },
      { "field": 'Total', "header": 'Total Receipt' },
      { "field": 'IssueSales', "header": 'Sales' },
      { "field": 'IssueOthers', "header": 'Other Issue' },
      { "field": 'TotalIssue', "header": 'Total Issue' },
      { "field": 'ClosingBalance', "header": 'Closing Balance' },
      { "field": 'CSBalance', "header": 'Cummilative Shortage' },
      { "field": 'Shortage', "header": 'Current CS' },
      { "field": 'PhycialBalance', "header": 'Physical Balance' },
    ]

    this.GodownMasterData = [
      { "field": "serialNo", "header": "S.No" },
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
      { "field": 'RGCODE', "header": 'Region Code' },
      { "field": 'RGNAME', "header": 'Region Name' }
    ]
    this.AadsData = [
      { "field": 'SlNo', "header": 'S.No' },
      { "field": 'RegionName', "header": 'Region' },
      { "field": 'AADSType', "header": 'AADS Code' },
      { "field": 'Name', "header": 'AADS Name' },
    ]
    this.SchemeData = [
      { "field": "SlNo", "header": "S.No" },
      { "field": "Name", "header": "Name" }
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

    this.CBStatementColumns = [
      // { "field": 'serialNo', "header": 'SI.NO' },
      { "field": 'TNCSName', "header": 'Region Name' },
      { "field": 'TNCSCapacity', "header": 'Capacity' },
      { "field": 'boiledRice', "header": 'Boiled Rice' },
      { "field": 'rawRice', "header": 'Raw Rice' },
      { "field": 'totalRice', "header": 'Rice Total' },
      { "field": 'SUGAR', "header": 'SUGAR' },
      { "field": 'WHEAT', "header": 'WHEAT' },
      { "field": 'toorDhall', "header": 'TOOR DHALL' },
      { "field": 'kanadaToorDhall', "header": 'Kanada TOOR Dhall' },
      { "field": 'totalDhall', "header": 'Dhall Total' },
      { "field": 'uridDhall', "header": 'URID Dhall' },
      { "field": 'palmoil', "header": 'PALMOLIEN OIL' },
      { "field": 'cement', "header": 'CEMENT' }
    ]

    this.DeliveryDocumentcolumns = [
      { "field": 'deliveryOrder', "header": 'Delivery Order' },
      { "field": 'transCode', "header": 'Transaction Code' },

    ]

    this.DeliveryItemColumns = [
      { "field": 'itemDesc', "header": 'Item Desc' },
      { "field": 'netWeight', "header": 'Net Weight' },
      { "field": 'unitMeasure', "header": 'Unit Measure' },
      { "field": 'scheme', "header": 'Scheme' },
      { "field": 'rate', "header": 'Rate' },
      { "field": 'total', "header": 'Total' },
    ]

    this.DeliveryItemSchemeColumns = [
      { "field": 'schemeName', "header": 'Scheme Name' },
      { "field": 'itemName', "header": 'Item Name' },
      { "field": 'netWeight', "header": 'Net Weight' },
      { "field": 'rateInTerms', "header": 'Rate In Terms' },
      { "field": 'marginRate', "header": 'Margin Rate' },
      { "field": 'marginAmount', "header": 'Margin Amount' },
    ];

    this.DeliveryPaymentcolumns = [
      { "field": 'paymentMode', "header": 'Payment Mode' },
      { "field": 'payOrderNumber', "header": 'CH/DD/PayOrder No' },
      { "field": 'payOrderDate', "header": 'CH/DD/PayOrder Date' },
      { "field": 'paymentAmount', "header": 'Payment Amount' },
      { "field": 'bank', "header": 'Bank' },
    ]

    this.DeliveryPaymentBalanceCols = [
      { "field": 'prevDeliveryOrder', "header": 'Previous Delivery Order' },
      { "field": 'deliveryOrderDate', "header": 'Delivery Order Date' },
      { "field": 'adjAmt', "header": 'Adjustment Amount' },
      { "field": 'adjType', "header": 'Adjustment Type' },
      { "field": 'amtNowAdjusted', "header": 'Amount Now Adjusted' },
      { "field": 'balance', "header": 'Balance' }
    ];

    this.StockReceiptRegisterReport = [
      { "field": 'ackNo', "header": 'ACK.No' },
      { "field": 'truckMemoNo', "header": 'Truck Memo No' },
      { "field": 'date', "header": 'Lorry No' },
      { "field": 'fromreceiver', "header": 'From Whom Received' },
      { "field": 'stackNo', "header": 'Satck No' },
      { "field": 'scheme', "header": 'Scheme' },
      { "field": 'noPacking', "header": 'No Packing' },
      { "field": 'commodity', "header": 'Commodity' },
      { "field": 'netWt', "header": 'Net Wt' },
    ];

    this.StockIssueRegisterReport = [
      { "field": 'issueMemoNo', "header": 'Issue Memo No' },
      { "field": 'doNo', "header": 'Do No' },
      { "field": 'date', "header": 'Date' },
      { "field": 'lorryNo', "header": 'Lorry No' },
      { "field": 'toWhomIssued', "header": 'To Whom Issued' },
      { "field": 'stackNo', "header": 'Stack No' },
      { "field": 'scheme', "header": 'Scheme' },
      { "field": 'noPacking', "header": 'No Packing' },
      { "field": 'commodity', "header": 'Commodity' },
      { "field": 'netWt', "header": 'Net Wt' },
    ];

    this.TruckMemoRegisterReport = [
      { "field": 'truckMemoNo', "header": 'Truck Memo No' },
      { "field": 'moNo', "header": 'Mo.No' },
      { "field": 'date', "header": 'Date' },
      { "field": 'roNo', "header": 'Ro.No' },
      { "field": 'toWhomIssued', "header": 'To Whom Issued' },
      { "field": 'stackNo', "header": 'Stack No' },
      { "field": 'scheme', "header": 'Scheme' },
      { "field": 'noPacking', "header": 'No Packing' },
      { "field": 'commodity', "header": 'Commodity' },
      { "field": 'netWt', "header": 'Net Wt' },
    ];

    this.DeliveryMemoRegisterReport = [
      { "field": 'SlNo', "header": 'S.No'},
      { "field": 'deliveryOrderNo', "header": 'Delivery Order No'},
      { "field": 'date', "header": 'Date' },
      { "field": 'grandTotal', "header": 'Grand Total (Rs)'},
      { "field": 'toWhomIssued', "header": 'To Whom Issued' },
      { "field": 'cheque/ddNo', "header": 'Cheque/DD No'},
      { "field": 'amount(Rs)', "header": 'Amount (Rs)' },
      { "field": 'scheme', "header": 'Scheme' },
      { "field": 'commodity', "header": 'Commodity' },
      { "field": 'quantity', "header": 'Quantity(Kgs)' },
      { "field": 'rate', "header": 'Rate' },
      { "field": 'amount', "header": 'Amount' },
      { "field": 'prevBalance', "header": 'Prev.Balance' },
      { "field": 'otherAmount', "header": 'Other Amount' },
      { "field": 'balance', "header": 'Balance' },
      { "field": 'margin', "header": 'Margin' }
    ];
  }
}
