import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Constants } from '../../config/constants';
import { HeaderComponent } from '../index/header/header.component';
import { CommonModule, Location } from '@angular/common';


@Component({
  selector: 'app-stat',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {

  @ViewChild('myChart', { static: true }) myChart!: ElementRef;
  data: any[] = [];
  userId: number | null = null; 
  statistics: any;
  imageID: any;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private constants: Constants,
    private http: HttpClient,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      try {
        if (typeof params['data'] === 'string') {
          this.data = JSON.parse(params['data']);
        } else {
          this.data = params['data'];
        }
      } catch (error) {
        console.error('Error parsing JSON data:', error);
      }
      console.log('Received data in profile:', this.data);
      const firstItem = this.data.length > 0 ? this.data[0] : null;
      this.userId = firstItem ? firstItem.userID : null;
      // this.getGraph();
      this.cdr.detectChanges();
      this.getData()
    });
  }

  getData(): void {
    // Example of fetching data from API and assigning it to this.data
    this.http.get<any[]>(`${this.constants.API_ENDPOINT}/get/score/statistics/${this.imageID}`).subscribe(
      (response) => {
        this.data = response;
        this.createCharts();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }



  createChartData(votes: any[]): any {
    const maxDate = new Date();
    const minDate = new Date(maxDate);
    minDate.setDate(maxDate.getDate() - 6); // นับย้อนหลัง 7 วัน
  
    const labels = [];
    const data = [];
  
    for (let currentDate = new Date(minDate); currentDate <= maxDate; currentDate.setDate(currentDate.getDate() + 1)) {
      labels.push(currentDate.toISOString().slice(0, 10));
  
      const vote = votes.find(v => v.voteDate.slice(0, 10) === currentDate.toISOString().slice(0, 10));
      if (vote) {
        data.push(vote.voteScore);
      } else {
        data.push(null); // ใส่ค่า null ในกรณีที่ไม่มีข้อมูลในวันนั้น
      }
    }
    return { labels, data };
  }
  
  
  createCharts(): void {
    this.data.forEach((imageID: any) => {
      const chartData = this.createChartData(imageID.vote);
      
      // สร้าง canvas element สำหรับแต่ละรูปภาพ
      const container = document.createElement('div');
      container.style.display = 'block';
      container.style.marginTop = '-10%';
      container.style.width = '700px';
      container.style.height = '500px';
      container.style.marginLeft = '50px';
      // container.style.backgroundColor='white';
      
      const canvas = document.createElement('canvas');
      canvas.id = 'myChart-' + imageID.imageID;
      container.appendChild(canvas);
  
      // เพิ่ม canvas เข้าไปใน DOM
      const chartContainer = document.getElementById('chartContainer');
      if (chartContainer) {
        chartContainer.appendChild(container);
      }
  
      // สร้างกราฟใน canvas ของแต่ละรูปภาพ
      const ctx = canvas as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [{
          label: 'Score',
          data: chartData.data,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            // grid: {
            //   color: 'white' // ตั้งค่าสีของเส้นกริดให้เป็นสีขาว
            // },
            ticks: {
              color: 'white' // กำหนดสีของ labels เป็นสีขาว
            },
            beginAtZero: true
          },
          
          x: {
            // grid: {
            //   color: 'white' // ตั้งค่าสีของเส้นกริดให้เป็นสีขาว
            // }
            ticks: {
              color: 'white' // กำหนดสีของ labels เป็นสีขาว
            }
          },
          
        }
      }
    });
    });
  }


  goBack(): void {
    this.location.back();
  }



  
  // getGraph(): void {
  //   const url = `${this.constants.API_ENDPOINT}/vote/score/statistics/${this.data.imageID}`;
  //   this.http.get(url).subscribe(
  //     (response: any) => {
  //       console.log('API Response:', response);
  //       this.statistics = response
  //       const scores = response.map((elem: any) => elem.voteScore);
        
  //       const date = response.map((elem: any, index: number, array: any[]) => {
  //         const currentDateString = elem.voteDate;
  //         if (index < array.length - 1) {
  //           const nextDate = array[index + 1].voteDate;
  //           const currentDate = new Date(currentDateString);
  //           const nextDateObj = new Date(nextDate);
  //           const diffInDays = Math.floor((nextDateObj.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
  //           if (diffInDays > 1) {
  //             const newDates = [];
  //             for (let i = 1; i < diffInDays; i++) {
  //               const dateToAdd = new Date(currentDate.getTime() + (i * 24 * 60 * 60 * 1000));
  //               newDates.push(dateToAdd.toISOString().slice(0, 10)); // ใส่วันที่เป็นรูปแบบ YYYY-MM-DD
  //             }
  //             return [currentDateString, ...newDates];
  //           }
  //         }
  //         return currentDateString;
  //       }).flat();
        
  //       console.log('Date:', scores);   
        
  //       Chart.register(...registerables);

  //       const ctx = this.myChart.nativeElement.getContext('2d');
  //       new Chart(ctx, {
  //         type: 'bar',
  //         data: {
  //           labels: date,
  //           datasets: [{
  //             label: 'Scores of Votes',
  //             data: scores,
  //             backgroundColor: ['rgba(255, 99, 132, 1)'],
  //             borderWidth: 1
  //           }]
  //         },
  //         options: {
  //           scales: {
  //             y: {
  //               beginAtZero: true
  //             }
  //           }
  //         }
  //       });

  //     },
  //     (error) => {
  //       console.error('API Error:', error);
  //     }
  //   );
  //   }
}


