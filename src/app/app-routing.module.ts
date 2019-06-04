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
import { IssueReceiptComponent } from './issue-receipt/issue-receipt.component';


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
  { path: 'stockPurchase', component: StockPurchaseComponent },
  { path: 'regionalAllotment', component: RegionAllotmentComponent },
  { path: 'godownAllotment', component: GodownAllotmentComponent },
  { path: 'cbStatement', component: CBStatementComponent },
  { path: 'stockReceipt', component: StockReceiptComponent },
  { path: 'issueReceipt', component: IssueReceiptComponent },
  { path: '**', component: PageNotFoundComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
