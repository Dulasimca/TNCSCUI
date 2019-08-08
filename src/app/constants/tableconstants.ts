import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HEADER_OFFSET } from '@angular/core/src/render3/interfaces/view';

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
  CommodityReceiptReport: any;
  SchemeReceiptReport: any;
  TransactionReceiptReport: any;
  CommodityIssueMemoReport: any;
  SchemeIssueMemoReport: any;
  WriteoffReport: any;
  HullingDetailsReport: any;
  TruckToRegionReport: any;
  TruckFromRegionReport: any;
  GunnyReport: any;
  StackCardOpeningEntryReport: any;
  StackCardClosingEntryReport: any;
  StackReceiptEntryReport: any;
  StackWiseBreakupDetails: any;
  SchemeWiseBreakupDetails: any;
  TruckTransit: any;
  StockReceiptItemColumns: any;
  StockIssueMemoIssueDetailsColumns: any;
  StockIssueMemoItemDetailsColumns: any;
  DoAllScheme: any;
  DoSPLPDS: any;
  DoOAP: any;
  DoAAN: any;
  DoOtherScheme: any;
  DoSocietyAbstract: any;
  ReceiptROPurchaseReport: any;
  ReceiptHOPurchaseReport: any;
  ReceiptRONOPurchaseReport: any;
  StockReceiptDocumentViewCols: any;
  DoDemandDraft: any;
  DoMarginAmount: any;
  SchemeAbstractReceipt: any;
  SchemeAbstractIssueAll: any;
  SchemeAbstractIssueCRS: any;
  SchemeAbstractIssueCoOp: any;
  SchemeAbstractTruck: any;
  QtyReceiptCommodity: any;
  QtyIssueCommodity: any;
  QtyReceiptOtherItem: any;
  QtyIssueOtherItem: any;
  SocietyMaster: any;
  ShopWiseAllotmentMaster: any;
  DepositorMaster: any;
  TruckMemoItemDetails: any;
  SocietyMasterEntry: any;
  ItemMasterModification: any;
  GodownCustomerList: any;
  OpeningBalanceMasterEntry: any;
  StockStatementReport: any;
  TransactionStatus: any;
  OpeningBalanceCurYearEntry: any;
  DailyDocumentTotalReport: any;
  DailyDocumentReceipt: any;
  DailyDocumentIssue: any;
  StockIssueMemoViewBySINOCols: any;
  StackCardOpening: any;
  StackCard: any;
  PackingMaster: any;
  CommodityMaster: any;
  OtherMaster: any;
  CncCorrection: any;
  TruckMemoViewDocumentCols: any;

  constructor() {
    this.DailyStockStatement = [
      { field: 'serialNo', header: 'S.No', width: '40px' },
      { field: 'Name', header: 'Commodity' },
      { field: 'OpeningBalance', header: 'OB', align: 'right' },
      { field: 'Receipt', header: 'Receipt' },
      { field: 'Total', header: 'Total Receipt' },
      { field: 'IssueSales', header: 'Sales' },
      { field: 'IssueOthers', header: 'Other Issue' },
      { field: 'TotalIssue', header: 'Total Issue' },
      { field: 'ClosingBalance', header: 'Closing Balance' },
      { field: 'CSBalance', header: 'Cumulative Shortage' },
      { field: 'Shortage', header: 'Current CS' },
      { field: 'PhycialBalance', header: 'Physical Balance' },
    ]

    this.GodownMasterData = [
      { field: 'serialNo', header: 'S.No' },
      { field: 'Name', header: 'Region Name' },
      { field: 'Code', header: 'Code' },
      { field: 'Capacity', header: 'Capacity' },
      { field: 'Carpet', header: 'Carpet' }
    ]
    this.CrsData = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'RegionName', header: 'Region' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'Issuername', header: 'Shop Name' },
      { field: 'IssuerCode', header: 'Shop Code (TNCSC)' },
      { field: 'AcsCode', header: 'AcsCode'}
    ]
    this.MrmData = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'DepositorName', header: 'Depositor Name' }
    ]
    this.HullingAgenciesData = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'DepositorName', header: 'Depositor Name' }
    ]
    this.FciData = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'DepositorName', header: 'Depositor Name' }
    ]
    this.SupplierData = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'DepositorCode', header: 'Depositor Code' },
      { field: 'DepositorName', header: 'Depositor Name' }
    ]
    this.RegionData = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'RGCODE', header: 'Region Code' },
      { field: 'RGNAME', header: 'Region Name' }
    ]
    this.AadsData = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'RegionName', header: 'Region' },
      { field: 'AADSType', header: 'AADS Code' },
      { field: 'Name', header: 'AADS Name' },
    ]
    this.SchemeData = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Name', header: 'Name' }
    ]
    this.Notification = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Notes', header: 'Description' }
    ]

    this.StockPurchase = [
      {
        field: 'depositorName', header: 'Depositor Name'
      },
      { field: 'itemName', header: 'Item Name' },
      { field: 'qty', header: 'Quantity' },
      { field: 'orderNumber', header: 'Order Number' },
      { field: 'remarks', header: 'Remarks' }]

    this.CBStatementColumns = [
      // { field: 'serialNo', header: 'SI.NO' },
      { field: 'TNCSName', header: 'Region Name' },
      { field: 'TNCSCapacity', header: 'Capacity' },
      { field: 'boiledRice', header: 'Boiled Rice' },
      { field: 'rawRice', header: 'Raw Rice' },
      { field: 'totalRice', header: 'Rice Total' },
      { field: 'SUGAR', header: 'SUGAR' },
      { field: 'WHEAT', header: 'WHEAT' },
      { field: 'toorDhall', header: 'TOOR DHALL' },
      { field: 'kanadaToorDhall', header: 'CYL TOOR Dhall' },
      { field: 'totalDhall', header: 'Dhall Total' },
      { field: 'uridDhall', header: 'URID Dhall' },
      { field: 'palmoil', header: 'PALMOLIEN OIL' },
      { field: 'cement', header: 'CEMENT' }
    ]

    this.DeliveryDocumentcolumns = [
      { field: 'DoNo', header: 'Delivery Order' },
      { field: 'DDate', header: 'Delivery Date' },
      { field: 'Society', header: 'Society' },
      { field: 'Due', header: 'Due' },
      { field: 'Paid', header: 'Paid' },
      { field: 'AdvCollection', header: 'Advance Collection' },
      { field: 'Debit', header: 'Debit' },
    ]

    this.DeliveryItemColumns = [
      { field: 'ITDescription', header: 'IT Description' },
      { field: 'NetWeight', header: 'Net Weight' },
      { field: 'UnitMeasure', header: 'Unit Measure' },
      { field: 'SchemeName', header: 'Scheme' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Total', header: 'Total' },
    ]

    this.DeliveryItemSchemeColumns = [
      { field: 'SchemeName', header: 'Scheme Name' },
      { field: 'ITDescription', header: 'Item Name' },
      { field: 'MarginNkgs', header: 'Net Weight' },
      { field: 'RateInTerms', header: 'Rate In Terms' },
      { field: 'MarginRate', header: 'Margin Rate' },
      { field: 'MarginAmount', header: 'Margin Amount' },
    ];

    this.DeliveryPaymentcolumns = [
      { field: 'PaymentMode', header: 'Payment Mode' },
      { field: 'ChequeNo', header: 'CH/DD/PayOrder No' },
      { field: 'ChDate', header: 'CH/DD/PayOrder Date' },
      { field: 'PaymentAmount', header: 'Payment Amount' },
      { field: 'payableat', header: 'Payable At' },
      { field: 'bank', header: 'Bank' },
    ]

    this.DeliveryPaymentBalanceCols = [
      { field: 'AdjustedDoNo', header: 'Previous Delivery Order' },
      { field: 'AdjustDate', header: 'Delivery Order Date' },
      { field: 'Amount', header: 'Adjustment Amount' },
      { field: 'AdjustmentType', header: 'Adjustment Type' },
      { field: 'AmountNowAdjusted', header: 'Amount Now Adjusted' },
      { field: 'Balance', header: 'Balance' }
    ];

    this.StockReceiptRegisterReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Ackno', header: 'ACK.No' },
      { field: 'Date', header: 'Date' },
      { field: 'TruckMemoNo', header: 'Truck Memo No' },
      { field: 'Lorryno', header: 'Lorry No' },
      { field: 'From_Whom_Received', header: 'From Whom Received' },
      { field: 'Stackno', header: 'Satck No' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'NoPacking', header: 'No Packing' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'NetWt', header: 'Net Wt' },
    ];

    this.StockIssueRegisterReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Issue_Memono', header: 'Issue Memo No' },
      { field: 'DNo', header: 'Do No' },
      { field: 'Issue_Date', header: 'Date' },
      { field: 'Lorryno', header: 'Lorry No' },
      { field: 'To_Whom_Issued', header: 'To Whom Issued' },
      { field: 'Stackno', header: 'Stack No' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'NoPacking', header: 'No Packing' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'NetWt', header: 'Net Wt' },
    ];

    this.TruckMemoRegisterReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Truck_Memono', header: 'Truck Memo No' },
      { field: 'Mono', header: 'Mo.No' },
      { field: 'Issue_Date', header: 'Date' },
      { field: 'RoNo', header: 'Ro.No' },
      { field: 'To_Whom_Issued', header: 'To Whom Issued' },
      { field: 'Stackno', header: 'Stack No' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'NoBags', header: 'No Packing' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'NetWt', header: 'Net Wt' },
    ];

    this.DeliveryMemoRegisterReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Dono', header: 'Delivery Order No' },
      { field: 'DeliveryOrderDate', header: 'Date' },
      { field: 'Totals', header: 'Total (Rs)' },
      { field: 'To_Whom_Issued', header: 'Issuer Name' },
      { field: 'Cheque_DD', header: 'Cheque/DD' },
      { field: 'PaymentAmount', header: 'Payment Amount (Rs)' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'Netwt_Kgs', header: 'Net.Wt(Kgs)' },
      { field: 'Rate_Rs', header: 'Rate(Rs)' },
      { field: 'Itemamount', header: 'Item Amount' },
      { field: 'PreviousAmount ', header: 'Previous Balance' },
      { field: 'Adjusted', header: 'Other Amount' },
      { field: 'Balance', header: 'Current Balance' },
      { field: 'MarginAmount', header: 'Margin Amount' }
    ];

    this.CommodityReceiptReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Godownname', header: 'GODOWN' },
      { field: 'Scheme', header: 'SCHEME' },
      { field: 'Ackno', header: 'Ack. No' },
      { field: 'Date', header: 'DATE' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Bags_No', header: 'BAGS/NOS' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'RecdFrom', header: 'RECD FROM' },
      { field: 'Lorryno', header: 'LORRY NO' },
      { field: 'TruckMemoNo', header: 'T.MEMO.MC' },
      { field: 'Truckmemodate', header: 'T.MEMO.DT' },
      { field: 'Orderno', header: 'Order.No' }
    ];

    this.SchemeReceiptReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Godownname', header: 'GODOWN' },
      { field: 'Scheme', header: 'SCHEME' },
      { field: 'Ackno', header: 'Ack. No' },
      { field: 'Date', header: 'DATE' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'RecdFrom', header: 'RECD FROM' },
      { field: 'TruckMemoNo', header: 'T.MEMO.NO' },
      { field: 'Lorryno', header: 'LORRY NO' }
    ];

    this.TransactionReceiptReport = [
      { field: 'SlNo', header: 'S.No', width: '20px !important' },
      { field: 'Godownname', header: 'GODOWN' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Date', header: 'DATE' },
      { field: 'Trans_action', header: 'TRANSACTION' },
      { field: 'Quantity', header: 'QUANTITY', type: 'number : 1.2', align: 'right' }
    ];

    this.CommodityIssueMemoReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Godownname', header: 'GODOWN' },
      { field: 'Scheme', header: 'SCHEME' },
      { field: 'Issue_Memono', header: 'I.MEMO NO' },
      { field: 'Issue_Date', header: 'DATE' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'Issuedto', header: 'ISSUED TO' },
      { field: 'Lorryno', header: 'LORRY NO' },
      { field: 'Stackno', header: 'Stack No' }
    ];

    this.SchemeIssueMemoReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Godownname', header: 'GODOWN' },
      { field: 'Scheme', header: 'SCHEME' },
      { field: 'Issue_Memono', header: 'I.MEMO NO' },
      { field: 'Issue_Date', header: 'DATE' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'Issuedto', header: 'ISSUED TO' }
    ];

    this.WriteoffReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Godownname', header: 'GODOWN' },
      { field: 'Date', header: 'DATE' },
      { field: 'Issue_Memono', header: 'ISSUE NO' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'StackNo', header: 'Stack No' },
      { field: 'Remarks', header: 'REMARKS' }
    ];

    this.HullingDetailsReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'SRNo', header: 'Ack. No' },
      { field: 'SRDate', header: 'Date' },
      { field: 'ITDescription', header: 'Commodity' },
      { field: 'DepositorName', header: 'Depositor' },
      { field: 'NoPacking', header: 'Bags' },
      { field: 'Nkgs', header: 'Quantity' }
    ];

    this.TruckToRegionReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'STNo', header: 'Truck Memo' },
      { field: 'STDate', header: 'Date' },
      { field: 'DepositorName', header: 'Godown' },
      { field: 'RGNAME', header: 'Region' },
      { field: 'ITDescription', header: 'Commodity' },
      { field: 'SCName', header: 'Scheme' },
      { field: 'NoPacking', header: 'Bags' },
      { field: 'Nkgs', header: 'Quantity' },
      { field: 'LNo', header: 'Docno./L' }
    ];

    this.TruckFromRegionReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'SRNo', header: 'Ack. No' },
      { field: 'SRDate', header: 'Date' },
      { field: 'Tyname', header: 'Type' },
      { field: 'TNCSName', header: 'Depositor' },
      { field: 'ITDescription', header: 'Commodity' },
      { field: 'NoPacking', header: 'Bags' },
      { field: 'Nkgs', header: 'Quantity' }
    ];

    this.GunnyReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Ackno', header: 'ACK. NO' },
      { field: 'Date', header: 'DATE' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Bags', header: 'BAGS' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'stackno', header: 'STACK NO' },
      { field: 'Year', header: 'S.YEAR' }
    ];

    this.StackCardOpeningEntryReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'CommodityName', header: 'Commodity'},
      { field: 'StackNo', header: 'Stack No' },
      { field: 'StackBalanceBags', header: 'Bags' },
      { field: 'StackBalanceWeight', header: 'Weight' },
      { field: 'ObStackDate', header: 'From Date' },
      { field: 'CurYear', header: 'Formation Year' },
      { field: 'Flag1', header: 'Status' },
    ];

    this.StackWiseBreakupDetails = [
      { field: 'Stackno', header: 'Stack No'},
      { field: 'bags', header: 'Bags'},
      { field: 'Weight', header: 'Weight'}
    ];

    this.SchemeWiseBreakupDetails = [
      { field: 'Stackno', header: 'Stack No'},
      { field: 'bags', header: 'Bags'},
      { field: 'Weight', header: 'Weight'},
      { field: 'Scheme', header: 'Scheme'}
    ];

    this.TruckTransit = [
      { field: 'SlNo', header: 'S.No'},
      {field: 'STNo', header: 'Truck Memo No'},
      {field: 'STDate', header: 'Sender Date'},
      {field: 'Region', header: 'Region'},
      {field: 'TNCSName', header: 'Sender Godown'},
      {field: 'LNo', header: 'Lorry No'},
      {field: 'NoPacking', header: 'Bags'},
      {field: 'Nkgs', header: 'Quantity'},
      {field: 'ACKNO', header: 'AckNo'},
      {field: 'STDate', header: 'Receiver Date'},
      {field: 'DepositorName', header: 'Receiver Godown'},
      {field: 'NoPacking', header: 'Bags Received'},
      {field: 'Nkgs', header: 'Received Quantity'},
      {field: 'Transfertype', header: 'Transfer Type'}
    ];

    this.StockReceiptItemColumns = [
      { field: 'TStockNo', header: 'Stack No.' },
      { field: 'CommodityName', header: 'Item Description' },
      { field: 'PackingName', header: 'Packing Type' },
      { field: 'NoPacking', header: 'No. of packing' },
      { field: 'WmtType', header: 'Wmt Type' },
      { field: 'GKgs', header: 'Gross Wt' },
      { field: 'Nkgs', header: 'Net WT' },
      { field: 'Moisture', header: 'Moisture' },
      { field: 'SchemeName', header: 'Scheme' },
      // { field: 'icon', header: 'Action'}
    ];

    this.StockIssueMemoViewBySINOCols = [
    {field: 'SINo', header: 'Issue Memo No' },
    { field: 'SIDate', header: 'Issue Memo Date' },
    { field: 'DNo', header: 'Delivery Order No' },
    { field: 'DDate', header: 'Delivery Order' },
    { field: 'IssuerName', header: 'Issuer Name'},
    { field: 'ReceivorName', header: 'Receivor Name'},
    ];

    this.StockIssueMemoIssueDetailsColumns = [ 
    { field: 'DNo', header: 'Delivery Order No' },
    { field: 'DeliveryOrderDate', header: 'Delivery Order' },
    {field: 'SINo', header: 'Issue Memo No' },
    { field: 'IssueMemoDate', header: 'Issue Memo Date' }];

    this.StockIssueMemoItemDetailsColumns = [
      { field: 'TStockNo', header:'Stack No.' },
      { field: 'CommodityName', header:'Item Description' },
      { field: 'PackingName', header:'Packing Type' },
      { field: 'NoPacking', header:'No. of packing' },
      { field: 'WmtType', header:'Wmt Type' },
      { field: 'GKgs', header:'Gross Wt' },
      { field: 'Nkgs', header:'Net WT' },
      { field: 'Moisture', header:'Moisture' },
      { field: 'SchemeName', header:'Scheme' },
    ];

    this.DoAllScheme = [
      { field: '', header: 'Do.No' },
      { field: '', header: 'Date' },
      { field: '', header: 'Type' },
      { field: '', header: 'Co_op' },
      { field: '', header: 'Commodity' },
      { field: '', header: 'Scheme' },
      { field: '', header: 'Quantity' },
      { field: '', header: 'Rate' },
      { field: '', header: 'Amount' },
      { field: '', header: 'C/NC' }
    ];

    this.DoSPLPDS = [
      { field: '', header: 'Do.No' },
      { field: '', header: 'Date' },
      { field: '', header: 'Type' },
      { field: '', header: 'Co_op' },
      { field: '', header: 'Commodity' },
      { field: '', header: 'Scheme' },
      { field: '', header: 'Quantity' },
      { field: '', header: 'Rate' },
      { field: '', header: 'Amount' },
      { field: '', header: 'C/NC' }
    ];
    
    this.DoOAP = [
      { field: '', header: 'Do.No' },
      { field: '', header: 'Date' },
      { field: '', header: 'Type' },
      { field: '', header: 'Co_op' },
      { field: '', header: 'Commodity' },
      { field: '', header: 'Scheme' },
      { field: '', header: 'Quantity' },
      { field: '', header: 'Rate' },
      { field: '', header: 'Amount' },
      { field: '', header: 'C/NC' }
    ];

    this.DoAAN = [
      { field: '', header: 'Do.No' },
      { field: '', header: 'Date' },
      { field: '', header: 'Type' },
      { field: '', header: 'Co_op' },
      { field: '', header: 'Commodity' },
      { field: '', header: 'Scheme' },
      { field: '', header: 'Quantity' },
      { field: '', header: 'Rate' },
      { field: '', header: 'Amount' },
      { field: '', header: 'C/NC' }
    ];

    this.DoOtherScheme = [
      { field: '', header: 'Do.No' },
      { field: '', header: 'Date' },
      { field: '', header: 'Type' },
      { field: '', header: 'Co_op' },
      { field: '', header: 'Commodity' },
      { field: '', header: 'Scheme' },
      { field: '', header: 'Quantity' },
      { field: '', header: 'Rate' },
      { field: '', header: 'Amount' },
      { field: '', header: 'C/NC' }
    ];

    this.DoSocietyAbstract = [
      { field: '', header: 'DO.NO' },
      { field: '', header: 'SOCIETY' },
      { field: '', header: 'TODATE' },
      { field: '', header: 'DUE' },
      { field: '', header: 'PAID' },
      { field: '', header: 'AdvanceCollection' },
      { field: '', header: 'DEBIT' }
    ];

    this.ReceiptROPurchaseReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Ackno', header: 'ACK.NO' },
      { field: 'Date', header: 'DATE' },
      { field: 'Type', header: 'TYPE '},
      { field: 'Depositor', header: 'DEPOSITOR' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Bags', header: 'BAGS' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'TruckMen', header: 'TRUCKMEN' },
      { field: 'Orderno', header: 'ORDER NO' },
      { field: 'Lorryno', header: 'LORRY NO' },
    ];

    this.ReceiptHOPurchaseReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Ackno', header: 'Ack. No' },
      { field: 'Date', header: 'DATE' },
      { field: 'Type', header: 'TYPE '},
      { field: 'Depositor', header: 'DEPOSITOR' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Bags', header: 'BAGS' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'TruckMen', header: 'TRUCKMEN' },
      { field: 'Orderno', header: 'ORDER NO' },
      { field: 'Lorryno', header: 'LORRY NO' },
    ];
    
    this.ReceiptRONOPurchaseReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Ackno', header: 'ACK.NO' },
      { field: 'Date', header: 'DATE' },
      { field: 'Type', header: 'TYPE '},
      { field: 'Depositor', header: 'DEPOSITOR' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Bags', header: 'BAGS' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'TruckMen', header: 'TRUCKMEN' },
      { field: 'Orderno', header: 'ORDER NO' },
      { field: 'Lorryno', header: 'LORRY NO' },
      { field: 'Scheme', header: 'Scheme' }
    ];

    this.DoDemandDraft = [
      { field: '', header: 'SOCIETY'},
      { field: '', header: 'DONO'},
      { field: '', header: 'DO DATE'},
      { field: '', header: 'DD.NO'},
      { field: '', header: 'DD DATE'},
      { field: '', header: 'BANK'},
      { field: '', header: 'AMOUNT'},
      { field: '', header: 'CEREAL'},
      { field: '', header: 'NON-CEREAL'}
    ];

    this.DoMarginAmount = [
      { field: '', header: 'SOCIETY'},
      { field: '', header: 'DONO'},
      { field: '', header: 'DO DATE'},
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Scheme', header: 'SCHEME' },
      { field: '', header: 'NET WEIGHT'},
      { field: '', header: 'RATE'},
      { field: '', header: 'AMOUNT'}
    ];

    this.SchemeAbstractReceipt = [
      { field: 'Commodity', header: 'COMMODITY' },
      { field: '', header: 'GODOWN'},
      { field: '', header: 'PType'},
      { field: '', header: 'AAY'},
      { field: '', header: 'BULK'},
      { field: '', header: 'EXCESS'},
      { field: '', header: 'HULLING'},
      { field: '', header: 'OTHERS'},
      { field: '', header: 'PDS'}
    ];

    this.SchemeAbstractIssueCRS = [
      { field: 'Commodity', header: 'COMMODITY' },
      { field: '', header: 'GODOWN'},
      { field: '', header: 'PType'},
      { field: '', header: 'AAY'},
      { field: '', header: 'OTHERS'},
      { field: '', header: 'PDS'},
      { field: '', header: 'POLICE'},
      { field: '', header: 'SPL PDS'},
      { field: '', header: 'TOTAL'}
    ];

    this.SchemeAbstractIssueAll = [
      { field: 'Commodity', header: 'COMMODITY' },
      { field: '', header: 'GODOWN'},
      { field: '', header: 'PType'},
      { field: '', header: 'AAY'},
      { field: '', header: 'BULK'},
      { field: '', header: 'OAP'},
      { field: '', header: 'OTHERS'},
      { field: '', header: 'PDS'},
      { field: '', header: 'POLICE'}
    ];

    this.SchemeAbstractIssueCoOp = [
      { field: 'Commodity', header: 'COMMODITY' },
      { field: '', header: 'GODOWN'},
      { field: '', header: 'PType'},
      { field: '', header: 'AAY'},
      { field: '', header: 'OAP'},
      { field: '', header: 'PDS'},
      { field: '', header: 'POLICE'},
      { field: '', header: 'SPL PDS'},
      { field: '', header: 'TOTAL'}
    ];

    this.SchemeAbstractTruck = [
      { field: 'Commodity', header: 'COMMODITY' },
      { field: '', header: 'GODOWN'},
      { field: '', header: 'PType'},
      { field: '', header: 'INTERNAL TRANSFER'},
      { field: '', header: 'TRANSFER'},
      { field: '', header: 'TOTAL'}
    ];
    this.StockReceiptDocumentViewCols = [
      { field: 'SRNo', header: 'SR No.' },
      { field: 'SRDate', header: 'SR Date' },
      { field: 'OrderNo', header: 'Order No.' },
      { field: 'OrderDate', header: 'Order Date' },
      { field: 'TNCSName', header: 'TNCSName' },
      { field: 'IssuerName', header: 'Issuer Name' },
      { field: 'CreatedDate', header: 'Created Date' }
    ];

    this.QtyReceiptCommodity = [
      { field: '', header: 'SNo' },
      { field: '', header: 'Commodity' },
      { field: '', header: 'Opening' },
      { field: '', header: 'PDS' },
      { field: '', header: 'BPL/Prio.' },
      { field: '', header: 'APL/Tideov.' },
      { field: '', header: 'AAY' },
      { field: '', header: 'MMS2GEN' },
      { field: '', header: 'MMS2SC' },
      { field: '', header: 'MMS2ST' },
      { field: '', header: 'SplPds' },
      { field: '', header: 'Cement' },
      { field: '', header: 'HO' },
      { field: '', header: 'Seizure' },
      { field: '', header: 'Total' },
      { field: '', header: 'PTNMGRNMP' },
      { field: '', header: 'SGRY' },
      { field: '', header: 'AnnaPoorna' },
      { field: '', header: 'Total' },
      { field: '', header: 'Free' },
      { field: '', header: 'Balance' },
      { field: '', header: 'PURCHASE' },
      { field: '', header: 'Purchase' },
      { field: '', header: 'Rice' }
    ];

    this.QtyIssueCommodity = [];

    this.QtyReceiptOtherItem = [];

    this.QtyIssueOtherItem = [];

    this.SocietyMaster = [
      { field: '', header: 'SOCIETYNAME'},
      { field: '', header: 'TYNAME'},
      { field: '', header: 'EFLAG'},
    ];

    this.ShopWiseAllotmentMaster = [
      { field: '', header: 'Name of the Institution'},
      { field: '', header: 'Commodity'},
      { field: '', header: 'Quantity Alloted'},
      { field: '', header: 'Month'},
      { field: '', header: 'Year'},
      { field: '', header: 'Item Code'},
    ];

    this.DepositorMaster = [
      { field: '', header: 'DEPOSITOR NAME'},
      { field: '', header: 'DEPOSITOR Type'},
      { field: '', header: 'STATUS'},
      
    ];

    this.SocietyMasterEntry = [
      { field: '', header: 'TYNAME'},
      { field: '', header: 'SOCIETYNAME'},
      { field: '', header: 'ISSUERNAME'},
    ];

    this.ItemMasterModification = [
      { field: '', header: 'CODE'},
      { field: '', header: 'ITEM NAME'},
      { field: '', header: 'GROUP'},
      { field: '', header: 'ACTIVE'},

    ];

    this.OpeningBalanceMasterEntry = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'ITDescription', header: 'ITEM DESCRIPTION'},
      { field: 'BookBalanceBags', header: 'BOOK BALANCE BAGS'},
      { field: 'BookBalanceWeight', header: 'BOOK BALANCE WEIGHT'},
      { field: 'PhysicalBalanceBags', header: 'PHYSICAL BALANCE BAGS'},
      { field: 'PhysicalBalanceWeight', header: 'PHYSICAL BALANCE WEIGHT'},
      { field: 'CumulativeShortage', header: 'CUMULATIVE SHORTAGE'}
    ];

    this.OpeningBalanceCurYearEntry = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'ITDescription', header: 'ITEM DESCRIPTION'},
      { field: 'BookBalanceBags', header: 'BOOK BALANCE BAGS'},
      { field: 'BookBalanceWeight', header: 'BOOK BALANCE WEIGHT'},
      { field: 'PhysicalBalanceBags', header: 'PHYSICAL BALANCE BAGS'},
      { field: 'PhysicalBalanceWeight', header: 'PHYSICAL BALANCE WEIGHT'},
      { field: 'CumulativeShortage', header: 'CUMULATIVE SHORTAGE'},
      { field: 'CurYear', header: 'CURRENT YEAR Pv SHORTAGE'}
    ]

    this.GodownCustomerList = [];

    this.StackCardClosingEntryReport = [];

    this.StackReceiptEntryReport = [
      { field: 'Id', header: 'ID' },
      { field: '', header: 'CHE/DD'},
      { field: '', header: 'CHE/DD No'},
      { field: '', header: 'Date'},
      { field: '', header: 'AMOUNT'},
      { field: '', header: 'BANK'},
      { field: '', header: 'TO WHOM'},
    ];

    this.TruckMemoItemDetails = [
      { header: 'Stack No.', field:'TStockNo' },
      { header: 'Item Description', field:'ITDescription' },
      { header: 'Packing Type', field:'PackingType' },
      { header: 'No. of packing', field:'NoPacking' },
      { header: 'Wmt Type', field:'WmtType' },
      { header: 'Gross Wt', field:'GKgs' },
      { header: 'Net Wt', field:'Nkgs' },
      { header: 'Moisture', field:'Moisture' },
      { header: 'Scheme', field:'SchemeName' }
    ];
     
    this.TruckMemoViewDocumentCols = [
    {field: 'STNo', header: 'Truck Memo No' },
    { field: 'STDate', header: 'Truck Memo Date' },
    { field: 'MNo', header: 'Movement Order No' },
    { field: 'RNo', header: 'Release Order No' },
    { field: 'ReceivorName', header: 'Receivor Name'}
    ];

    this.StockStatementReport = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { header: 'Commodity', field: 'ITDescription' },
      { header: 'OB', field: 'OpeningBalance', align: 'right' },
      { header: 'Receipt', field: 'Receipt' },
      { header: 'Total (OB + Receipt)', field: 'TotalReceipt' },
      // --Future purpose--
      // { header: 'Sales', field: 'IssueSales', },
      // { header: 'Other Issue', field: 'IssueOthers' },
      { header: 'Total Issue', field: 'TotalIssue' },
      { header: 'Closing Balance', field: 'ClosingBalance' },
      { header: 'Cumulative Shortage', field: 'CSBalance' },
      { header: 'Current CS', field: 'Shortage' },
      { header: 'Physical Balance', field: 'PhycialBalance' },
    ];

    this.TransactionStatus = [
      // { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Docdate', header: 'Document Date'},
      { field: 'Receipt', header: 'Receipt'},
      { field: 'Issues', header: 'Issues'},
      { field: 'Transfer', header: 'Transfer'},
      { field: 'CB', header: 'CB'},
      { field: 'Approvaldate', header: 'Approval Date'},
      // { field: 'lastupdated', header: 'Last Updated'},
      { field: 'remarks', header: 'Remarks'},
      { field: 'userid', header: 'Username'},
    ];

    this.DailyDocumentTotalReport = [
      { field: 'NoDocument', header: 'No of Documents' },
      { field: 'RCode', header: 'Region Code' },
      { field: 'RName', header: 'Region Name' },
      { field: 'GCode', header: 'Godown Code' },
      { field: 'GName', header: 'Godown Name' }
    ];

    this.DailyDocumentReceipt = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'DocNo', header: 'Doc No' },
      { field: 'DocDate', header: 'Doc_Date' },
      { field: 'Transactiontype', header: 'Transaction Type' },
      { field: 'StackNo', header: 'Stack No' },
      { field: 'CommodityName', header: 'Commodity Name' },
      { field: 'PackingType', header: 'Packing type' },
      { field: 'NOOfPACKING', header: 'No Of Packing' },
      { field: 'GROSSWT', header: 'Gross Wt' },
      { field: 'NETWT', header: 'Net Wt' },
      { field: 'Moisture', header: 'Moisture' },
      { field: 'SCHEME', header: 'Scheme' },
      { field: 'PERIODALLOT', header: 'Period Allotment' },
      { field: 'OrderNo', header: 'Order No' },
      { field: 'ORDERDate', header: 'Order Date' },
      { field: 'ReceivedFrom', header: 'Received From' },
      { field: 'TruckMemoNo', header: 'Truck Memo No' },
      { field: 'TRUCKDate', header: 'Truck Date' },
    ];

    this.DailyDocumentIssue = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'DocNo', header: 'Doc No' },
      { field: 'DocDate', header: 'Doc Date' },
      { field: 'StackNo', header: 'Stack No' },
      { field: 'TransactionType', header: 'Transaction Type' },
      { field: 'CommodityName', header: 'Commodity Name' },
      { field: 'PackingType', header: 'Packing type' },
      { field: 'NOOfPACKING', header: 'No of Packing/Bags' },
      { field: 'GROSSWT', header: 'Gross Wt' },
      { field: 'NETWT', header: 'Net Wt' },
      { field: 'SCHEME', header: 'Scheme' },
      { field: 'ReceivedFrom', header: 'Issued To' },
    ];

    this.StackCardOpening = [
      { field: 'SlNo', header: 'SlNo' },
      { field: 'Stackno', header: 'Stack No' },
      { field: 'StackBalanceBags', header: 'Bags' },
      { field: 'Stackbalanceweight', header: 'Quantity' },
      { field: 'obstackdate', header: 'From Date' },
      { field: 'Formationyear', header: 'Formation Year' },
      { field: 'Status', header: 'Status' },
    ];

    this.StackCard = [
      { field: 'obstackdate', header: 'Date' },
      { field: 'StackBalanceBags', header: 'Bags' },
      { field: 'Stackbalanceweight', header: 'Quantity' },
      { field: 'StackBalanceBags', header: 'Bags' },
      { field: 'Stackbalanceweight', header: 'Quantity' },
      { field: '', header: 'Closing Balance' },
    ];

    this.PackingMaster = [
      { field: '', header: 'Packing Name' },
      { field: '', header: 'Net Weight' },
      { field: '', header: 'Unit of Measure'}
    ];

    this.CommodityMaster = [
      { field: '', header: 'Commodity Name' },
      { field: '', header: 'Unit of Measure'},
      { field: '', header: 'Tax' },
      { field: '', header: 'Major Commodity Name' },
    ];

    this.OtherMaster = [];
    
    this.CncCorrection = [
      { field: '', header: 'Code' },
      { field: '', header: 'Item Name' },
      { field: '', header: 'Group' },
      { field: '', header: 'CER.N/CER' }
    ];
  }
}