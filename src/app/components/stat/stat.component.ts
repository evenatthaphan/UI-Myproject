import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Constants } from '../../config/constants';
import { HeaderComponent } from '../index/header/header.component';


@Component({
  selector: 'app-stat',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {
  @ViewChild('myChart', { static: true }) myChart!: ElementRef;
  data: any;
  userId: number | null = null; 
  statistics: any;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private constants: Constants,
    private http: HttpClient
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
      this.getGraph();
      this.cdr.detectChanges();
    });
  }
  
  getGraph(): void {
    const url = `${this.constants.API_ENDPOINT}/vote/score/statistics/${this.data.imageID}`;
    this.http.get(url).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        this.statistics = response
        const scores = response.map((elem: any) => elem.voteScore);
        
        const date = response.map((elem: any, index: number, array: any[]) => {
          const currentDateString = elem.voteDate;
          if (index < array.length - 1) {
            const nextDate = array[index + 1].voteDate;
            const currentDate = new Date(currentDateString);
            const nextDateObj = new Date(nextDate);
            const diffInDays = Math.floor((nextDateObj.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
            if (diffInDays > 1) {
              const newDates = [];
              for (let i = 1; i < diffInDays; i++) {
                const dateToAdd = new Date(currentDate.getTime() + (i * 24 * 60 * 60 * 1000));
                newDates.push(dateToAdd.toISOString().slice(0, 10)); // ใส่วันที่เป็นรูปแบบ YYYY-MM-DD
              }
              return [currentDateString, ...newDates];
            }
          }
          return currentDateString;
        }).flat();
        
        console.log('Date:', scores);   
        
        Chart.register(...registerables);

        const ctx = this.myChart.nativeElement.getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: date,
            datasets: [{
              label: 'Scores of Votes',
              data: scores,
              backgroundColor: ['rgba(255, 99, 132, 1)'],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });

      },
      (error) => {
        console.error('API Error:', error);
      }
    );
    }
}
