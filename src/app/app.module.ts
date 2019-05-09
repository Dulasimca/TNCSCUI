import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DataTableModule, SharedModule, ButtonModule, MenubarModule, DropdownModule } from 'primeng/primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChartsModule } from 'ng2-charts';
import { ChartModule } from 'primeng/chart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CheckboxModule } from 'primeng/checkbox';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ConfirmationService } from 'primeng/api';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { DailyStockStatementComponent } from './dailystockstatement/dailystockstatement.component';
import { AuthService } from './shared-services/auth.service';
import { MenuService } from './menu/menu.service';
import { TableConstants } from './shared/tableconstants';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MenuComponent,
    FooterComponent,
    HeaderComponent,
    ForgetpasswordComponent,
    DailyStockStatementComponent,
  ],
  imports: [
    BrowserModule,
    DialogModule,
    ReactiveFormsModule,
    HttpClientModule,
    ConfirmDialogModule,
    FormsModule,
    ChartModule,
    TableModule,
    OverlayPanelModule,
    AppRoutingModule,
    MenubarModule,
    BrowserAnimationsModule,
    DataTableModule,
    CheckboxModule,
    DropdownModule,
    SharedModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    ChartsModule,
    PanelModule

  ],
 // entryComponents: [TableConstants],
  providers: [MenuService, AuthService, ConfirmationService, TableConstants],
  bootstrap: [AppComponent]
})
export class AppModule { }
