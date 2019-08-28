import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DailyStockStatementComponent } from './reports/dailystockstatement/dailystockstatement.component';
import { GodownDataComponent } from './masters/godown-data/godown-data.component';
import { CRSDataComponent } from './masters/crsdata/crsdata.component';
import { MRMDataComponent } from './masters/mrmdata/mrmdata.component';
import { AADSDataComponent } from './masters/aadsdata/aadsdata.component';
import { HullingAgenciesComponent } from './masters/hulling-agencies/hulling-agencies.component';
import { AuthGuard } from './shared-services/auth.guard';
import { FCIDataComponent } from './masters/fcidata/fcidata.component';
import { RegionsDataComponent } from './masters/regions-data/regions-data.component';
import { SchemesComponent } from './masters/schemes/schemes.component';
import { DepositorsComponent } from './masters/depositors/depositors.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StockPurchaseComponent } from './purchase/stockpurchase/stockpurchase.component';
import { RegionAllotmentComponent } from './purchase/regionallotment/regionallotment.component';
import { GodownAllotmentComponent } from './purchase/godownallotment/godownallotment.component';
import { CBStatementComponent } from './reports/cb-statement/cb-statement.component';
import { StockReceiptComponent } from './Documents/stock-receipt/stock-receipt.component';
import { IssueReceiptComponent } from './Documents/issue-receipt/issue-receipt.component';
import { DeliveryReceiptComponent } from './Documents/delivery-receipt/delivery-receipt.component';
import { TruckReceiptComponent } from './Documents/truck-receipt/truck-receipt.component';
import { StockIssueRegisterComponent } from './reports/stock-issue-register/stock-issue-register.component';
import { TruckMemoRegisterComponent } from './reports/truck-memo-register/truck-memo-register.component';
import { StockReceiptRegisterComponent } from './reports/stock-receipt-register/stock-receipt-register.component';
import { DeliveryOrderRegisterComponent } from './reports/delivery-order-register/delivery-order-register.component';
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
import { ReceiptRONOPurchaseComponent } from './reports/purchase-AC/receipt-rono-purchase/receipt-rono-purchase.component';
import { ReceiptROPurchaseComponent } from './reports/purchase-AC/receipt-ro-purchase/receipt-ro-purchase.component';
import { CustomerDetailsComponent } from './reports/sales-AC/issue-memo/customer-details/customer-details.component';
import { SocietyWiseCommodityAbstractComponent } from './reports/sales-AC/issue-memo/society-wise-commodity-abstract/society-wise-commodity-abstract.component';
import { GunnyGuGrComponent } from './reports/gunny-gu-gr/gunny-gu-gr.component';
import { OpeningBalanceComponent } from './opening-balance/opening-balance.component';
import { TruckTransitComponent } from './reports/truck-transit/truck-transit.component';
import { ReceiptSchemeComponent } from './Quantity/receipt-scheme/receipt-scheme.component';
import { IssueSchemeComponent } from './Quantity/IssueScheme/issue-scheme/issue-scheme.component';
import { IssueSchemeCrsComponent } from './Quantity/IssueScheme/issue-scheme-crs/issue-scheme-crs.component';
import { IssueSchemeCoOpComponent } from './Quantity/IssueScheme/issue-scheme-co-op/issue-scheme-co-op.component';
import { TruckMemoComponent } from './Quantity/truck-memo/truck-memo.component';
import { ReceiptIssueCommodityComponent } from './Quantity/receipt-issue-commodity/receipt-issue-commodity.component';
import { ReceiptIssueOtherItemsComponent } from './Quantity/receipt-issue-other-items/receipt-issue-other-items.component';
import { SocietMasterComponent } from './Documents/Master/society-master/societ-master.component';
import { ShopWiseAllotmentComponent } from './Documents/Master/shop-wise-allotment/shop-wise-allotment.component';
import { OpeningBalanceDetailsComponent } from './Documents/Master/opening-balance-details/opening-balance-details.component';
import { DepositorCustomerMasterComponent } from './Documents/Master/depositor-customer-master/depositor-customer-master.component';
import { EmployeeMasterComponent } from './Documents/Master/employee-master/employee-master.component';
import { RateMasterComponent } from './Documents/Master/rate-master/rate-master.component';
import { ShopSocietUpdateMasterComponent } from './Documents/Master/shopSocietyUpdate/shopSocietyUpdate.component';
import { ItemMasterModificationComponent } from './Documents/Master/item-master-modification/item-master-modification.component';
import { CustomerListComponent } from './Documents/Master/customer-list/customer-list.component';
import { OpeningBalanceCurrentYearComponent } from './Documents/Master/opening-balance-current-year/opening-balance-current-year.component';
import { UserMasterComponent } from './Documents/Master/user-master/user-master.component';
import { StockstatementreportComponent } from './reports/stockstatementreport/stockstatementreport.component';
import { TransactionStatusComponent } from './reports/transaction-status/transaction-status.component';
import { StackCardOpeningEntryComponent } from './Documents/StackCard/stack-card-opening-entry/stack-card-opening-entry.component';
import { StackCardClosingComponent } from './Documents/StackCard/stack-card-closing/stack-card-closing.component';
import { DuplicateIssueMemoComponent } from './Documents/StackCard/duplicate-issue-memo/duplicate-issue-memo.component';
import { DailyDocumentsComponent } from './reports/DailyDocument/daily-document-receipt/daily-documents.component';
import { DailyDocumentIssueComponent } from './reports/DailyDocument/daily-document-issue/daily-document-issue.component';
import { StackCardOpeningComponent } from './reports/StackCard/stack-card-opening/stack-card-opening.component';
import { StackCardComponent } from './reports/StackCard/stack-card/stack-card.component';
import { GodownProfileComponent } from './godown-profile/godown-profile.component';
import { PackingMasterComponent } from './UserMaster/packing-master/packing-master.component';
import { OtherMasterComponent } from './UserMaster/other-master/other-master.component';
import { CncCorrectionComponent } from './UserMaster/cnc-correction/cnc-correction.component';
import { SchemeCommodityComponent } from './Documents/Master/scheme-commodity/scheme-commodity.component';
import { SocietyMasterNewComponent } from './Documents/Master/society-master-new/society-master-new.component';
import { AllSchemeComponent } from './reports/DeliveryOrderReport/all-scheme/all-scheme.component';
import { SPLPDSComponent } from './reports/DeliveryOrderReport/splpds/splpds.component';
import { OapComponent } from './reports/DeliveryOrderReport/oap/oap.component';
import { AanComponent } from './reports/DeliveryOrderReport/aan/aan.component';
import { OtherSchemeComponent } from './reports/DeliveryOrderReport/other-scheme/other-scheme.component';
import { SocietyAbstractComponent } from './reports/DeliveryOrderReport/society-abstract/society-abstract.component';
import { DemandDraftComponent } from './reports/DeliveryOrderReport/demand-draft/demand-draft.component';
import { MarginAmountComponent } from './reports/DeliveryOrderReport/margin-amount/margin-amount.component';
import { DDChequeEntryComponent } from './Documents/DD-cheque-entry/DD-cheque-entry.component';
import { IssuerMasterComponent } from './Documents/Master/IssuerMaster/Issuer-master.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'Home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'Daily Stock Statement', component: DailyStockStatementComponent, canActivate: [AuthGuard] },
  { path: 'godownData', component: GodownDataComponent, canActivate: [AuthGuard] },
  { path: 'crsData', component: CRSDataComponent, canActivate: [AuthGuard] },
  { path: 'mrmData', component: MRMDataComponent, canActivate: [AuthGuard] },
  { path: 'aadsData', component: AADSDataComponent, canActivate: [AuthGuard] },
  { path: 'hullingAgencies', component: HullingAgenciesComponent, canActivate: [AuthGuard] },
  { path: 'fciData', component: FCIDataComponent, canActivate: [AuthGuard] },
  { path: 'regions', component: RegionsDataComponent, canActivate: [AuthGuard] },
  { path: 'schemes', component: SchemesComponent, canActivate: [AuthGuard] },
  { path: 'depositors', component: DepositorsComponent, canActivate: [AuthGuard] },
  { path: 'stockPurchase', component: StockPurchaseComponent, canActivate: [AuthGuard] },
  { path: 'regionalAllotment', component: RegionAllotmentComponent, canActivate: [AuthGuard] },
  { path: 'godownAllotment', component: GodownAllotmentComponent, canActivate: [AuthGuard] },
  { path: 'cbStatement', component: CBStatementComponent, canActivate: [AuthGuard] },
  { path: 'Stock Receipt', component: StockReceiptComponent, canActivate: [AuthGuard] },
  { path: 'Stock Issue Memo', component: IssueReceiptComponent, canActivate: [AuthGuard] },
  { path: 'Delivery Order', component: DeliveryReceiptComponent, canActivate: [AuthGuard] },
  { path: 'Truck Memo', component: TruckReceiptComponent, canActivate: [AuthGuard] },
  { path: 'Stock Receipt Register', component: StockReceiptRegisterComponent, canActivate: [AuthGuard] },
  { path: 'Stock Issue Register', component: StockIssueRegisterComponent, canActivate: [AuthGuard] },
  { path: 'Truck Memo Register', component: TruckMemoRegisterComponent, canActivate: [AuthGuard] },
  { path: 'Delivery Order Register', component: DeliveryOrderRegisterComponent, canActivate: [AuthGuard] },
  { path: 'Commodity Receipt', component: CommodityReceiptComponent, canActivate: [AuthGuard] },
  { path: 'Scheme Receipt', component: SchemeReceiptComponent, canActivate: [AuthGuard] },
  { path: 'Transaction Receipt', component: TransactionReceiptComponent, canActivate: [AuthGuard] },
  { path: 'Commodity Issuememo', component: CommodityIssueMemoComponent, canActivate: [AuthGuard] },
  { path: 'Scheme Issuememo', component: SchemeIssueMemoComponent, canActivate: [AuthGuard] },
  { path: 'Writeoff', component: WriteOffComponent, canActivate: [AuthGuard] },
  { path: 'Hulling Details', component: HullingDetailsComponent, canActivate: [AuthGuard] },
  { path: 'Truck to Region', component: TruckToRegionComponent, canActivate: [AuthGuard] },
  { path: 'Truck from Region', component: TruckFromRegionComponent, canActivate: [AuthGuard] },
  { path: 'Ho Purchase', component: ReceiptHOPurchaseComponent, canActivate: [AuthGuard] },
  { path: 'Release Orderno', component: ReceiptRONOPurchaseComponent, canActivate: [AuthGuard] },
  { path: 'Regional Purchase', component: ReceiptROPurchaseComponent, canActivate: [AuthGuard] },
  { path: 'Issue Memo Customer Details', component: CustomerDetailsComponent, canActivate: [AuthGuard] },
  { path: 'Issue Memo Society Wise', component: SocietyWiseCommodityAbstractComponent, canActivate: [AuthGuard] },
  { path: 'Gunny_GUGR', component: GunnyGuGrComponent, canActivate: [AuthGuard] },
  { path: 'Opening Balance', component: OpeningBalanceComponent, canActivate: [AuthGuard] },
  { path: 'Truck Transit', component: TruckTransitComponent, canActivate: [AuthGuard] },
  { path: 'Do All Scheme', component: AllSchemeComponent },
  { path: 'Do Splpds', component: SPLPDSComponent },
  { path: 'Do OAP', component: OapComponent },
  { path: 'Do Annapoorna', component: AanComponent },
  { path: 'Do Other Schemes', component: OtherSchemeComponent },
  { path: 'Do Society Abstract', component: SocietyAbstractComponent },
  { path: 'Demand Draft with Bankname', component: DemandDraftComponent },
  { path: 'Do Margin Amount Details', component: MarginAmountComponent },
  { path: 'Scheme Abstract Receipt', component: ReceiptSchemeComponent },
  { path: 'Scheme Abstract Issues- All', component: IssueSchemeComponent },
  { path: 'Scheme Abstract Issue- Only Crs', component: IssueSchemeCrsComponent },
  { path: 'Scheme Abstract Issue- Only Coop', component: IssueSchemeCoOpComponent },
  { path: 'Scheme Abstract Truck', component: TruckMemoComponent },
  { path: 'Qty A/c Receipt/Issue - Commodity', component: ReceiptIssueCommodityComponent },
  { path: 'Qty A/c Receipt/Issue - Otheritems', component: ReceiptIssueOtherItemsComponent },
  { path: 'Society Master', component: SocietMasterComponent },
  { path: 'Shop Wise Allotment Master', component: ShopWiseAllotmentComponent },
  { path: 'Opening Balance Master', component: OpeningBalanceDetailsComponent },
  { path: 'Current Year Shortage', component: OpeningBalanceCurrentYearComponent },
  { path: 'Depositor Master', component: DepositorCustomerMasterComponent },
  { path: 'Employee Master', component: EmployeeMasterComponent },
  { path: 'Rate Master', component: RateMasterComponent },
  { path: 'User Master', component: UserMasterComponent },
  { path: 'Shop Society Update', component: ShopSocietUpdateMasterComponent },
  { path: 'Commodity Break', component: ItemMasterModificationComponent },
  { path: 'Godown Customer List', component: CustomerListComponent },
  { path: 'Stack Card Opening Entry', component: StackCardOpeningEntryComponent },
  { path: 'Stack Card Closing Entry', component: StackCardClosingComponent },
  { path: 'Dulpicate Issue Memo', component: DuplicateIssueMemoComponent },
  { path: 'Stock Statement', component: StockstatementreportComponent, canActivate: [AuthGuard] },
  { path: 'Transaction Status', component: TransactionStatusComponent },
  { path: 'Daily Receipt', component: DailyDocumentsComponent },
  { path: 'Daily Issue', component: DailyDocumentIssueComponent },
  { path: 'Stack Card Opening', component: StackCardOpeningComponent },
  { path: 'Stack Card', component: StackCardComponent },
  { path: 'Godown Profile', component: GodownProfileComponent },
  { path: 'Packing Master', component: PackingMasterComponent },
  { path: 'Other Master', component: OtherMasterComponent },
  { path: 'Cnc Correction', component: CncCorrectionComponent },
  { path: 'Scheme Commodity', component: SchemeCommodityComponent },
  { path: 'DD Receipt Entry', component: DDChequeEntryComponent },
  { path: 'Society Master Entry', component: SocietyMasterNewComponent },
  { path: 'Issuer Master Report', component: IssuerMasterComponent},
  { path: 'pageNotFound', redirectTo: 'Home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
