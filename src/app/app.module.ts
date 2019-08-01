import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DataTableModule, SharedModule, ButtonModule, MenubarModule, DropdownModule } from 'primeng/primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CheckboxModule } from 'primeng/checkbox';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { HighchartsChartModule } from 'highcharts-angular';
import { CarouselModule } from 'ngx-bootstrap';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {InputTextModule} from 'primeng/inputtext';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FieldsetModule} from 'primeng/fieldset';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TabViewModule} from 'primeng/tabview';
import {InputSwitchModule} from 'primeng/inputswitch';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from './shared-services/auth.service';
import { MenuService } from './menu/menu.service';
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
import { LoginService } from './login/login.service';
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
import { OpeningBalanceComponent } from './opening-balance/opening-balance.component';
import { PrintService } from './print.service';
import { TruckTransitComponent } from './reports/truck-transit/truck-transit.component';
import { DecimalDirective } from './directives/decimal.directive';
import { AllSchemeComponent } from './DeliveryOrderReport/all-scheme/all-scheme.component';
import { SPLPDSComponent } from './DeliveryOrderReport/splpds/splpds.component';
import { OapComponent } from './DeliveryOrderReport/oap/oap.component';
import { AanComponent } from './DeliveryOrderReport/aan/aan.component';
import { OtherSchemeComponent } from './DeliveryOrderReport/other-scheme/other-scheme.component';
import { SocietyAbstractComponent } from './DeliveryOrderReport/society-abstract/society-abstract.component';
import { DemandDraftComponent } from './DeliveryOrderReport/demand-draft/demand-draft.component';
import { MarginAmountComponent } from './DeliveryOrderReport/margin-amount/margin-amount.component';
import { ReceiptSchemeComponent } from './Quantity/receipt-scheme/receipt-scheme.component';
import { IssueSchemeComponent } from './Quantity/IssueScheme/issue-scheme/issue-scheme.component';
import { IssueSchemeCrsComponent } from './Quantity/IssueScheme/issue-scheme-crs/issue-scheme-crs.component';
import { IssueSchemeCoOpComponent } from './Quantity/IssueScheme/issue-scheme-co-op/issue-scheme-co-op.component';
import { TruckMemoComponent } from './Quantity/truck-memo/truck-memo.component';
import { ReceiptIssueCommodityComponent } from './Quantity/receipt-issue-commodity/receipt-issue-commodity.component';
import { ReceiptIssueOtherItemsComponent } from './Quantity/receipt-issue-other-items/receipt-issue-other-items.component';
import { SocietMasterComponent } from './Documents/Master/societ-master/societ-master.component';
import { ShopWiseAllotmentComponent } from './Documents/Master/shop-wise-allotment/shop-wise-allotment.component';
import { OpeningBalanceDetailsComponent } from './Documents/Master/opening-balance-details/opening-balance-details.component';
import { DepositorCustomerMasterComponent } from './Documents/Master/depositor-customer-master/depositor-customer-master.component';
import { EmployeeMasterComponent } from './Documents/Master/employee-master/employee-master.component';
import { RateMasterComponent } from './Documents/Master/rate-master/rate-master.component';
import { SocietMasterEntryComponent } from './Documents/Master/societ-master-entry/societ-master-entry.component';
import { ItemMasterModificationComponent } from './Documents/Master/item-master-modification/item-master-modification.component';
import { CustomerListComponent } from './Documents/Master/customer-list/customer-list.component';
import { UserMasterComponent } from './Documents/Master/user-master/user-master.component';
import { OpeningBalanceCurrentYearComponent } from './Documents/Master/opening-balance-current-year/opening-balance-current-year.component';
import { StockstatementreportComponent } from './reports/stockstatementreport/stockstatementreport.component';
import { TransactionStatusComponent } from './reports/transaction-status/transaction-status.component';
import { DailyDocumentsComponent } from './reports/DailyDocument/daily-document-receipt/daily-documents.component';
import { StackCardOpeningEntryComponent } from './Documents/StackCard/stack-card-opening-entry/stack-card-opening-entry.component';
import { StackCardClosingComponent } from './Documents/StackCard/stack-card-closing/stack-card-closing.component';
import { StackReceiptEntryComponent } from './Documents/StackCard/stack-receipt-entry/stack-receipt-entry.component';
import { DuplicateIssueMemoComponent } from './Documents/StackCard/duplicate-issue-memo/duplicate-issue-memo.component';
import { DailyDocumentIssueComponent } from './reports/DailyDocument/daily-document-issue/daily-document-issue.component';
import { TooltipModule } from 'primeng/tooltip';
import { AmountDecimalDirective } from './directives/DecimalForAmount.directive';

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
    OpeningBalanceComponent,
    TruckTransitComponent,
    DecimalDirective,
    AllSchemeComponent,
    SPLPDSComponent,
    OapComponent,
    AanComponent,
    OtherSchemeComponent,
    SocietyAbstractComponent,
    DemandDraftComponent,
    MarginAmountComponent,
    ReceiptSchemeComponent,
    IssueSchemeComponent,
    IssueSchemeCrsComponent,
    IssueSchemeCoOpComponent,
    TruckMemoComponent,
    ReceiptIssueCommodityComponent,
    ReceiptIssueOtherItemsComponent,
    SocietMasterComponent,
    ShopWiseAllotmentComponent,
    OpeningBalanceDetailsComponent,
    DepositorCustomerMasterComponent,
    EmployeeMasterComponent,
    RateMasterComponent,
    SocietMasterEntryComponent,
    ItemMasterModificationComponent,
    CustomerListComponent,
    UserMasterComponent,
    OpeningBalanceCurrentYearComponent,
    StackCardClosingComponent,
    StackReceiptEntryComponent,
    DuplicateIssueMemoComponent,
    StockstatementreportComponent,
    TransactionStatusComponent,
    DailyDocumentsComponent,
    DailyDocumentIssueComponent,
    AmountDecimalDirective,
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
    DataTableModule,
    CheckboxModule,
    RadioButtonModule,
    DropdownModule,
    SharedModule,
    ButtonModule,
    FieldsetModule,
    CalendarModule,
    CardModule,
    HighchartsChartModule,
    PanelModule,
    TreeTableModule,
    CarouselModule,
    SplitButtonModule,
    AutoCompleteModule,
    ToastModule,
    InputTextModule,
    MatDatepickerModule,
    TabViewModule,
    InputSwitchModule,
    TooltipModule
  ],
  providers: [MenuService, AuthService, ConfirmationService, TableConstants,
    DatePipe, RestAPIService, PathConstants, LoginService, ExcelService, MessageService, RoleBasedService, PrintService],
  bootstrap: [AppComponent]
})
export class AppModule { }
