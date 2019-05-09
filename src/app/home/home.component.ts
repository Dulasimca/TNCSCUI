import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../shared-services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isViewLogin: boolean;
  date: Date;
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
            console.log('total', total);
          });
        });

      }
    },
    hover: {
      animationDuration: 0
    },
  };
  riceChartData = [
    { data: [65, 110, 80, 81, 56, 55, 120, 56, 110, 88, 90, 89, 77, 67, 124, 65, 87, 178, 90, 89, 78, 90, 89, 155, 48, 90, 165, 56, 88, 120, 90, 50, 70, 110], label: 'BOILED COMMON', stack: 4 },
    { data: [120, 45, 80, 78, 66, 100, 71, 56, 88, 66, 92, 89, 110, 54, 62, 102, 98, 66, 90, 81, 78, 65, 75, 82, 48, 90, 77, 120, 68, 32, 70, 25, 100, 65], label: 'BOILED GRADEA', stack: 4 },
    { data: [190, 22, 55, 76, 166, 87, 71, 90, 77, 155, 92, 89, 34, 54, 46, 32, 88, 110, 90, 81, 78, 44, 56, 66, 48, 93, 76, 43, 125, 95, 55, 75, 40, 78], label: 'RAW COMMON', stack: 4 },
    { data: [70, 55, 123, 111, 11, 66, 42, 35, 98, 120, 56, 63, 88, 29, 89, 70, 54, 108, 70, 81, 78, 87, 56, 54, 48, 93, 88, 43, 77, 150, 30, 60, 80, 55], label: 'RAW GRADEA', stack: 4 }

  ];
  dhallOilChartData = [
    { data: [65, 110, 80, 81, 56, 55, 120, 56, 110, 88, 90, 89, 77, 67, 124, 65, 87, 178, 90, 89, 78, 90, 89, 155, 48, 90, 165, 56, 88, 120, 90, 50, 70, 110], label: 'DHALL', stack: 4 },
    { data: [120, 45, 80, 78, 66, 100, 71, 56, 88, 66, 92, 89, 110, 54, 62, 102, 98, 66, 90, 81, 78, 65, 75, 82, 48, 90, 77, 120, 68, 32, 70, 25, 100, 65], label: 'PAMOLIEN OIL', stack: 4 },
    { data: [190, 22, 55, 76, 166, 87, 71, 90, 77, 155, 92, 89, 34, 54, 46, 32, 88, 110, 90, 81, 78, 44, 56, 66, 48, 93, 76, 43, 125, 95, 55, 75, 40, 78], label: 'PAMOLIEN POUCH', stack: 4 },

  ];

  wheatSugarChartData = [
    { data: [120, 45, 80, 78, 66, 100, 71, 56, 88, 66, 92, 89, 110, 54, 62, 102, 98, 66, 90, 81, 78, 65, 75, 82, 48, 90, 77, 120, 68, 32, 70, 25, 100, 65], fill: false, label: 'WHEAT', stack: 4 },
    { data: [70, 55, 123, 111, 11, 66, 42, 35, 98, 120, 56, 63, 88, 29, 89, 70, 54, 108, 70, 81, 78, 87, 56, 54, 48, 93, 88, 43, 77, 150, 30, 60, 80, 55], fill: false, label: 'SUGAR', stack: 4 }

  ];


  chartLabels = ['Ariyalur', 'Chennai North', 'Chennai South', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindugal', 'Erode',
    'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Nagapattinam', 'Namakkal', 'Niligiris', 'Perambalur', 'Pudukottai', 'Ramanathapuram', 'Salem',
    'Sivaganga', 'Thanjavur', 'Theni', 'Thoothukudi', 'Trichy', 'Tirunelveli', 'Thiruvallore', 'Tripur', 'Trivarur', 'Thiruvannamalai', 'Tuticorn', 'Vellore', 'Villipuram', 'Viruthunagar'];

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

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.isViewLogin = this.authService.getValidUser();
  }

}
