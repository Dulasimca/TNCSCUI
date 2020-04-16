import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ButtonModule, MenubarModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { HttpClientModule } from '@angular/common/http';
import { CheckboxModule } from 'primeng/checkbox';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TreeTableModule } from 'primeng/treetable';
import { HighchartsChartModule } from 'highcharts-angular';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { BlockUIModule } from 'primeng/blockui';
import { ListboxModule } from 'primeng/listbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputMaskModule } from 'primeng/inputmask';
import { FileUploadModule } from 'primeng/fileupload';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
// import { SignaturePadModule } from 'angular2-signaturepad/signaturepad';
// import { SignaturePad } from 'signature_pad';
// import SignaturePad from 'signature_pad';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from './shared-services/auth.service';
import { TableConstants } from './constants/tableconstants';
import { DailyStockStatementComponent } from './reports/dailystockstatement/dailystockstatement.component';
import { StockPurchaseComponent } from './purchase/stockpurchase/stockpurchase.component';
import { DatePipe } from '@angular/common';
import { RestAPIService } from './shared-services/restAPI.service';
import { GodownDataComponent } from './masters/godown-data/godown-data.component';
import { HullingAgenciesComponent } from './masters/hulling-agencies/hulling-agencies.component';
import { CRSDataComponent } from './masters/crsdata/crsdata.component';
import { RegionsDataComponent } from './masters/regions-data/regions-data.component';
import { MRMDataComponent } from './masters/mrmdata/mrmdata.component';
import { DepositorsComponent } from './masters/depositors/depositors.component';
import { AADSDataComponent } from './masters/aadsdata/aadsdata.component';
import { FCIDataComponent } from './masters/fcidata/fcidata.component';
import { SchemesComponent } from './masters/schemes/schemes.component';
import { PathConstants } from './constants/path.constants';
import { NotificationsComponent } from './masters/notifications/notifications.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ExcelService } from './shared-services/excel.service';
import { GodownAllotmentComponent } from './purchase/godownallotment/godownallotment.component';
import { RegionAllotmentComponent } from './purchase/regionallotment/regionallotment.component';
import { CBStatementComponent } from './reports/cb-statement/cb-statement.component';
import { StockReceiptComponent } from './Documents/stock-receipt/stock-receipt.component';
import { IssueReceiptComponent } from './Documents/issue-receipt/issue-receipt.component';
import { DeliveryReceiptComponent } from './Documents/delivery-receipt/delivery-receipt.component';
import { TruckReceiptComponent } from './Documents/truck-receipt/truck-receipt.component';
import { StockReceiptRegisterComponent } from './reports/stock-receipt-register/stock-receipt-register.component';
import { StockIssueRegisterComponent } from './reports/stock-issue-register/stock-issue-register.component';
import { TruckMemoRegisterComponent } from './reports/truck-memo-register/truck-memo-register.component';
import { DeliveryOrderRegisterComponent } from './reports/delivery-order-register/delivery-order-register.component';
import { RoleBasedService } from './common/role-based.service';
import { CommodityReceiptComponent } from './reports/commodity-receipt/commodity-receipt.component';
import { SchemeReceiptComponent } from './reports/scheme-receipt/scheme-receipt.component';
import { TransactionReceiptComponent } from './reports/transaction-receipt/transaction-receipt.component';
import { CommodityIssueMemoComponent } from './reports/commodity-issue-memo/commodity-issue-memo.component';
import { SchemeIssueMemoComponent } from './reports/scheme-issue-memo/scheme-issue-memo.component';
import { WriteOffComponent } from './reports/write-off/write-off.component';
import { HullingDetailsComponent } from './reports/hulling-details/hulling-details.component';
import { TruckToRegionComponent } from './reports/TransferAc/truck-to-region/truck-to-region.component';
import { TruckFromRegionComponent } from './reports/TransferAc/truck-from-region/truck-from-region.component';
import { ReceiptHOPurchaseComponent } from './reports/purchase-AC/receipt-ho-purchase/receipt-ho-purchase.component';
import { ReceiptROPurchaseComponent } from './reports/purchase-AC/receipt-ro-purchase/receipt-ro-purchase.component';
import { ReceiptRONOPurchaseComponent } from './reports/purchase-AC/receipt-rono-purchase/receipt-rono-purchase.component';
import { CustomerDetailsComponent } from './reports/sales-AC/issue-memo/customer-details/customer-details.component';
import { SocietyWiseCommodityAbstractComponent } from './reports/sales-AC/issue-memo/society-wise-commodity-abstract/society-wise-commodity-abstract.component';
import { GunnyGuGrComponent } from './reports/gunny-gu-gr/gunny-gu-gr.component';
// import { OpeningBalanceComponent } from './opening-balance/opening-balance.component';
import { PrintService } from './print.service';
import { TruckTransitComponent } from './reports/truck-transit/truck-transit.component';
import { DecimalDirective } from './directives/decimal.directive';
import { SocietMasterComponent } from './Documents/Master/society-master/societ-master.component';
import { OpeningBalanceDetailsComponent } from './Documents/Master/opening-balance-details/opening-balance-details.component';
import { DepositorCustomerMasterComponent } from './Documents/Master/depositor-customer-master/depositor-customer-master.component';
import { RateMasterComponent } from './Documents/Master/rate-master/rate-master.component';
import { ShopSocietUpdateMasterComponent } from './Documents/Master/shopSocietyUpdate/shopSocietyUpdate.component';
import { ItemMasterModificationComponent } from './Documents/Master/item-master-modification/item-master-modification.component';
import { CustomerListComponent } from './Documents/Master/customer-list/customer-list.component';
import { UserMasterComponent } from './Documents/Master/user-master/user-master.component';
import { OpeningBalanceCurrentYearComponent } from './Documents/Master/opening-balance-current-year/opening-balance-current-year.component';
import { StockstatementreportComponent } from './reports/stockstatementreport/stockstatementreport.component';
import { TransactionStatusComponent } from './reports/transaction-status/transaction-status.component';
import { DailyDocumentsComponent } from './reports/DailyDocument/daily-document-receipt/daily-documents.component';
import { StackCardOpeningEntryComponent } from './Documents/StackCard/stack-card-opening-entry/stack-card-opening-entry.component';
import { DailyDocumentIssueComponent } from './reports/DailyDocument/daily-document-issue/daily-document-issue.component';
import { AmountDecimalDirective } from './directives/DecimalForAmount.directive';
import { StackCardOpeningComponent } from './reports/StackCard/stack-card-opening/stack-card-opening.component';
import { StackCardComponent } from './reports/StackCard/stack-card/stack-card.component';
import { GodownProfileComponent } from './godown-profile/godown-profile.component';
import { PackingMasterComponent } from './UserMaster/packing-master/packing-master.component';
import { OtherMasterComponent } from './UserMaster/other-master/other-master.component';
import { CncCorrectionComponent } from './UserMaster/cnc-correction/cnc-correction.component';
import { SchemeCommodityComponent } from './Documents/Master/scheme-commodity/scheme-commodity.component';
import { SocietyMasterNewComponent } from './Documents/Master/society-master-new/society-master-new.component';
import { StatusMessage } from './constants/Messages';
import { OtherSchemesComponent } from './reports/DeliveryOrderReport/Other-schemes/other-schemes.component';

