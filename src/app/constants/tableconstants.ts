
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
  NotificationCols: any;
  NotificationPopup: any;
  SchemeData: any;
  TenderDetailsCols: any;
  CBStatementColumns: any;
  DeliveryDocumentcolumns: any;
  DeliveryDocumentViewCols: any;
  DeliveryItemColumns: any;
  DeliveryItemSchemeColumns: any;
  DeliveryPaymentcolumns: any;
  DeliveryPaymentBalanceCols: any;
  StockReceiptRegisterReport: any;
  StockIssueRegisterReport: any;
  TruckMemoRegisterReport: any;
  DeliveryMemoRegisterReport: any;
  RemarksReceiptReport: any;
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
  DDChequeEntryCols: any;
  StackWiseBreakupDetails: any;
  SchemeWiseBreakupDetails: any;
  TruckTransit: any;
  StockReceiptItemColumns: any;
  StockIssueMemoIssueDetailsColumns: any;
  StockIssueMemoItemDetailsColumns: any;
  DoAllScheme: any;
  DoSPLPDS: any;
  DoOAP: any;
  DoAnnaPoorna: any;
  DoOtherScheme: any;
  DoSocietyAbstract: any;
  ReceiptROPurchaseReport: any;
  ReceiptHOPurchaseReport: any;
  ReceiptRONOPurchaseReport: any;
  StockReceiptDocumentViewCols: any;
  DoDemandDraft: any;
  DoMarginAmount: any;
  SocietyMaster: any;
  ShopWiseAllotmentMaster: any;
  TruckMemoItemDetails: any;
  SocietyMasterEntry: any;
  ItemMasterModification: any;
  GodownCustomerList: any;
  OpeningBalanceMasterEntry: any;
  StockStatementReport: any;
  StockLedgerReport: any;
  TransactionStatus: any;
  OpeningBalanceCurYearEntry: any;
  DailyDocumentTotalReport: any;
  DailyDocumentReceiptReport: any;
  DetailDailyDocumentReceiptReport: any;
  DailyDocumentIssueReport: any;
  DetailDailyDocumentIssueReport: any;
  DailyDocumentTruckReport: any;
  DetailDailyDocumentTruckReport: any;
  StockIssueMemoViewBySINOCols: any;
  StackCardOpening: any;
  StackCard: any;
  PackingMaster: any;
  CommodityMaster: any;
  OtherMaster: any;
  CncCorrection: any;
  TruckMemoViewDocumentCols: any;
  godownProfile: any;
  KeroseneSuppliers: any;
  KeroseneRegionalSuppliers: any;
  DepositorMaster: any;
  CustomerMaster: any;
  SchemeCommodity: any;
  EmployeeMaster: any;
  SocietyMasterNewEntry: any;
  IssuerMaster: any;
  ChequeReceiptNoCols: any;
  CashReceiptRegister: any;
  IssueMemoCustomerDetail: any;
  IssueMemoAbstract: any;
  DemandDraftDetailsReportCols: any;
  StackCardRegister: any;
  QuantityACReceiptDetailsCommodity: any;
  FrozenQuantityACReceiptDetailsCommodity: any;
  FrozenQuantityACIssueDetailsCommodity: any;
  FrozenQuantityACGunnyIssueDetails: any;
  FrozenQuantityACGunnyReceiptDetails: any;
  StackCardRegisterReport: any;
  CashReceiptRegCols: any;
  CorrectionSlipReport: any;
  OWSReport: any;
  DocumentCorrectionColumns: any;
  DocumentCorrectionApproveColumns: any;
  OBStackDetails: any;
  StackCardClosing: any;
  PartyLedgerMaster: any;
  PurchaseTaxEntry: any;
  SalesTaxEntry: any;
  TenderAllotmentDetailsCols: any[];
  TenderAllotmentToRegionCols: any[];
  TenderQuantityCols: any[];
  ServiceProviderEntry: any;
  TenderAllotmentToGodownCols: any[];
  AllotmentIssueQuantity: any;
  AllotmentIssueQuantityAbstract: any;
  ProcessToG2GIssueCols: any[];
  ProcessToG2GCols: any[];
  QuantityACIssueDetailsCommodity: any[];
  QuantityACGunnyIssueDetails: any[];
  QuantityACGunnyReceiptDetails: any[];
  PartyName: any;
  GSTCommodityName: any;
  StackCardDocDetailsCols: any[];
  IssuerPartyCols: any;
  AllotmentDetailsCols: any;
  SectionDailyStatementReportColumns: any;
  LoadMenWagesLoadingReportColumns: any;
  LoadMenWagesUnLoadingReportColumns: any;
  ProcessToGPSCols: any;
  IssueMemoLorryAbstractColumns: any;
  StackCardMaster: any;
  RunningStackCardDetailsCols: any;
  GodownEmployeeCols: any;
  InceptionCols: any;
  CommodityReceiptReport: any;
  InceptionDetailsColumns: any;

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
      { field: 'AcsCode', header: 'AcsCode' }
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
      { field: 'Tyname', header: 'Depositor Type' },
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
    ];

    this.NotificationCols = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Notes', header: 'Description' },
      { field: 'Reason', header: 'Reason' }
    ];

    this.NotificationPopup = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Notes', header: 'Description' },
      { field: 'Reason', header: 'Reason' },
      { field: 'ImageName', header: 'Image' }
    ];

    this.TenderDetailsCols = [
      { field: 'SlNo', header: 'S.No.' },
      { field: 'TenderId', header: 'Tender ID' },
      { field: 'TenderDate', header: 'Tender Date' },
      { field: 'CompletedDate', header: 'Completed Date' },
      { field: 'OrderNumber', header: 'Order Number' },
      { field: 'OrderDate', header: 'Order Date' },
      { field: 'ITName', header: 'Commodity' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'AdditionalQty', header: 'Additional Quantity' },
      { field: 'Remarks', header: 'Remarks' }];

    this.TenderAllotmentDetailsCols = [
      { field: 'SlNo', header: 'S.No.' },
      { field: 'OrderNumber', header: 'Order Number' },
      //  { field: 'OrderDate', header: 'Order Date' },
      { field: 'PartyRegion', header: 'Party Region' },
      { field: 'PartyName', header: 'Party Name' },
      { field: 'SpellName', header: 'Spell' },
      { field: 'TargetDate', header: 'Target Date' },
      { field: 'TotalDays', header: 'Total Days' },
      { field: 'AssignedQty', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Remarks', header: 'Remarks' }];

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
      { field: 'cement', header: 'CEMENT' },
      { field: 'GStatus', header: 'Godown Approval Status' },
      { field: 'GRemarks', header: 'Godown Remarks' },
      { field: 'RStatus', header: 'Regional Approval Status' },
      { field: 'RRemarks', header: 'Region Remarks' }
    ]

    this.DeliveryDocumentcolumns = [
      { field: 'Dono', header: 'Delivery Order' },
      { field: 'DoDate', header: 'Delivery Date' },
      { field: 'Issuername', header: 'Society' },
      { field: 'GrandTotal', header: 'Due' },
      { field: 'PaymentAmount', header: 'Paid' },
      { field: 'AdvCollection', header: 'Advance Collection' },
      { field: 'Debit', header: 'Debit' },
    ]

    this.DeliveryItemColumns = [
      { field: 'sno', header: 'S.No:' },
      { field: 'ITDescription', header: 'IT Description' },
      { field: 'NetWeight', header: 'Net Weight' },
      { field: 'SchemeName', header: 'Scheme' },
      { field: 'Wtype', header: 'Unit Measure' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Total', header: 'Total' },
    ]

    this.DeliveryItemSchemeColumns = [
      { field: 'sno', header: 'S.No:' },
      { field: 'SchemeName', header: 'Scheme Name' },
      { field: 'ITDescription', header: 'Item Name' },
      { field: 'MarginNkgs', header: 'Net Weight' },
      { field: 'MarginWtype', header: 'Rate In Terms' },
      { field: 'MarginRate', header: 'Margin Rate' },
      { field: 'MarginAmount', header: 'Margin Amount' },
    ];

    this.DeliveryPaymentcolumns = [
      { field: 'sno', header: 'S.No:' },
      { field: 'PaymentMode', header: 'Payment Mode' },
      { field: 'ChequeNo', header: 'CH/DD/PO No' },
      { field: 'ChequeDate', header: 'CH/DD/PO Date' },
      { field: 'PaymentAmount', header: 'Payment Amt' },
      { field: 'payableat', header: 'Payable At' },
      { field: 'bank', header: 'Bank' },
    ]

    this.DeliveryPaymentBalanceCols = [
      { field: 'sno', header: 'S.No:' },
      { field: 'AdjustedDoNo', header: 'Previous DO' },
      { field: 'AdjustedDate', header: 'DO Date' },
      { field: 'Amount', header: 'Adj. Amt' },
      { field: 'AdjustmentType', header: 'Adj. Type' },
      { field: 'AmountNowAdjusted', header: 'Amt. Now Adj' },
      { field: 'Balance', header: 'Balance' }
    ];

    this.StockReceiptRegisterReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Ackno', header: 'ACK.No' },
      { field: 'Godownname', header: 'Godown Name' },
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
      { field: 'Godownname', header: 'Godown Name' },
      { field: 'DNo', header: 'Do No' },
      { field: 'Issue_Date', header: 'Date' },
      { field: 'Lorryno', header: 'Lorry No' },
      { field: 'To_Whom_Issued', header: 'To Whom Issued' },
      { field: 'Stackno', header: 'Stack No' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'NoPacking', header: 'No Packing' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'NetWt', header: 'Net Wt' },
      { field: 'ACSCode', header: 'ACSCode' }
    ];

    this.TruckMemoRegisterReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Truck_Memono', header: 'Truck Memo No' },
      { field: 'Godownname', header: 'Godown Name' },
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
      { field: 'Godown', header: 'Godown Name' },
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
      { field: 'PreviousAmount', header: 'Previous Balance' },
      { field: 'Adjusted', header: 'Other Amount' },
      { field: 'Balance', header: 'Current Balance' },
      { field: 'MarginAmount', header: 'Margin Amount' }
    ];

    this.CommodityReceiptReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Region', header: 'Region Name' },
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
      { field: 'NoPacking', header: 'BAGS' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'Issuedto', header: 'ISSUED TO' }
    ];

    this.WriteoffReport = [
      { field: 'SlNo', header: 'S.No', width: '15px' },
      { field: 'Godownname', header: 'GODOWN', width: '60px' },
      { field: 'Issue_Date', header: 'DATE', width: '35px' },
      { field: 'Issueno', header: 'ISSUE NO', width: '35px' },
      { field: 'Commodity', header: 'COMMODITY', width: '50px' },
      { field: 'NetWt', header: 'QUANTITY', width: '35px' },
      { field: 'Stackno', header: 'STACK NO', width: '40px' },
      { field: 'remarks', header: 'REMARKS', width: '100px' }
    ];

    this.HullingDetailsReport = [
      { field: 'SlNo', header: 'S.No', width: '15px' },
      { field: 'SRNo', header: 'Ack. No', width: '25px' },
      { field: 'SRDate', header: 'Date', width: '35px' },
      { field: 'ITDescription', header: 'Commodity', width: '50px' },
      { field: 'DepositorName', header: 'Depositor', width: '80px' },
      { field: 'NoPacking', header: 'Bags', width: '25px' },
      { field: 'Nkgs', header: 'Quantity', width: '35px' }
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
      { field: 'Godownname', header: 'Godown Name' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Bags', header: 'BAGS' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'stackno', header: 'STACK NO' },
      { field: 'Year', header: 'S.YEAR' }
    ];

    this.StackCardOpeningEntryReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'CommodityName', header: 'Commodity' },
      { field: 'StackNo', header: 'Stack No' },
      { field: 'StackBalanceBags', header: 'Bags' },
      { field: 'StackBalanceWeight', header: 'Weight' },
      { field: 'ObStackDate', header: 'From Date' },
      { field: 'clstackdate', header: 'To Date' },
      { field: 'CurYear', header: 'Formation Year' },
      { field: 'Flag1', header: 'Status' },
    ];

    this.StackWiseBreakupDetails = [
      { field: 'Stackno', header: 'Stack No' },
      { field: 'bags', header: 'Bags' },
      { field: 'Weight', header: 'Weight' }
    ];

    this.SchemeWiseBreakupDetails = [
      { field: 'Stackno', header: 'Stack No' },
      { field: 'bags', header: 'Bags' },
      { field: 'Weight', header: 'Weight' },
      { field: 'Scheme', header: 'Scheme' }
    ];

    this.TruckTransit = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'STNo', header: 'Truck Memo No' },
      { field: 'STDate', header: 'Sender Date' },
      { field: 'Region', header: 'Region' },
      { field: 'TNCSName', header: 'Sender Godown' },
      { field: 'ITDescription', header: 'Issuer Commodity' },
      { field: 'LNo', header: 'Lorry No' },
      { field: 'NoPacking', header: 'Bags' },
      { field: 'Nkgs', header: 'Quantity' },
      { field: 'ACKNO', header: 'AckNo' },
      { field: 'STDate', header: 'Receiver Date' },
      { field: 'DepositorName', header: 'Receiver Godown' },
      { field: 'ITDescription', header: 'Receiver Commodity' },
      { field: 'NoPacking', header: 'Bags Received' },
      { field: 'Nkgs', header: 'Received Quantity' },
      { field: 'Transfertype', header: 'Transfer Type' }
    ];

    this.StockReceiptItemColumns = [
      { field: 'sno', header: 'SI.No.' },
      { field: 'TStockNo', header: 'Stack No.' },
      { field: 'SchemeName', header: 'Scheme' },
      { field: 'CommodityName', header: 'Item Description' },
      { field: 'PackingName', header: 'Packing Type' },
      { field: 'NoPacking', header: 'No. of packing' },
      { field: 'GKgs', header: 'Gross Wt' },
      { field: 'Nkgs', header: 'Net WT' },
      { field: 'Moisture', header: 'Moisture' },
      { field: 'WmtType', header: 'Wmt Type' },
      // { field: 'icon', header: 'Action'}
    ];

    this.StockIssueMemoViewBySINOCols = [
      { field: 'sno', header: 'S.No:' },
      { field: 'SINo', header: 'Issue Memo No' },
      { field: 'SIDate', header: 'Issue Memo Date' },
      { field: 'DNo', header: 'Delivery Order No' },
      { field: 'DDate', header: 'Delivery Order' },
      { field: 'IssuerName', header: 'Issuer Name' },
      { field: 'ReceivorName', header: 'Receivor Name' },
    ];

    this.StockIssueMemoIssueDetailsColumns = [
      { field: 'DNo', header: 'Do No.' },
      { field: 'DeliveryOrderDate', header: 'Do Date' },
      { field: 'SINo', header: 'SI No.' },
      { field: 'IssueMemoDate', header: 'SI Date' }];

    this.StockIssueMemoItemDetailsColumns = [
      { field: 'sno', header: 'S.No:' },
      { field: 'TStockNo', header: 'Stack No.' },
      { field: 'SchemeName', header: 'Scheme' },
      { field: 'CommodityName', header: 'Item Description' },
      { field: 'PackingName', header: 'Packing Type' },
      { field: 'NoPacking', header: 'No. of packing' },
      { field: 'GKgs', header: 'Gross Wt' },
      { field: 'Nkgs', header: 'Net WT' },
      { field: 'Moisture', header: 'Moisture' },
      { field: 'WmtType', header: 'Wmt Type' },
    ];

    this.DoAllScheme = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Dono', header: 'Do.No' },
      { field: 'Dodate', header: 'Date' },
      { field: 'Tyname', header: 'Type' },
      { field: 'Coop', header: 'Co_op' },
      { field: 'Comodity', header: 'Commodity' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Amount', header: 'Amount' },
      { field: 'C_Nc', header: 'C/NC' }
    ];

    this.DoSPLPDS = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Dono', header: 'Do.No' },
      { field: 'Dodate', header: 'Date' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'Tyname', header: 'Type' },
      { field: 'Coop', header: 'Co_op' },
      { field: 'Comodity', header: 'Commodity' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Amount', header: 'Amount' },
      { field: 'C_Nc', header: 'C/NC' }
    ];

    this.DoOAP = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Dono', header: 'Do.No' },
      { field: 'Dodate', header: 'Date' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'Tyname', header: 'Type' },
      { field: 'Coop', header: 'Co_op' },
      { field: 'Comodity', header: 'Commodity' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Amount', header: 'Amount' },
      { field: 'C_Nc', header: 'C/NC' }
    ];

    this.DoAnnaPoorna = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Dono', header: 'Do.No' },
      { field: 'Dodate', header: 'Date' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'Tyname', header: 'Type' },
      { field: 'Coop', header: 'Co_op' },
      { field: 'Comodity', header: 'Commodity' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Amount', header: 'Amount' },
      { field: 'C_Nc', header: 'C/NC' }
    ];

    this.DoOtherScheme = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Dono', header: 'Do.No' },
      { field: 'Dodate', header: 'Date' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'Tyname', header: 'Type' },
      { field: 'Coop', header: 'Co_op' },
      { field: 'Comodity', header: 'Commodity' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Amount', header: 'Amount' },
      { field: 'C_Nc', header: 'C/NC' }
    ];

    this.DoSocietyAbstract = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Dono', header: 'DO.NO' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'issuername', header: 'SOCIETY' },
      { field: 'DoDate', header: 'TODATE' },
      { field: 'Due', header: 'DUE' },
      { field: 'Paid', header: 'PAID' },
      // { field: 'Pending', header: 'PENDING' },
      { field: 'AdvanceCollection', header: 'AdvanceCollection' },
      { field: 'Debit', header: 'DEBIT' }
    ];

    this.ReceiptROPurchaseReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Ackno', header: 'ACK.NO' },
      { field: 'Godownname', header: 'Godown Name' },
      { field: 'Date', header: 'DATE' },
      { field: 'Type', header: 'TYPE ' },
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
      { field: 'Ackno', header: 'Ack No' },
      { field: 'Godownname', header: 'Godown Name' },
      { field: 'Date', header: 'Date' },
      { field: 'Type', header: 'Type' },
      { field: 'Depositor', header: 'Depositor' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'Bags', header: 'Bags' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'TruckMen', header: 'Truckmen' },
      { field: 'Orderno', header: 'Order No' },
      { field: 'Lorryno', header: 'Lorry No' },
    ];

    this.ReceiptRONOPurchaseReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Ackno', header: 'ACK.NO' },
      { field: 'Godownname', header: 'Godown Name' },
      { field: 'Date', header: 'DATE' },
      { field: 'Tyname', header: 'TYPE ' },
      { field: 'Depositor', header: 'DEPOSITOR' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Bags', header: 'BAGS' },
      { field: 'NetWeight', header: 'QUANTITY' },
      { field: 'TruckMemoNo', header: 'TRUCKMEN' },
      { field: 'OrderNo', header: 'ORDER NO' },
      { field: 'Lorryno', header: 'LORRY NO' },
      { field: 'Scheme', header: 'Scheme' }
    ];

    this.DoDemandDraft = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Society', header: 'SOCIETY' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'Dono', header: 'DONO' },
      { field: 'Dodate', header: 'DO DATE' },
      { field: 'Chequeno', header: 'DD.NO' },
      { field: 'Chequedate', header: 'DD DATE' },
      { field: 'Bank', header: 'BANK' },
      { field: 'PaymentAmount', header: 'AMOUNT' },
      { field: 'Cereal', header: 'CEREAL' },
      { field: 'NonCereal', header: 'NON-CEREAL' }
    ];

    this.DoMarginAmount = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Coop', header: 'Society' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'Dono', header: 'DONO' },
      { field: 'Dodate', header: 'DO DATE' },
      { field: 'Comodity', header: 'Commodity' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Quantity', header: 'Net Wt' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Amount', header: 'Amount' }
    ];

    this.StockReceiptDocumentViewCols = [
      { field: 'sno', header: 'S.No:' },
      { field: 'SRNo', header: 'SR No.' },
      { field: 'SRDate', header: 'SR Date' },
      { field: 'OrderNo', header: 'Order No.' },
      { field: 'OrderDate', header: 'Order Date' },
      { field: 'TNCSName', header: 'TNCSName' },
      { field: 'IssuerName', header: 'Issuer Name' },
      { field: 'CreatedDate', header: 'Created Date' }
    ];

    this.SocietyMaster = [
      { field: 'SlNo', header: 'S.No', width: '40px' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'Tyname', header: 'Type Name' },
      { field: 'SocietyName', header: 'Society Name' },
      { field: 'SocietyType', header: 'Society Type' },
      { field: 'SocietyCode', header: 'Society Code' },
      { field: 'Issuername', header: 'Issuer Name' },
    ];

    this.ShopWiseAllotmentMaster = [
      { field: '', header: 'Name of the Institution' },
      { field: '', header: 'Commodity' },
      { field: '', header: 'Quantity Alloted' },
      { field: '', header: 'Month' },
      { field: '', header: 'Year' },
      { field: '', header: 'Item Code' },
    ];

    this.SocietyMasterEntry = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Tyname', header: 'Type Name' },
      { field: 'Societyname', header: 'Society Name' },
      { field: 'Issuername', header: 'Issuer Name' },
    ];

    this.SocietyMasterNewEntry = [
      { header: 'S.No', field: 'Sno', width: '40px' },
      { field: 'Societyname', header: 'Society Name' },
      { field: 'Tyname', header: 'Type Name' },
      { field: 'Eflag', header: 'EFlag' },
    ];

    this.ItemMasterModification = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'ITCode', header: 'Code' },
      { field: 'ITDescription', header: 'Item Name' },
      // { field: 'GRName', header: 'GROUP' },
      { field: 'ItemType', header: 'Item Type' },
      { field: 'Activeflag', header: 'Status' }

    ];

    this.OpeningBalanceMasterEntry = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'ITDescription', header: 'ITEM DESCRIPTION' },
      { field: 'BookBalanceBags', header: 'BOOK BALANCE BAGS' },
      { field: 'BookBalanceWeight', header: 'BOOK BALANCE WEIGHT' },
      { field: 'PhysicalBalanceBags', header: 'PHYSICAL BALANCE BAGS' },
      { field: 'PhysicalBalanceWeight', header: 'PHYSICAL BALANCE WEIGHT' },
      { field: 'CumulitiveShortage', header: 'CUMULATIVE SHORTAGE' },
      { field: 'ObDate', header: 'OB Date' }
    ];

    this.OpeningBalanceCurYearEntry = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'ITDescription', header: 'ITEM DESCRIPTION' },
      { field: 'BookBalanceBags', header: 'BOOK BALANCE BAGS' },
      { field: 'BookBalanceWeight', header: 'BOOK BALANCE WEIGHT' },
      { field: 'PhysicalBalanceBags', header: 'PHYSICAL BALANCE BAGS' },
      { field: 'PhysicalBalanceWeight', header: 'PHYSICAL BALANCE WEIGHT' },
      { field: 'CumulativeShortage', header: 'CUMULATIVE SHORTAGE' },
      { field: 'CurYear', header: 'CURRENT YEAR Pv SHORTAGE' }
    ]

    this.GodownCustomerList = [];

    this.StackCardClosingEntryReport = [];

    this.DDChequeEntryCols = [
      { field: 'SNo', header: 'S.No.' },
      { field: 'Payment', header: 'CHE/DD' },
      { field: 'ChequeNo', header: 'CHE/DD No' },
      { field: 'ChDate', header: 'Date' },
      { field: 'Amount', header: 'AMOUNT' },
      { field: 'Bank', header: 'BANK' },
      { field: 'ReceivedFrom', header: 'TO WHOM' },
    ];

    this.ChequeReceiptNoCols = [
      { field: 'SNo', header: 'SI.No.' },
      { field: 'receiptNo', header: 'Receipt No' },
      { field: 'receivedFrom', header: 'Whom Received' },
    ];

    this.TruckMemoItemDetails = [
      { field: 'sno', header: 'SI.No.' },
      { header: 'Stack No.', field: 'TStockNo' },
      { header: 'Scheme', field: 'SchemeName' },
      { header: 'Item Description', field: 'ITDescription' },
      { header: 'Packing Type', field: 'PackingType' },
      { header: 'No. of packing', field: 'NoPacking' },
      { header: 'Gross Wt', field: 'GKgs' },
      { header: 'Net Wt', field: 'Nkgs' },
      { header: 'Moisture', field: 'Moisture' },
      { header: 'Wmt Type', field: 'WmtType' },
    ];

    this.TruckMemoViewDocumentCols = [
      { field: 'sno', header: 'S.No:' },
      { field: 'STNo', header: 'Truck Memo No' },
      { field: 'STDate', header: 'Truck Memo Date' },
      { field: 'MNo', header: 'Movement Order No' },
      { field: 'RNo', header: 'Release Order No' },
      { field: 'ReceivorName', header: 'Receivor Name' }
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
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'TransactionDate', header: 'Document Date' },
      { field: 'Receipt', header: 'Receipt' },
      { field: 'Issues', header: 'Issues' },
      { field: 'Transfer', header: 'Transfer' },
      { field: 'ClosingBalance', header: 'CB' },
      { field: 'ApprovalDate', header: 'Approved Date' },
      // { field: 'lastupdated', header: 'Last Updated'},
      { field: 'Status', header: 'Regional Status' },
      { field: 'UserId', header: 'Username' },
    ];

    this.DailyDocumentTotalReport = [
      { field: 'NoDocument', header: 'No of Documents' },
      { field: 'RCode', header: 'Region Code' },
      { field: 'RName', header: 'Region Name' },
      { field: 'GCode', header: 'Godown Code' },
      { field: 'GName', header: 'Godown Name' }
    ];

    this.DailyDocumentReceiptReport = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'DocNo', header: 'Doc No' },
      { field: 'DocDate', header: 'Doc_Date' },
      { field: 'Transactiontype', header: 'Transaction Type' },
      { field: 'ReceivedFrom', header: 'Received From' },
      { field: 'SRTime', header: 'Created Date' }
    ];

    this.DetailDailyDocumentReceiptReport = [
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
      { field: 'SRTime', header: 'Created Date' }
    ];


    this.DailyDocumentIssueReport = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'DocNo', header: 'Doc No' },
      { field: 'DocDate', header: 'Doc Date' },
      { field: 'TransactionType', header: 'Transaction Type' },
      { field: 'ReceivedFrom', header: 'Issued To' },
      { field: 'SITime', header: 'Created Date' }
    ];

    this.DetailDailyDocumentIssueReport = [
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
      { field: 'SITime', header: 'Created Date' }
    ];

    this.DailyDocumentTruckReport = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'DocNo', header: 'Doc No' },
      { field: 'DocDate', header: 'Doc Date' },
      { field: 'TransactionType', header: 'Transaction Type' },
      { field: 'ReceivedFrom', header: 'Issued To' },
      { field: 'STTime', header: 'Created Date' }
    ];

    this.DetailDailyDocumentTruckReport = [
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
      { field: 'STTime', header: 'Created Date' }
    ];


    this.StackCardOpening = [
      { field: 'SlNo', header: 'S.No.', width: '8px' },
      { field: 'Stackno', header: 'Stack No', width: '30px' },
      { field: 'StackBalanceBags', header: 'Bags', width: '20px' },
      { field: 'Stackbalanceweight', header: 'Quantity', width: '30px' },
      { field: 'obstackdate', header: 'From Date', width: '25px' },
      { field: 'Formationyear', header: 'Formation Year', width: '18px' },
      { field: 'Status', header: 'Status', width: '15px' },
    ];

    this.StackCard = [
      { field: 'SlNo', header: 'S.No.', width: '8px' },
      { field: 'AckDate', header: 'Date', width: '25px' },
      { field: 'ReceiptBags', header: 'Bags', width: '20px' },
      { field: 'ReceiptQuantity', header: 'Quantity', width: '30px' },
      { field: 'IssuesBags', header: 'Bags', width: '20px' },
      { field: 'IssuesQuantity', header: 'Quantity', width: '30px' },
      { field: 'ClosingBalance', header: 'Closing Balance', width: '30px' },
    ];

    this.PackingMaster = [
      { field: '', header: 'Packing Name' },
      { field: '', header: 'Net Weight' },
      { field: '', header: 'Unit of Measure' }
    ];

    this.CommodityMaster = [
      { field: '', header: 'Commodity Name' },
      { field: '', header: 'Unit of Measure' },
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

    this.DeliveryDocumentViewCols = [
      { field: 'sno', header: 'S.No:' },
      { field: 'Dono', header: 'Delivery Order No' },
      { field: 'DoDate', header: 'Delivery Order Date' },
      { field: 'TRName', header: 'Transaction Name' },
      { field: 'Tyname', header: 'Receivor Type' },
      { field: 'ReceivorName', header: 'Party Name' }
    ];

    this.godownProfile = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'GNAME', header: 'Incharge Name' },
      { field: 'GodownCode', header: 'Godown Code' },
      { field: 'DESIG', header: 'Designation' },
      { field: 'ADD1', header: 'Address1' },
      { field: 'ADD2', header: 'Address2' },
      { field: 'MailID', header: 'Address3' },
      { field: 'TELNO', header: 'Telephone No' },
      { field: 'MOBNO', header: 'Mobile No' },
      { field: 'FAXNO', header: 'Fax No' },
    ];

    this.KeroseneSuppliers = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'SupplierCode', header: 'Supplier Code' },
      { field: 'SupplierName', header: 'Supplier Name' },
    ];

    this.KeroseneRegionalSuppliers = [];

    this.DepositorMaster = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: '', header: 'DEPOSITOR NAME' },
      { field: '', header: 'DEPOSITOR Type' },
      { field: '', header: 'STATUS' },
    ];

    this.SchemeCommodity = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'SchemeName', header: 'Scheme Name' },
      { field: 'CommodityName', header: 'Commodity Name' },
    ];

    this.EmployeeMaster = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Empno', header: 'Employee No' },
      { field: 'FPFNO', header: 'FPFNO' },
      { field: 'Empname', header: 'Employee Name' },
      { field: 'DesignationName', header: 'Designation' },
      { field: 'Gender', header: 'Gender' },
      { field: 'DOB', header: 'DOB' },
      { field: 'FatherName', header: 'Father Name' },
      { field: 'UANNO', header: 'UAN NO' },
      // { field: 'RefNo', header: 'RefNo' },
      // { field: 'RefDate', header: 'RefDate' },
      // { field: 'JRTYPE', header: 'JRTYPE' },
      // { field: 'JRDate', header: 'JRDate' },
    ];

    this.GodownEmployeeCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'Empno', header: 'Employee No' },
      { field: 'EmpName', header: 'Employee Name' },
      { field: 'DesignationName', header: 'Designation' },
      { field: 'RefNo', header: 'Reference No' },
      { field: 'RefDate', header: 'Reference Date' },
      { field: 'JRTYPE', header: 'J/R TYPE' },
      { field: 'JRDate', header: 'Join Date' },
      { field: 'RDate', header: 'Releive Date' }
    ];

    this.IssuerMaster = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'IssuerNo', header: 'Issuer No' },
      { field: 'IssuerCode', header: 'Issuer Code' },
      { field: 'Tyname', header: 'Type Name' },
      { field: 'SocietyName', header: 'Society Name' },
      { field: 'Issuername', header: 'Issuer Name' },
      { field: 'CategoryName', header: 'OWS - Category' },
      { field: 'Beneficiaries', header: 'No.of Beneficiary' },
      { field: 'ACSCode', header: 'Acs Code' },
      { field: 'Activeflag', header: 'Active' },
      // { header: 'Save'}
    ];

    this.CashReceiptRegister = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: '', header: 'REC. No' },
      { field: '', header: 'Date' },
      { field: '', header: 'From Whom Received' },
      { field: '', header: 'DD/CH' },
      { field: '', header: 'DD Date' },
      { field: '', header: 'DD Amount' },
      { field: '', header: 'Bank' },
    ];

    this.IssueMemoCustomerDetail = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Ackno', header: 'Iss. No' },
      { field: 'Date', header: 'Date' },
      { field: 'tyname', header: 'Type' },
      { field: 'Coop', header: 'Co_op' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'Society', header: 'Society' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Value', header: 'Value' },
    ];

    this.IssueMemoAbstract = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Society', header: 'Society' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Value', header: 'Value' }
    ];

    this.DemandDraftDetailsReportCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Society', header: 'Society' },
      { field: 'DONO', header: 'DONO' },
      { field: 'DDNo', header: 'DD.NO.' },
      { field: 'DDate', header: 'DD Date' },
      { field: 'Bank', header: 'Bank' },
      { field: 'Amount', header: 'Amount' },
    ];

    this.StackCardRegister = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Stackno', header: 'Stackno' },
      { field: 'Fdate', header: 'From Date' },
      { field: 'Tdate', header: 'To Date' },
      { field: 'OBags', header: 'Opening Bags' },
      { field: 'Quantity', header: 'Balance Quantity' },
      { field: 'Bags', header: 'Receipt Bags' },
      { field: 'Fdate', header: 'GU' },
      { field: 'Tdate', header: 'Receipt Quantity' },
      { field: 'OBags', header: 'Issue Bags' },
      { field: 'Bank', header: 'GR' },
      { field: 'Amount', header: 'Issue Quantity' },
      { field: 'Bank', header: 'Balance Bags' },
      { field: 'Bank', header: 'Balance Quantity' },
      { field: 'Bank', header: 'Stack Status' },
      { field: 'Bank', header: 'W/OFF Quantity' }
    ];

    this.FrozenQuantityACReceiptDetailsCommodity = [
      //   { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'GName', header: 'Godown Name' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'OpeningBalance', header: 'Opening Balance' },
    ];

    this.FrozenQuantityACIssueDetailsCommodity = [
      { header: 'Godown Name', field: 'GName' },
      { header: 'Commodity', field: 'Commodity' },
      { header: 'OB+Receipt', field: 'GrandTotalReceipt' },
    ];

    this.QuantityACIssueDetailsCommodity = [
      //     { header: 'S.No', field: 'SlNo' },
      { header: 'PDS', field: 'IsPDS' },
      { header: 'Coop', field: 'IsCOOP' },
      { header: 'Police', field: 'IsPOLICE' },
      { header: 'NMP', field: 'IsNMP' },
      { header: 'Scheme', field: 'IsBULK' },
      { header: 'CREDIT', field: 'IsCREDIT' },
      { header: 'OAP', field: 'IsOAP' },
      { header: 'SRILANKA', field: 'IsSRILANKA' },
      { header: 'AAY', field: 'IsAAY' },
      { header: 'SPds CRS', field: 'IsSPLPDS' },
      { header: 'SPds COOP', field: 'IsPDSCOOP' },
      { header: 'Cement/Flood', field: 'IsCEMENTFLOOD' },
      { header: 'Total Sales', field: 'IsTotalSales' },
      { header: 'PTNMGR', field: 'IsPTMGR' },
      { header: 'SGRY', field: 'IsSGRY' },
      { header: 'AnnaPoorna', field: 'IsANNAPOORNA' },
      { header: 'Total Free Rice', field: ' IsTotalFreeRiceIssues' },
      { header: 'Issues to Processing  ', field: 'IsISSUESTOPROCESSING  ' },
      { header: 'Transfer Within Region', field: 'IsTRANSFERWITHINREGION' },
      { header: 'Transfer Other Region', field: 'IsTRANSFEROTHERREGION' },
      { header: 'WriteOff', field: 'IsWRITEOFF' },
      { header: 'Cl/Pack/BULKING', field: 'IsCLEANING' },
      { header: 'Vc/Bt/Blg', field: 'IsVCBLG' },
      { header: 'Purchase Return', field: 'IsPURCHASERETURN' },
      { header: 'Total Other Issues', field: 'IsTotalOtherIssues' },
      { header: 'Total Issues', field: 'IsTotalIssues' },
      { header: 'Closing Balance', field: 'IsBalanceQty' },
    ];

    this.QuantityACReceiptDetailsCommodity = [
      // { header: 'S.No', field: 'SlNo', width: '40px' },
      // { field: 'GName', header: 'Godown Name'},
      // { field: 'Commodity', header: 'COMMODITY' },
      //  { field: 'OpeningBalance', header: 'Opening Balance' },
      { field: 'RecPDS', header: 'PDS/Purchase' },
      { field: 'RecPRIORITY', header: 'Priority' },
      { field: 'RecTIDEOVER', header: 'Tide Over' },
      { field: 'RecAAY', header: 'AAY' },
      { field: 'MMS2GEN', header: 'MMS2GEN' },
      { field: 'MMS2SC', header: 'MMS2SC' },
      { field: 'MMS2ST', header: 'MMS2ST' },
      { field: 'RecSPLPDS', header: 'SplPds Purchase' },
      { field: 'RecCEMENT', header: 'Cement' },
      { field: 'RecHOPURCHASE', header: 'HO' },
      { field: 'RecSEIZUR', header: 'Seizur' },
      { field: 'Total', header: 'Total Purchase' },
      { field: 'RecPTMGRNMP', header: 'PTMGRNMF' },
      { field: 'RecSGRY', header: 'SGRY' },
      { field: 'RecANNAPURNA', header: 'Annapoorna' },
      { field: 'TotalFreeRice', header: 'Total Free Rice' },
      { field: 'RecRECEIVEDFROM', header: 'Receipt From' },
      { field: 'RecTRANSFERWITHINREGION', header: 'Transfer Within Region' },
      { field: 'RecTRANSFEROTHERREGION', header: 'Transfer Other Region' },
      { field: 'RecEXCESS', header: 'Excess' },
      { field: 'RecCLEANINGANDPACKING', header: 'Cl/Pac/Bulk' },
      { field: 'RecVCFLOOD', header: 'Vc/Bt/Blg/Flood' },
      { field: 'RecSALESRETURN', header: 'Sales Return' },
      { field: 'TotalOtherReceipt', header: 'Total Other Receipt' },
      { field: 'TotalReceipt', header: 'Total Receipt' },
      { field: 'GrandTotalReceipt', header: 'Grand Total' },
    ];

    this.StackCardRegisterReport = [
      { header: 'S.No', field: 'SlNo', width: '25px' },
      { field: 'FromDate', header: 'From Date', width: '50px' },
      { field: 'ToDate', header: 'To Date', width: '50px' },
      { field: 'Commodity', header: 'Commodity', width: '80px' },
      { field: 'StackCard', header: 'Stack Card', width: '40px' },
      { field: 'OpeningBag', header: 'OPE_BAL.', width: '50px' },
      { field: 'OpeningQty', header: 'Quantity', width: '60px' },
      { field: 'ReceiptBag', header: 'REC_BAGS', width: '45px' },
      { field: 'GU', header: 'GU', width: '55px' },
      { field: 'ReceiptQty', header: 'Quantity', width: '60px' },
      { field: 'IssuesBag', header: 'ISS_BAGS', width: '55px' },
      { field: 'GR', header: 'GR', width: '55px' },
      { field: 'IssuesQty', header: 'Quantity', width: '60px' },
      { field: 'BalanceBag', header: 'BAL_BAGS.', width: '55px' },
      { field: 'BalanceQty', header: 'BAL_QTY', width: '60px' },
      { field: 'StackStatus', header: 'Stack Status', width: '35px' },
      { field: 'WriteOff', header: 'W/OFF QTY.', width: '60px' }
    ];

    this.CashReceiptRegCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'RegionName', header: 'Region Name' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'ReceivedFrom', header: 'Received From' },
      { field: 'ReceiptNo', header: 'REC.No' },
      { field: 'Date', header: 'Date' },
      { field: 'PaymentType', header: 'DD/CH/OCR' },
      { field: 'DDNo', header: 'DD No' },
      { field: 'DDDate', header: 'DD Date' },
      { field: 'Amount', header: 'DD AMOUNT' },
      { field: 'Bank', header: 'Bank' },
    ];

    this.CorrectionSlipReport = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'DocNo', header: 'Doc.No.' },
      { field: 'DocDate', header: 'Doc.Date' },
      { field: 'ShopName', header: 'Receiver Name' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'TStockNo', header: 'Stack Card' },
      { field: 'NoPacking', header: 'Bags' },
      { field: 'Nkgs', header: 'Net Wt' },
      { field: 'LorryNo', header: 'Lorry No.' },
      { field: 'RowId', header: 'Row Id' },
      { field: 'CreatedDate', header: 'Created Date' },
    ];

    this.OWSReport = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: '', header: 'No. of Institute' },
      { field: '', header: 'No. of Beneficiery' },
      { field: '', header: 'No. of Transaction' },
      { field: '', header: 'Distribution' },
      { field: '', header: 'Commodity' },
      { field: '', header: 'Quantity' }
    ];

    this.DocumentCorrectionColumns = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'DocNumber', header: 'Doc.No.' },
      { field: 'ApprovalStatus', header: 'Approval Status' },
      { field: 'ApprovedDate', header: 'Approved Date' },
      { field: 'ApproverReason', header: 'Approver Reason' },
      // { field: 'NoPacking', header: 'Bags' },
    ];

    this.DocumentCorrectionApproveColumns = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'RName', header: 'Region Name' },
      { field: 'GName', header: 'Godown Name' },
      { field: 'DocType', header: 'Doc.Type' },
      { field: 'DocNumber', header: 'Doc.No' },
      { field: 'CreatedDate', header: 'Requested Date' },
      { field: 'Reason', header: 'Correction Reason' },
      { field: 'ApprovalStatus', header: 'Status' },
      { field: 'ApproverReason', header: 'Approver Reason' }
    ];

    this.OBStackDetails = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'ITNAME', header: 'Commodity' },
      { field: 'StackNo', header: 'Stack No' },
      { field: 'StackBalanceBags', header: 'No of Bags' },
      { field: 'StackBalanceWeight', header: 'Quantity' },
      { field: 'StackDate', header: 'OB Stack Date' },
      { field: 'CurYear', header: 'Year' }
    ];

    this.StackCardClosing = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'Code', header: 'Code' },
      { field: 'Stackno', header: 'Stack No' },
      { field: 'Year', header: 'Card Year' },
      { field: 'Active', header: 'Active' },
      { field: 'OpeningDate', header: 'Opening Date' },
      { field: 'ClosingDate', header: 'Closing Date' },
      { field: 'Commodity', header: 'Item Name' }
    ];

    this.PartyLedgerMaster = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'RName', header: 'Region Name' },
      { field: 'PartyName', header: 'Party Name' },
      { field: 'Favour', header: 'Alias / Favour of' },
      { field: 'Pan', header: 'Pan No' },
      { field: 'TIN', header: 'GST No' },
      { field: 'Account', header: 'A/c No' },
      { field: 'Bank', header: 'Bank Name' },
      { field: 'Branch', header: 'Branch' },
      { field: 'IFSC', header: 'IFSC Code' },
      // { header: 'Modify' },
    ];

    this.PartyName = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'PartyID', header: 'Party Code' },
      { field: 'PartyName', header: 'Party Name' },
      { field: 'StateCode', header: 'State Code' },
      { field: 'Pan', header: 'Pan No' },
      { field: 'GSTNo', header: 'GST' },
      { field: 'TIN', header: 'GST No' },
    ];

    this.GSTCommodityName = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'CommodityID', header: 'Commodity Code' },
      { field: 'CommodityName', header: 'Commodity Name' },
      { field: 'TaxPercentage', header: 'Tax Percentage' },
      { field: 'Hsncode', header: 'Hsncode' }
    ];

    this.PurchaseTaxEntry = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'CompanyName', header: 'Company Name' },
      { field: 'CommodityName', header: 'Commodity Name' },
      { field: 'TIN', header: 'GST No' },
      { field: 'BillNo', header: 'Bill No' },
      { field: 'bd', header: 'Bill Date' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Amount', header: 'Amount' },
      { field: 'Percentage', header: 'Tax %' },
      { field: 'VatAmount', header: 'Tax Amount' },
      { field: 'Total', header: 'Total' },
      // { header: 'Modify' },
    ];

    this.SalesTaxEntry = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'CompanyName', header: 'Company Name' },
      { field: 'CommodityName', header: 'Commodity Name' },
      { field: 'TIN', header: 'GST No' },
      { field: 'Hsncode', header: 'Hsncode' },
      { field: 'BillNo', header: 'Bill No' },
      { field: 'bd', header: 'Bill Date' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Amount', header: 'Value' },
      { field: 'TaxPercentage', header: 'Tax %' },
      { field: 'CGST', header: 'CGST Amt' },
      { field: 'SGST', header: 'SGST Amt' },
      { field: 'TaxAmount', header: 'Tax Amt' },
      { field: 'Total', header: 'Total Amt' },
      // { header: 'Modify' },
      // { header: 'Delete' }
    ];

    this.ServiceProviderEntry = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'Month', header: 'Month' },
      { field: 'Year', header: 'Year' },
      { field: 'CompanyName', header: 'Company Name' },
      { field: 'TIN', header: 'GST No' },
      { field: 'BillNo', header: 'Bill No' },
      { field: 'bd', header: 'Bill Date' },
      { field: 'CommodityName', header: 'Service Name' },
      { field: 'Amount', header: 'Amount' },
      { field: 'TaxPercentage', header: 'GST %' },
      { field: 'CGST', header: 'CGST Amt' },
      { field: 'SGST', header: 'SGST Amt' },
      { field: 'TaxAmount', header: 'Total Tax Amt' },
      { field: 'Total', header: 'Total Amt' },
      // { header: 'Modify' },
      // { header: 'Delete' }
    ];

    this.TenderAllotmentToRegionCols = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'SelectedOrderNo', header: 'Order Number' },
      { field: 'PartyName', header: 'Party Name' },
      { field: 'RName', header: 'Region Name' },
      { field: 'Spell', header: 'Spell' },
      { field: 'Quantity', header: 'Quantity' },
    ]

    this.TenderQuantityCols = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'OrderNumber', header: 'Order Number' },
      { field: 'Quantity', header: 'Quantity' },
    ]

    this.TenderAllotmentToGodownCols = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'OrderNumber', header: 'Order Number' },
      { field: 'GName', header: 'Godown Name' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Remarks', header: 'Remarks' }
    ]

    this.AllotmentIssueQuantity = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'AllotmentMonth', header: 'Month' },
      // { field: 'SIDate', header: 'Date' },
      { field: 'SocietyCode', header: 'Society Code' },
      { field: 'SocietyName', header: 'Society Name' },
      { field: 'Acscode', header: 'Shop Code' },
      { field: 'IssuerName', header: 'Issuer Name' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'AllotmentQty', header: 'Allotment Quantity' },
      { field: 'IssueQty', header: 'Issue Quantity' },
      { field: 'Balance', header: 'Balance Quantity' }
    ];

    this.AllotmentIssueQuantityAbstract = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'AllotmentMonth', header: 'Month' },
      { field: 'SocietyCode', header: 'Society Code' },
      { field: 'SocietyName', header: 'Society Name' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'AllotmentQty', header: 'Allotment Quantity' },
      { field: 'IssueQty', header: 'Issue Quantity' },
      { field: 'Balance', header: 'Balance Quantity' }
    ];

    this.ProcessToG2GIssueCols = [
      { header: 'S.No', field: 'SlNo' },
      { header: 'Stock Issue No', field: 'SINo' },
      { header: 'Doc Date', field: 'DocDate' },
      { header: 'Issuer Name', field: 'IssuerName' },
      { header: 'Receivor Name', field: 'ReceivorName' },
    ];

    this.ProcessToG2GCols = [
      { header: 'S.No', field: 'SlNo' },
      { header: 'DOC NO.', field: 'DocNumber' },
      { header: 'Start Date', field: 'GToGStartDate' },
      { header: 'End Date', field: 'GToGEndDate' },
      { header: 'Response', field: 'Error' },
      { header: 'Status', field: 'Status' },
      { header: 'Process Count', field: 'GToGPickedCount' },
      { header: 'ACKDate', field: 'GToGACKDate' },
      { header: 'ACK Status', field: 'ACKStatus' }
    ];


    this.StackCardDocDetailsCols = [
      { header: 'S.No', field: 'SlNo' },
      { header: 'Doc.No', field: 'DocNo' },
      { header: 'Party Name', field: 'ReceivedFrom' },
      { header: 'Lorry No.', field: 'LorryNo' },
      { header: 'Doc.created Date', field: 'CreatedDate' },
      { header: 'Bags', field: 'NOOfPACKING' },
      { header: 'Quantity', field: 'NETWT' },
    ];

    this.IssuerPartyCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'IssuerCode', header: 'Issuer Code' },
      { field: 'Issuername', header: 'Issuer Name' },
      // { field: 'PartyID', header: 'Party Code' },
      { field: 'PartyName', header: 'Party Name' },
    ];

    this.AllotmentDetailsCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { header: 'Taluk Name', field: 'Taluk', width: '100px' },
      { header: 'Godown Code', field: 'GCode', width: '60px' },
      { header: 'Godown Name', field: 'Godownname', width: '100px' },
      { header: 'Society Name', field: 'SocietyName', width: '300px' },
      { header: 'FPS Code', field: 'FPSCode', width: '80px' },
      { header: 'Commodity', field: 'Commodity', width: '100px' },
      { header: 'Quantity', field: 'Quantity', width: '100px' }
    ];

    this.SectionDailyStatementReportColumns = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { header: 'Locations', field: 'Locations' },
      { header: 'Allotment', field: 'Allotment' },
      { header: 'On The Day(QTY)', field: 'OnTheDayQty' },
      { header: 'Up To Day(QTY)', field: 'UpToDayQty' },
      { header: 'Balance', field: 'Balance' },
    ];

    this.LoadMenWagesLoadingReportColumns = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { header: 'Date', field: 'Date' },
      { header: 'Scheme', field: 'SchemeName' },
      { header: 'Commodity', field: 'Commodity' },
      { header: 'Bags', field: 'NoPacking' },
      { header: 'Quantity', field: 'Qty' },
      { header: 'Loading Charges', field: 'Loading' },
      { header: 'Handling Charges', field: 'Handling' },
      { header: 'Total', field: 'Total' },

    ];

    this.LoadMenWagesUnLoadingReportColumns = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { header: 'Date', field: 'Date' },
      { header: 'Scheme', field: 'SchemeName' },
      { header: 'Commodity', field: 'Commodity' },
      { header: 'Bags', field: 'NoPacking' },
      { header: 'Quantity', field: 'Qty' },
      { header: 'UnLoading Charges', field: 'UnLoading' },
    ];

    this.ProcessToGPSCols = [
      { header: 'S.No', field: 'SlNo', width: '15px' },
      { header: 'DOC NO.', field: 'DocNumber', width: '25px' },
      { header: 'Start Date', field: 'GPSStartDate', width: '35px' },
      { header: 'End Date', field: 'GPSEndDate', width: '35px' },
      { header: 'Error', field: 'GPSError', width: '100px' },
      { header: 'Status', field: 'GPSStatus', width: '30px' }
    ];

    this.IssueMemoLorryAbstractColumns = [
      { header: 'S.No', field: 'SlNo' },
      { header: 'Doc No.', field: 'SINo' },
      { header: 'Doc Date', field: 'SIDate' },
      { header: 'Lorry No', field: 'LorryNo' },
      { header: 'Receivor Name', field: 'ReceivorName' },
    ];

    this.FrozenQuantityACGunnyIssueDetails = [
      { header: 'Godown Name', field: 'GName' },
      { header: 'Commodity', field: 'Commodity' },
      { header: 'OB+Receipt', field: 'GrandTotalReceipt' },
    ];

    this.QuantityACGunnyIssueDetails = [
      //     { header: 'S.No', field: 'SlNo' },
      { header: 'SALES', field: 'IsSALES' },
      { header: 'Transfer Within Region', field: 'IsTRANSFERWITHINREGION' },
      { header: 'Transfer Other Region', field: 'IsTRANSFEROTHERREGION' },
      { header: 'WRITEOFF', field: 'IsWRITEOFF' },
      { header: 'GU', field: 'IsGUNNYRELEASE' },
      { header: 'MENDING', field: 'IsMENDING' },
      { header: 'TOTAL ISSUE', field: 'IsTotalIssues' },
      { header: 'CLOSING BALANCE', field: 'IsBalanceQty' },
    ];

    this.FrozenQuantityACGunnyReceiptDetails = [
      { header: 'GODOWN NAME', field: 'GName' },
      { header: 'COMMODITY', field: 'Commodity' },
      { header: 'OPENING BALANCE', field: 'OpeningBalance' },
    ];

    this.QuantityACGunnyReceiptDetails = [
      //     { header: 'S.No', field: 'SlNo' },
      { header: 'PURCHASE', field: 'RecPURCHASE' },
      { header: 'HOPURCHASE', field: 'RecHOPURCHASE' },
      { header: 'Transfer Within Region', field: 'RecTRANSFERWITHINREGION' },
      { header: 'Transfer Other Region', field: 'RecTRANSFEROTHERREGION' },
      { header: 'Excess/Sales Return', field: 'RecEXCESS' },
      { header: 'Hulling', field: 'RecHULLING' },
      { header: 'GUNNY RELEASE', field: 'RecGUNNYRELEASE' },
      { header: 'Total Receipt', field: 'TotalReceipt' },
      { header: 'GrandTotalInc OB', field: 'GrandTotalReceipt' },
    ];

    this.StackCardMaster = [
      { header: 'S.No', field: 'SlNo' },
      // { field: 'RowId', header: 'Row Id' },
      { field: 'GodownCode', header: 'Godown Code' },
      { field: 'RegionCode', header: 'Region Code' },
      { field: 'CommodityCode', header: 'Commodity Code' },
      { field: 'ITDescription', header: 'Commodity Name' },
      { field: 'StackNo', header: 'Stack No' },
      { field: 'StackBalanceBags', header: 'StackBalanceBags' },
      { field: 'ObStackDate', header: 'ObStackDate' },
      { field: 'CurYear', header: 'CurYear' },
      { field: 'Flag1', header: 'Flag1' },
      { field: 'clstackdate', header: 'clstackdate' },
    ];

    this.RunningStackCardDetailsCols = [
      { header: 'S.No.', field: 'SlNo', width: '15px' },
      { header: 'Stack No.', field: 'StackNo', width: '40px' },
      { header: 'Bags', field: 'StackBalanceBags', width: '30px' },
      { header: 'Weight', field: 'StackBalanceWeight', width: '60px' },
      { header: 'Stack Date', field: 'StackDate', width: '25px' },
      { header: 'Current Year', field: 'CurYear', width: '20px' },

    ];

    this.StockLedgerReport = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { header: 'Commodity', field: 'ITDescription' },
      { header: 'Date', field: 'Date' },
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

    this.InceptionCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { header: 'Commodity', field: 'Commodity' },
      { header: 'CurrYear', field: 'CurYear' },
      { header: 'Stack No.', field: 'StackNo' },
      { header: 'Quantity', field: 'Quantity' },
      { header: 'Type', field: 'TypeName' },
    ];

    this.InceptionDetailsColumns = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { header: 'Inception Team', field: 'InceptionName' },
      { header: 'Name', field: 'Name' },
      { header: 'Designation', field: 'DesignationName' },
      { header: 'InceptionDate', field: 'InceptionDate' },
      { header: 'CreatedDate', field: 'CreatedDate' },
    ];
  }
}