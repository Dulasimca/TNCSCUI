import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../shared-services/auth.service';
import { RestAPIService } from '../shared-services/restAPI.service';
import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChartConstants } from '../constants/chartconstants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  date: any;
  riceChartData: any;
  dhallOilChartData: any;
  wheatSugarChartData: any;
  chartLabels: any[];
  chartOptions = {
    responsive: true,
    scaleShowValues: true,
    scaleShowVerticalLines: true,
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        stacked: true,
        stackLabels: {
          enabled: true
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        },
        stacked: true,
      }],
    },
    animation: {
      onComplete: function () {
        const chartInstance = this.chart,
          ctx = chartInstance.ctx;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = "Black";
        this.data.datasets.forEach(function (dataset, i) {
          const meta = chartInstance.controller.getDatasetMeta(i);
          meta.data.forEach(function (bar, index) {
            const data = dataset.data[index];
            ctx.fillText(data, bar._model.x, bar._model.y + 8);
            var total = 0;
            for (var i = 0; i < data.length; i++)
              total += data[i].data[index];
          });
        });

      }
    },
    hover: {
      animationDuration: 0
    },
  };

  onChartClick(event) {
    console.log(event);
  }
  public chartColors: Array<any> = [
    { // first color
      backgroundColor: '#00ff00',
      borderColor: '#55ff00',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)'
    },
    { // second color
      backgroundColor: '#00cc00',
      borderColor: '#008000',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)'
    },
    { // third color
      backgroundColor: '#ffff1a',
      borderColor: '#e6e600',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)'
    },
    { // fourth color
      backgroundColor: '#ffcc00',
      borderColor: '#e69900',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)'
    }];

  constructor(private authService: AuthService, private restApiService: RestAPIService, private datePipe: DatePipe, private chartConstants: ChartConstants) {

  }

  ngOnInit() {
    const date = new Date();
    this.date = this.datePipe.transform(date, 'mm/dd/yyyy');
    let params = new HttpParams().set('Date', this.date);
    this.chartLabels = this.chartConstants.districtNames;
    this.restApiService.getByParameters('/api/Dashboard/GetRiceList', params).subscribe((response: any[]) => {
      if (response !== undefined) {
        this.riceChartData = [{ data: response[2], label: 'BOILED COMMON', stack: 4 },
        { data: response[3], label: 'BOILED GRADEA', stack: 4 },
        { data: response[4], label: 'RAW COMMON', stack: 4 },
        { data: response[5], label: 'RAW GRADEA', stack: 4 }];
        this.dhallOilChartData = [
          { data: response[6], label: 'DHALL', stack: 4 },
          { data: response[7], label: 'PAMOLIEN OIL', stack: 4 },
          { data: response[8], label: 'PAMOLIEN POUCH', stack: 4 },

        ];
        this.wheatSugarChartData = [
          { data: response[9], fill: false, label: 'WHEAT', stack: 4 },
          { data: response[10], fill: false, label: 'SUGAR', stack: 4 }

        ];
      }
    });
  }
}
