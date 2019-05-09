import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { DailyStockStatementComponent } from './dailystockstatement/dailystockstatement.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home', component: HomeComponent
    },
  { path: 'login', component: LoginComponent },
  { path: 'forgetpassword', component: ForgetpasswordComponent },
  { path: 'dailyStockStatement', component: DailyStockStatementComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
