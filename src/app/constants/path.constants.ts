export class PathConstants {
  ///Dashboard
  public static readonly CHART_CB = '/api/DashboardCB/GetRiceList';
  public static readonly CHART_RECEIPT = '/api/Dashboard/GetRiceList';
  public static readonly CHART_ISSUE = '/api/DashboardIssues/GetRiceList';
  public static readonly DASHBOARD = '/api/DashboardMaster';
  public static readonly GODOWN_MASTER = '/api/GodownMaster';
  public static readonly NOTIFICATIONS = '/api/notifications';
  public static readonly NOTIFICATIONS_POST = '/api/notifications/Post';
  public static readonly DASHBOARD_COMMODITY_PB = '/api/CommodityPB';

  ///Server Date 
  public static readonly SERVER_DATE = '/api/ServerDate';

  ///Masters
  public static readonly AADS = '/api/AADS';
  public static readonly CRS = '/api/CRS';
  public static readonly MRN = '/api/MRN';
  public static readonly HULLING_AGENCIES = '/api/HullingAgencies';
  public static readonly FCI = '/api/FCI';
  public static readonly REGION = '/api/Region';
  public static readonly SCHEMES = '/api/Scheme';
  public static readonly DEPOSITOR = '/api/Suppliers';
  public static readonly DAILY_STOCK_STATEMENT_ITEM_MASTER = '/api/ItemMaster';
  public static readonly TRANSACTION_MASTER = '/api/TransactionMaster';
  public static readonly ITEM_MASTER = '/api/ItemMaster';
  public static readonly DEPOSITOR_TYPE_MASTER = '/api/TypeMaster/Get';
  public static readonly DEPOSITOR_NAME_MASTER = '/api/DepositorDetails/Get';
  public static readonly COMMODITY_FOR_SCHEME = '/api/CommodityForScheme/Get';
  public static readonly STACK_DETAILS = '/api/StackDetails/Get';
  public static readonly PACKING_AND_WEIGHMENT = '/api/PackingandWeighment';
  public static readonly BASIC_WEIGHT_MASTER = '/api/Basicweight';
  public static readonly STACK_YEAR = '/api/Accounting';
  public static readonly COMMODITY_BREAK_ITEM_MASTER_MODIFICATION = '/api/ItemMaster';
  public static readonly KEROSENE_SUPPLIERS = '/api/KeroseneSuppliers';
  public static readonly SCHEME_COMMODITY = '/api/SchemeCommodity';
  public static readonly SOCIETY_MASTER = '/api/SocietyMaster';
  public static readonly DESIGNATION_MASTER = '/api/DesignationMaster';
  public static readonly TYPE_CATEGORY_GET = '/api/TypeCategoryMaster/Get';
  public static readonly CATEGORY_TYPECODE_DISTINCT_GET = '/api/TypeCategoryMaster';
  public static readonly TNCSC_SETTINGS = '/api/Settings';
  public static readonly STACKCARD_YEAR_GET = '/api/StackCardYear';

  ///Menu&Login
  public static readonly MENU = '/api/Menu/Get';
  public static readonly LOGIN = '/api/Users/Get';

  ///Reports
  public static readonly DAILY_STOCK_STATEMENT_REPORT = '/api/DailyStatement/Get';
  public static readonly CB_STATEMENT_REPORT = '/api/DailyCBStatement/Get';
  public static readonly STOCK_RECEIPT_REGISTER_REPORT = '/api/StockReceipts/Post';
  public static readonly STOCK_ISSUE_REGISTER_REPORT = '/api/StockIssue/Post';
  public static readonly STOCK_TRUCK_MEMO_REPORT = '/api/StockTruckMemos/Post';
  public static readonly STOCK_DELIVERY_ORDER_REPORT = '/api/StockDeliveryOrders/Post';
  public static readonly STOCK_DELIVERY_ORDER_VIEW_REPORT = '/api/StockDeliveryOrders/Get';
  public static readonly WRITE_OFF_REPORT = '/api/WriteOFF/Get';
  public static readonly COMMODITY_RECEIPT_REPORT = '/api/CommodityReceipt/Post';
  public static readonly SCHEME_ISSUE_MEMO_REPORT = '/api/SchemeIssueMemo/Post';
  public static readonly COMMODITY_ISSUE_MEMO_REPORT = '/api/CommodityIssueMemo/Post';
  public static readonly TRANSACTION_RECEIPT_REPORT = '/api/TransactionReceipt/Post';
  public static readonly SCHEME_RECEIPT_REPORT = '/api/SchemeReceipt/Post';
  public static readonly HULLING_DETAILS_REPORT = '/api/HullingDetails/Get';
  public static readonly TRUCK_TO_REGION_REPORT = '/api/TruckToRegion/Get';
  public static readonly TRUCK_FROM_REGION_REPORT = '/api/TruckFromRegion/Get';
  public static readonly GUNNY_REPORT = '/api/GUGR/Post'; 
  public static readonly TRUCK_TRANSIT = '/api/TruckTransit/Get'; 
  public static readonly RECEIPT_RONO_PURCHASE_REPORT = '/api/ReceiptRono/Post';
  public static readonly RECEIPT_REGION_PURCHASE_REPORT = '/api/ReceiptRegionPurchase/Post';
  public static readonly RECEIPT_REGION_HO_PURCHASE = '/api/RegionHoPurchase/Post';
  public static readonly STOCK_STATEMENT_REPORT = '/api/StockStatement/Post';
  public static readonly DAILY_DOCUMENT_RECEIPT_POST = '/api/DailyReceipt/Post';
  public static readonly DAILY_DOCUMENT_ISSUE_POST = '/api/DailyIssues/Post';
  public static readonly DAILY_DOCUMENT_TRUCK_POST = '/api/DailyTruckMemo/Post';
  public static readonly STACK_BALANCE = '/api/StackBalance/Post';
  public static readonly SOCIETY_MASTER_GET = '/api/SocietyMaster/Get';
  public static readonly ISSUER_MASTER_GET = '/api/IssuerMaster/Get';
  public static readonly ISSUER_MASTER_PUT = '/api/IssuerMaster/Put';
  public static readonly EMPLOYEE_MASTER_GET = '/api/EmployeeMaster/Get';
  public static readonly EMPLOYEE_MASTER_POST = '/api/EmployeeMaster/Post';
  public static readonly SOCIETY_MASTER_ENTRY_GET = '/api/SocietyMasterEntry/Get';
  public static readonly SOCIETY_MASTER_ENTRY_PUT = '/api/SocietyMasterEntry/Put';
  public static readonly SOCIETY_MASTER_NEW_ENTRY_GET = '/api/SocietyMasterNew/Get';
  public static readonly SOCIETY_MASTER_NEW_ENTRY_POST = '/api/SocietyMasterNew/Post';
  public static readonly DELIVERY_ORDER_SCHEMEWISE = '/api/SchemeWise/Post';
  public static readonly ISSUE_MEMO_CUTOMER_DETAILS_POST = '/api/Sales/Post';
  public static readonly ISSUE_MEMO_SOCIETY_ABSTRACT_REPORT = '/api/IssueMemoSocietyAbstract/Post';
  public static readonly QUANTITY_ACCOUNT_ISSUE_REPORT = '/api/IssuesForQuantityAccount/Post';
  public static readonly DELIVERY_ORDER_MARGIN_AMOUNT_POST = '/api/MarginAmount/Post';
  public static readonly QUANTITY_ACCOUNT_RECEIPT_REPORT = '/api/ReceiptForQuantityAccount/Post';
  public static readonly QUANTITY_ACCOUNT_RECEIPT_SCHEME_REPORT = '/api/ReceiptForQuantityACAllScheme/Post';
  public static readonly QUANTITY_ACCOUNT_ISSUE_SCHEME_SOCIETY_REPORT = '/api/IssuesForQuantityACAllSchemeSociety/Post';
  public static readonly QUANTITY_ACCOUNT_ISSUE_SCHEME_CRS_REPORT = '/api/IssuesForQuantityACAllSchemeCRS/Post';
  public static readonly QUANTITY_ACCOUNT_ISSUE_SCHEME_REPORT = '/api/IssuesForQuantityACAllScheme/Post';
  public static readonly QUANTITY_ACCOUNT_TRUCK_SCHEME_REPORT = '/api/TruckMemoForQuantityACAllScheme/Post';
  public static readonly DELIVERY_ORDER_SPLPDS = '/api/DOSPLPDS/Post';
  public static readonly DELIVERY_ORDER_OAP = '/api/DOOAP/Post';
  public static readonly DELIVERY_ORDER_ANNAPOORNA = '/api/DOAnnaporna/Post';
  public static readonly DELIVERY_ORDER_OTHERSCHEME = '/api/DOOtherScheme/Post';
  public static readonly STACK_CARD_OPENING_REPORT_DELETE = '/api/StackBalance/Delete';
  public static readonly OCR_REGISTER_REPORT = '/api/OCR/Post';
  public static readonly DELIVERY_ORDER_SOCIETY_ABSTRACT = '/api/DOSocietyAbstract/Post';
  public static readonly DELIVERY_ORDER_REGISTER_GST = '/api/GST/Post';
  public static readonly CORRECTION_SLIP_REPORT = '/api/CorrectionSlip/Post';
  public static readonly SOCIETY_MASTER_POST = '/api/SocietyMaster/Post';
  public static readonly ISSUER_MASTER_POST = '/api/IssuerMaster/Post';
  public static readonly QUANTITY_RECISS_COMMODITY_POST = '/api/QuantityAccountIssuesAndRecipt/Post';
  public static readonly QUANTITY_GUNNY_POST = '/api/QuantityGunnyReceiptAndIssue/Post';
  public static readonly QUANTITY_OTHERS_POST = '/api/QuantityOthersReceiptAndIssue/Post';
  public static readonly SECTION_DAILY_STATEMENT_POST = '/api/DailyStatement/Post';
  public static readonly WAGES_LOADING_POST = '/api/WagesLoading/Post';

  ///Documents
  public static readonly STOCK_TRUCK_MEMO_DOCUMENT = '/api/StockTruckMemo/Post';
  public static readonly STOCK_TRUCK_MEMO_VIEW_DOCUMENT = '/api/StockTruckMemo/Get';
  public static readonly TRUCK_MEMO_DUPLICATE_DOCUMENT = '/api/StockTruckMemo/Put';
  public static readonly TRANSACTION_STATUS_POST = '/api/TransactionStatus/Post';
  public static readonly TRANSACTION_STATUS_DETAILS_POST = '/api/TransactionStatusDetails/Post';
  public static readonly TRANSACTION_STATUS_GET = '/api/TransactionStatus/Get';
  public static readonly STOCK_RECEIPT_DOCUMENT = '/api/StockReceipt/Post';
  public static readonly STOCK_RECEIPT_VIEW_DOCUMENT = '/api/StockReceipt/Get'; 
  public static readonly STOCK_RECEIPT_DUPLICATE_DOCUMENT = '/api/StockReceipt/Put';
  public static readonly STOCK_DELIVERY_ORDER_DOCUMENT = '/api/StockDeliveryOrder/Post';
  public static readonly STOCK_DELIVERY_ORDER_VIEW_DOCUMENT = '/api/StockDeliveryOrder/Get';
  public static readonly OPENING_BALANCE_MASTER_POST = '/api/OpeningBalanceMaster/Post';
  public static readonly OPENING_BALANCE_MASTER_GET = '/api/OpeningBalanceMaster/Get';
  public static readonly OPENING_BALANCE_MASTER_PUT = '/api/OpeningBalanceMaster/Put';
  public static readonly STOCK_ISSUE_MEMO_DOCUMENTS = '/api/StockIssueMemo/Post';
  public static readonly STOCK_ISSUE_VIEW_DOCUMENTS = '/api/StockIssueMemo/Get';
  public static readonly STOCK_ISSUE_DUPLICATE_DOCUMENT = '/api/StockIssueMemo/Put';
  public static readonly STACK_OPENING_ENTRY_REPORT_POST = '/api/StackOpeningEntry/Post';
  public static readonly STACK_OPENING_BALANCE_DETAIL_POST = '/api/StackDetails/Post';
  public static readonly STACK_OPENING_ENTRY_REPORT_GET = '/api/StackOpeningEntry/Get';
  public static readonly CHANGE_PASSWORD_POST = '/api/Users/Post';
  public static readonly STACK_OPENING_ENTRY_REPORT_PUT = '/api/StackOpeningEntry/Put';
  public static readonly STOCK_PAYMENT_DETAILS_DOCUMENT = '/api/StockPaymentDetails/Post';
  public static readonly GODOWN_PROFILE_POST = '/api/GodownProfiles/Post';
  public static readonly GODOWN_PROFILE_GET = '/api/GodownProfiles/Get';
  public static readonly DD_CHEQUE_ENTRY_POST = '/api/DDChequeEntry/Post';
  public static readonly DD_CHEQUE_ENTRY_GET = '/api/DDChequeEntry/Get';
  public static readonly DEMAND_DRAFT_POST = '/api/DemandDraft/Post';
  public static readonly DOCUMENT_CORRECTION_GET = '/api/DocumentCorrection/Get';
  public static readonly DOCUMENT_CORRECTION_POST = '/api/DocumentCorrection/Post';
  public static readonly DO_GST_UPDATE = '/api/DOGSTUpdate/Post';
  public static readonly STOCK_ISSUE_GATEPASS_POST = '/api/StockIssuesAbstractPrint/Post';
  public static readonly STOCK_ISSUE_GATEPASS_PUT = '/api/StockIssuesAbstractPrint/Put';
  public static readonly KEROSENE_REGIONAL_SUPPLIERS = '';
  public static readonly CUSTOMER_MASTER = '';
 
  //Account Module
  public static readonly PARTY_LEDGER_ENTRY_GET = '/api/PartyLedger/Get';
  public static readonly PARTY_LEDGER_ENTRY_POST = '/api/PartyLedger/Post';
  public static readonly PARTY_MASTER = '/api/PartyMaster/Get';
  public static readonly PURCHASE_TAX_ENTRY_GET = '/api/PurchaseTaxEntry/Get';
  public static readonly PURCHASE_TAX_ENTRY_POST = '/api/PurchaseTaxEntry/Post';
  public static readonly SALES_TAX_ENTRY_GET = '/api/SalesTaxEntry/Get';
  public static readonly SALES_TAX_ENTRY_POST = '/api/SalesTaxEntry/Post';
  public static readonly GST_COMMODITY_MASTER = '/api/GSTCommodityMaster';
  public static readonly GST_SERVICE_PROVIDER_MASTER = '/api/ServiceProviderMaster';
  public static readonly SERVICE_PROVIDER_GET = '/api/ServiceProviderEntry/Get';
  public static readonly SERVICE_PROVIDER_POST = '/api/ServiceProviderEntry/Post';


  //Allotment Module
  public static readonly ALLOTMENT_COMMODITY_MASTER = '/api/AllotmentCommodityMaster';
  public static readonly ALLOTMENT_QUANTITY_GET = '/api/AllotmentQuantity/Get';
  public static readonly ALLOTMENT_QUANTITY_POST = '/api/AllotmentQuantity/Post';
  public static readonly ALLOTMENT_BALANCE_GET = '/api/AllotmentBalance/Get';
  public static readonly ALLOTMENT_BALANCE_POST = '/api/AllotmentBalance/Post';

  ///Purchase Module
  public static readonly PURCHASE_TENDER_DETAILS_POST = '/api/TenderDetails/Post';
  public static readonly PURCHASE_TENDER_DETAILS_GET = '/api/TenderDetails/Get';
  public static readonly PURCHASE_TENDERID_DETAILS = '/api/TenderIDForAllotement';
  public static readonly PURCHASE_TENDER_DATA_BY_ORDER_NO = '/api/TenderDataByOrderNo/Post';
  public static readonly PURCHASE_TENDER_ALLOTMENT_DETAILS_POST = '/api/TenderAllotmentDetails/Post';
  public static readonly PURCHASE_TENDER_ALLOTMENT_DETAILS_GET = '/api/TenderAllotmentDetails/Get';
  public static readonly PURCHASE_TENDER_ORDER_NO_GET = '/api/TenderOrderNoList/Get';
  public static readonly PURCHASE_TENDER_ALLOTMENT_TO_REGIONAL_POST = '/api/TenderAllotmentToRegional/Post';
  public static readonly PURCHASE_TENDER_ALLOTMENT_TO_REGIONAL_GET = '/api/TenderAllotmentToRegional';
  public static readonly PURCHASE_TENDER_ALLOTMENT_TO_GODOWN_POST = '/api/TenderAllotmentToGodown/Post';
  public static readonly PURCHASE_TENDER_ALLOTMENT_TO_GODOWN_GET = '/api/TenderAllotmentToGodown';
  ///End

  ///G2G
  public static readonly PROCESS_TO_G2G_POST = '/api/ProcessToG2G/Post';
  public static readonly PROCESS_TO_G2G_GET = '/api/ProcessToG2G/Get';
  ///End

  ///GPS
  public static readonly PROCESS_TO_GPS_POST = '/api/ProcessToGPS/Post';
  public static readonly PROCESS_TO_GPS_GET = '/api/ProcessToGPS/Get';

  ///Settings
  public static readonly SETTINGS_GET = '/api/Settings';

  ///TrackIP
  public static readonly IMAGE_UPLOAD = '/api/Upload';
  

  ///End
}
