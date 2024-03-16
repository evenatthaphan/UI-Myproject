import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../config/constants';
import { HttpClient } from '@angular/common/http';
// import * as Chart from 'chart.js';
import { VotePostRequest } from '../../model/data_get_res';

@Component({
  selector: 'app-stat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.scss',
})
export class StatComponent implements OnInit {
colorgraph() {
throw new Error('Method not implemented.');
}
  data: any;
  chartData: any[] = []; // ข้อมูลสำหรับกราฟ
  

  constructor(
    private route: ActivatedRoute,
    private constants: Constants,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const imageID = this.route.snapshot.queryParams['data'];
    console.log('Received imageID:', imageID);

    // ทำสิ่งที่ต้องการกับ imageID ที่ได้รับ
    this.getStat(this.data);
  }

  getStat(data : number) {
    const url = this.constants.API_ENDPOINT+'/get/score/statistics/'+data;
    this.http.get(url).subscribe(
      (response: any) => {
        this.chartData = response; // กำหนดข้อมูลสำหรับกราฟ 
        console.log('API Response stat:',  this.chartData);
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  onSelect(event: any) {
    console.log(event);
  }

  
}
