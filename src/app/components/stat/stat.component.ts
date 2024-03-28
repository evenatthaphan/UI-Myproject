import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { Constants } from '../../config/constants';
import { HeaderComponent } from '../index/header/header.component';
import { CommonModule, Location } from '@angular/common';
import {
  ImagePostRequest,
  UserPostRequest,
  VotePostRequest,
} from '../../model/data_get_res';
import { LinearScale } from 'chart.js';

@Component({
  selector: 'app-stat',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss'],
})
export class StatComponent implements OnInit {
  @ViewChild('myChart', { static: true }) myChart!: ElementRef;
  data: UserPostRequest[] = [];
  data2: ImagePostRequest[] = [];

  userId: number | null = null;
  imageId: number | null = null;
  statistics: any;
  imageID: ImagePostRequest[] = [];
  votechart: VotePostRequest[] = [];

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private constants: Constants,
    private http: HttpClient,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
      console.log('Received data in profile:', this.data);
      const firstItem1 = this.data.length > 0 ? this.data[0] : null;
      this.userId = firstItem1 ? firstItem1.userID : null;

      if (params['imageID']) {
        // ตรวจสอบว่ามีค่า imageID หรือไม่
        this.imageID = JSON.parse(params['imageID']); // แปลงเป็น JSON ก่อนใช้งาน
        console.log('Received imageID in stat component:', this.imageID);
      }

      this.cdr.detectChanges();
      this.getData();
      this.createCharts();
    });
  }

  getData(): void {
    if (this.imageID) {
      this.http
        .get<any[]>(
          `${this.constants.API_ENDPOINT}/get/score/statistics/${this.imageID}`
        )
        .subscribe(
          (response) => {
            this.imageID = response;
            console.log('Image ID:', this.imageID);
            this.createCharts(); // เรียกฟังก์ชันสร้างกราฟหลังจากที่ได้รับข้อมูลจาก API แล้ว
          },
          (error) => {
            console.error('Error fetching data:', error);
          }
        );
    }
  }

  createChartData(vote: any[]): any{
    const maxDate = new Date();
    const minDate = new Date(maxDate);
    minDate.setDate(maxDate.getDate() - 6); // นับย้อนหลัง 7 วัน

    const labels = [];
    const data = [];

    for (
      let currentDate = new Date(minDate);
      currentDate <= maxDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      labels.push(currentDate.toISOString().slice(0, 10));
      if (vote && Array.isArray(vote)) {
        const votes = vote.find(v => v.voteDate.slice(0,10) === currentDate.toISOString().slice(0, 10));
        if (votes) {
          data.push(votes.voteScore);
        } else {
          data.push(null);
        }
      }
      
    }

    return { labels, data };
  }

  createCharts(): void {
    if (this.imageID && this.imageID.length > 0) {
      // ตรวจสอบว่ามีข้อมูล imageID หรือไม่
      this.imageID.forEach((imageID: any) => {
        const chartData = this.createChartData(imageID.vote); // ใช้ข้อมูล imageId ในการสร้าง chartData
        console.log('Image ID:', imageID.imageID);
        console.log('Chart data:', chartData);

        // สร้าง canvas element สำหรับแต่ละรูปภาพ
        const container = document.createElement('div');
        container.style.display = 'block';
        container.style.marginTop = '-10%';
        container.style.width = '700px';
        container.style.height = '500px';
        // container.style.marginLeft = '50px';

        const canvas = document.createElement('canvas');
        canvas.id = 'myChart-' + imageID.imageID; // ใช้ imageId ในการกำหนด ID ของ canvas
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
            datasets: [
              {
                label: 'Score',
                data: chartData.data,
                fill: false,
                borderColor: 'black',
                tension: 0.1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                ticks: {
                  color: 'white', // กำหนดสีของ labels เป็นสีขาว
                },
                beginAtZero: true,
              },
              x: {
                ticks: {
                  color: 'white', // กำหนดสีของ labels เป็นสีขาว
                },
              },
            },
          },
        });
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
