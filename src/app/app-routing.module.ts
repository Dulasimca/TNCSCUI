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
  { path: 'stockReceipt', component: StockReceiptComponent, canActivate: [AuthGuard] },
  { path: 'issueReceipt', component: IssueReceiptComponent, canActivate: [AuthGuard] },
  { path: 'deliveryReceipt', component: DeliveryReceiptComponent, canActivate: [AuthGuard] },
  { path: 'truckReceipt', component: TruckReceiptComponent, canActivate: [AuthGuard] },
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
  { path: '**', component: PageNotFoundComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