import { SocietyAbstractComponent } from './reports/DeliveryOrderReport/society-abstract/society-abstract.component';
import { DemandDraftComponent } from './reports/DeliveryOrderReport/demand-draft/demand-draft.component';
import { MarginAmountComponent } from './reports/DeliveryOrderReport/margin-amount/margin-amount.component';
import { DDChequeEntryComponent } from './Documents/DD-cheque-entry/DD-cheque-entry.component';
import { IssuerMasterComponent } from './Documents/Master/IssuerMaster/Issuer-master.component';
import { ReceiptSchemeComponent } from './reports/Quantity/receipt-scheme/receipt-scheme.component';
import { IssueSchemeComponent } from './reports/Quantity/IssueScheme/issue-scheme/issue-scheme.component';
import { IssueSchemeCrsComponent } from './reports/Quantity/IssueScheme/issue-scheme-crs/issue-scheme-crs.component';
import { IssueSchemeCoOpComponent } from './reports/Quantity/IssueScheme/issue-scheme-co-op/issue-scheme-co-op.component';
import { IssueTypeAbstractComponent } from './reports/Quantity/issue-type-abstract/issue-type-abstract.component';
import { ReceiptTypeAbstractComponent } from './reports/Quantity/receipt-type-abstract/receipt-type-abstract.component';
import { TruckMemoSchemeComponent } from './reports/Quantity/truckmemo-scheme/truckmemo-scheme.component';
import { LoginService } from './login/login.service';
import { OapComponent } from './reports/DeliveryOrderReport/oap/oap.component';
import { SplpdsComponent } from './reports/DeliveryOrderReport/splpds/splpds.component';
import { AnnapoornaComponent } from './reports/DeliveryOrderReport/annapoorna/annapoorna.component';
import { AllSchemeComponent } from './reports/DeliveryOrderReport/All-scheme/all-scheme.component';
import { DocumentCorrectionComponent } from './Documents/document-correction/document-correction.component';
import { StackCardRegisterComponent } from './reports/StackCard/stack-card-register/stack-card-register.component';
import { OCRReportComponent } from './reports/ocr-report/ocr-report.component';
import { CashReceiptRegisterComponent } from './reports/cash-receipt-register/cash-receipt-register.component';
import { CorrectionSlipComponent } from './reports/correction-slip/correction-slip.component';
import { OWSComponent } from './reports/Annavitran/ows/ows.component';
import { StackClosingCard2Component } from './reports/StackCard/stack-closing-card-2/stack-closing-card-2.component';
import { OpeningBalanceStackDetailsComponent } from './reports/StackCard/StackDetail/opening-balance-stack-details/opening-balance-stack-details.component';
import { SalesTaxEntryComponent } from './GST/Documents/sales-tax-entry/sales-tax-entry.component';
import { PurchaseTaxEntryComponent } from './GST/Documents/purchase-tax-entry/purchase-tax-entry.component';
import { PartyLedgerMasterComponent } from './GST/Master/party-ledger-master/party-ledger-master.component';
import { AllotmentDetailsComponent } from './Allotment/allotment-details/allotment-details.component';
import { ServiceProviderEntryComponent } from './GST/Documents/service-provider-entry/service-provider-entry.component';
import { AllotmentIssueQuantityComponent } from './Allotment/QuotaWatchRegister/allotment-issue-quantity.component';
import { ProcessToG2GComponent } from './G2G/process-to-G2G/process-to-G2G.component';
import { QuantityDetailCommodityComponent } from './reports/Quantity/quantity-detail-commodity/quantity-detail-commodity.component';
import { PartyLedgerUpdateComponent } from './GST/Master/party-ledger-update/party-ledger-update.component';
import { GodownEmployeeDetailsComponent } from './Documents/Master/godown-employee-details/godown-employee-details.component';
import { NotificationComponent } from './notification/notification/notification.component';
import { NotificationPopupComponent } from './notification/notification-popup/notification-popup.component';
import { DailyDocumentTruckComponent } from './reports/DailyDocument/daily-document-truck/daily-document-truck.component';
import { DailyStatementComponent } from './reports/sections/daily-statement/daily-statement.component';
import { LoadMenWagesComponent } from './reports/wages/load-men-wages/load-men-wages.component';
import { LoadMenUnloadingWagesComponent } from './reports/wages/load-men-unloading-wages/load-men-unloading-wages.component';
import { GodownDashboardComponent } from './godown-dashboard/godown-dashboard.component';
import { ProcessToGPSComponent } from './GPS/process-to-gps/process-to-gps.component';
import { IssueGatepassComponent } from './Documents/issue-gatepass/issue-gatepass.component';
import { QuantityDetailIssueComponent } from './reports/Quantity/quantity-detail-gunny/quantity-detail-gunny.component';
import { StackCardCorrectionComponent } from './Documents/stack-card-correction/stack-card-correction.component';
import { StackRunningCardDateComponent } from './Documents/StackCard/stack-running-card-date/stack-running-card-date.component';
import { StockLedgerStatementComponent } from './reports/stock-ledger-statement/stock-ledger-statement.component';
import { AuditInceptionComponent } from './Audit/audit-inception/audit-inception.component';
import { SalesTaxComponent } from './GST/Reports/sales-tax/sales-tax.component';
import { PurchaseTaxComponent } from './GST/Reports/purchase-tax/purchase-tax.component';
import { ServiceProviderComponent } from './GST/Reports/service-provider/service-provider.component';
import { AuditReportComponent } from './audit-report/audit-report.component';
import { StockCommodityComponent } from './reports/stock-commodity/stock-commodity.component';
import { GodownInchargeComponent } from './godown-incharge/godown-incharge.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MenuComponent,
    FooterComponent,
    HeaderComponent,
    DailyStockStatementComponent,
    StockPurchaseComponent,
    GodownDataComponent,
    HullingAgenciesComponent,
    CRSDataComponent,
    RegionsDataComponent,
    MRMDataComponent,
    DepositorsComponent,
    AADSDataComponent,
    FCIDataComponent,
    SchemesComponent,
    NotificationsComponent,
    GodownAllotmentComponent,
    RegionAllotmentComponent,
    PageNotFoundComponent,
    CBStatementComponent,
    StockReceiptComponent,
    IssueReceiptComponent,
    DeliveryReceiptComponent,
    TruckReceiptComponent,
    StockReceiptRegisterComponent,
    StockIssueRegisterComponent,
    TruckMemoRegisterComponent,
    DeliveryOrderRegisterComponent,
    CommodityReceiptComponent,
    SchemeReceiptComponent,
    TransactionReceiptComponent,
    CommodityIssueMemoComponent,
    SchemeIssueMemoComponent,
    WriteOffComponent,
    HullingDetailsComponent,
    TruckToRegionComponent,
    TruckFromRegionComponent,
    ReceiptHOPurchaseComponent,
    ReceiptROPurchaseComponent,
    ReceiptRONOPurchaseComponent,
    CustomerDetailsComponent,
    SocietyWiseCommodityAbstractComponent,
    GunnyGuGrComponent,
    StackCardOpeningEntryComponent,
    // OpeningBalanceComponent,
    TruckTransitComponent,
    DecimalDirective,
    OtherSchemesComponent,
    AllSchemeComponent,
    SocietyAbstractComponent,
    DemandDraftComponent,
    MarginAmountComponent,
    ReceiptSchemeComponent,
    IssueSchemeComponent,
    IssueSchemeCrsComponent,
    IssueSchemeCoOpComponent,
    TruckMemoSchemeComponent,
    QuantityDetailCommodityComponent,
    SocietMasterComponent,
    OpeningBalanceDetailsComponent,
    DepositorCustomerMasterComponent,
    RateMasterComponent,
    ShopSocietUpdateMasterComponent,
    ItemMasterModificationComponent,
    CustomerListComponent,
    UserMasterComponent,
    OpeningBalanceCurrentYearComponent,
    DDChequeEntryComponent,
    StockstatementreportComponent,
    TransactionStatusComponent,
    DailyDocumentsComponent,
    DailyDocumentIssueComponent,
    AmountDecimalDirective,
    StackCardOpeningComponent,
    StackCardComponent,
    GodownProfileComponent,
    PackingMasterComponent,
    OtherMasterComponent,
    CncCorrectionComponent,
    SchemeCommodityComponent,
    SocietyMasterNewComponent,
    IssuerMasterComponent,
    CashReceiptRegisterComponent,
    IssueTypeAbstractComponent,
    ReceiptTypeAbstractComponent,
    OapComponent,
    SplpdsComponent,
    AnnapoornaComponent,
    DocumentCorrectionComponent,
    StackCardRegisterComponent,
    OCRReportComponent,
    CorrectionSlipComponent,
    OWSComponent,
    StackClosingCard2Component,
    OpeningBalanceStackDetailsComponent,
    SalesTaxEntryComponent,
    PurchaseTaxEntryComponent,
    PartyLedgerMasterComponent,
    AllotmentDetailsComponent,
    ServiceProviderEntryComponent,
    AllotmentIssueQuantityComponent,
    ProcessToG2GComponent,
    PartyLedgerUpdateComponent,
    GodownEmployeeDetailsComponent,
    NotificationComponent,
    NotificationPopupComponent,
    DailyDocumentTruckComponent,
    DailyStatementComponent,
    LoadMenWagesComponent,
    LoadMenUnloadingWagesComponent,
    GodownDashboardComponent,
    ProcessToGPSComponent,
    IssueGatepassComponent,
    QuantityDetailIssueComponent,
    StackCardCorrectionComponent,
    StackRunningCardDateComponent,
    StockLedgerStatementComponent,
    AuditInceptionComponent,
    SalesTaxComponent,
    PurchaseTaxComponent,
    ServiceProviderComponent,
    AuditReportComponent,
    StockCommodityComponent,
    GodownInchargeComponent,
  ],
  imports: [
    BrowserModule,
    DialogModule,
    ReactiveFormsModule,
    HttpClientModule,
    ConfirmDialogModule,
    FormsModule,
    TableModule,
    OverlayPanelModule,
    AppRoutingModule,
    MenubarModule,
    BrowserAnimationsModule,
    CheckboxModule,
    RadioButtonModule,
    DropdownModule,
    ButtonModule,
    FieldsetModule,
    CalendarModule,
    CardModule,
    HighchartsChartModule,
    PanelModule,
    TreeTableModule,
    SplitButtonModule,
    AutoCompleteModule,
    ToastModule,
    InputTextModule,
    TabViewModule,
    TooltipModule,
    TooltipModule,
    BlockUIModule,
    ListboxModule,
    ProgressSpinnerModule,
    InputMaskModule,
    FileUploadModule,
    SlimLoadingBarModule,
    // SignaturePad
  ],
  providers: [AuthService, ConfirmationService, TableConstants, StatusMessage, LoginService,
    DatePipe, RestAPIService, PathConstants, ExcelService, MessageService, RoleBasedService, PrintService],
  bootstrap: [AppComponent]
})
export class AppModule { }
