import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectorRef } from '@angular/core';
import { ImagePostRequest } from '../../../model/data_get_res';
import { Router } from 'express';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Constants } from '../../../config/constants';
import { HttpClient } from '@angular/common/http';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ranked',
  standalone: true,
  imports: [
    MatToolbar,
    MatButtonModule,
    RouterOutlet,
    CommonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './ranked.component.html',
  styleUrl: './ranked.component.scss',
})
export class RankedComponent {

  // showImage: boolean = true;
  data: any;
  allimage: ImagePostRequest[] = [];
  userId: number | null = null; 
  score_current: any;
  score_old: any;
  oldScores: any;
  result: any;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private constants: Constants,
    private http: HttpClient
  ) {}

ngOnInit() {
  this.route.queryParams.subscribe((params) => {
      this.route.queryParams.subscribe(params => {
  try {
    if (typeof params['data'] === 'string') {
      this.data = JSON.parse(params['data']);
    } else {
      this.data = params['data']; // ใช้ข้อมูลเดิมถ้าไม่ได้รับเป็นสตริง JSON
    }
  } catch (error) {
    console.error('Error parsing JSON data:', error);
  }
});
    console.log('Received data:', this.data);
    const firstItem = this.data.length > 0 ? this.data : null;
    this.userId = firstItem ? firstItem.userID : null;

    this.cdr.detectChanges(); // Force change detection
  });

  this.getallpic();
  this.getScore_current()
  this.calculateImageRanks()
}

getallpic() {
  const url = `${this.constants.API_ENDPOINT}/show/getimage/${this.data.userID}`;

  this.http.get(url).subscribe(
    (response: any) => {
      console.log('API Response:', response, this.data.userID);
      this.allimage = response;
    },
    (error) => {
      console.error('API Error:', error);
    }
  );
}

getScore_current() {
  const url = `${this.constants.API_ENDPOINT}/rank/chart`;

  this.http.get(url).subscribe(
    (response: any) => {
      console.log('API Response Ranking:', response);
      
      this.score_current = response.filter((score: { userID: number; }) => score.userID === this.data.userID);
      console.log('Ranking:', this.score_current);
    },
    (error) => {
      console.error('API Error:', error);
    }
  );
}

calculateImageRanks() {
  const url = `${this.constants.API_ENDPOINT}/rank/rank`;
  
  this.http.get(url).subscribe(
    (response: any) => {
      console.log('API Response Ranking:', response);
      
      const oldScores: { [key: number]: any[] } = {}; // สร้างออบเจกต์เปล่าเพื่อเก็บข้อมูลระดับเก่าโดยใช้ imageID เป็น key

      // วนลูปผ่านคะแนนปัจจุบันทุกคะแนน
      this.score_current.forEach((currentScore: { imageID: number; }) => {
        // กรองข้อมูลระดับเก่าที่มี imageID ตรงกับคะแนนปัจจุบัน
        const filteredScores = response.filter((score: { imageID: number; }) => score.imageID === currentScore.imageID);
        
        // เก็บข้อมูลระดับเก่าลงในออบเจกต์โดยใช้ imageID เป็น key
        oldScores[currentScore.imageID] = filteredScores;
        
        console.log('Ranking for score_current with imageID', currentScore.imageID, ':', filteredScores);
      });
      
      console.log('Old Scores:', oldScores);
      
      // สามารถใช้ oldScores ในการนำข้อมูลระดับเก่าไปใช้งานต่อได้ตามต้องการ
    },
    (error) => {
      console.error('API Error:', error);
    }
  );
}  
}
