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


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home', component: HomeComponent
  },
  { path: 'login', component: LoginComponent },
  { path: 'dailyStockStatement', component: DailyStockStatementComponent, canActivate: [AuthGuard] },
  { path: 'godownData', component: GodownDataComponent, canActivate: [AuthGuard] },
  { path: 'crsData', component: CRSDataComponent, canActivate: [AuthGuard] },
  { path: 'mrmData', component: MRMDataComponent, canActivate: [AuthGuard] },
  { path: 'aadsData', component: AADSDataComponent, canActivate: [AuthGuard] },
  { path: 'hullingAgencies', component: HullingAgenciesComponent, canActivate: [AuthGuard] },
  { path: 'fciData', component: FCIDataComponent, canActivate: [AuthGuard] },
  { path: 'regions', component: RegionsDataComponent, canActivate: [AuthGuard] },
  { path: 'schemes', component: SchemesComponent, canActivate: [AuthGuard] },
  { path: 'depositors', component: DepositorsComponent, canActivate: [AuthGuard] }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
