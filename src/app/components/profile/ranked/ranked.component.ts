import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ImagePostRequest } from '../../../model/data_get_res';
import { Constants } from '../../../config/constants';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ranked',
  standalone: true,
  imports: [
    MatToolbar,
    MatButtonModule,
    RouterOutlet,
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './ranked.component.html',
  styleUrl: './ranked.component.scss'
})
export class RankedComponent {

    // showImage: boolean = true;
    data: any;
    allimage: any;
    userId: number | null = null; 
    getrank: any;
    getpoint: any;
    result: any;
    
    constructor(
      private router: Router,
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
      console.log('Received data in profile:', this.data);
      const firstItem = this.data.length > 0 ? this.data[0] : null;
      this.userId = firstItem ? firstItem.userID : null;

      this.cdr.detectChanges(); // Force change detection
      this.getallpic();
    });

    this.getallpic();
    this.getRanked();
    this.getPoint();
  }

  getallpic() {
    const url = `${this.constants.API_ENDPOINT}/show/getimage/${this.data[0].userID}`;

    this.http.get(url).subscribe(
      (response: any) => {
        console.log('API Response getallpic:', response);
        this.allimage = response;
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  getRanked(){
    const urlall = this.constants.API_ENDPOINT + '/show/get/diff';
    this.http.get(urlall).subscribe(
      (response: any) => {
        this.getrank = response;
        console.log('API Response getRanked:', response);
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  getPoint() {
    const urls = this.constants.API_ENDPOINT + '/rank/chart';
    this.http.get(urls).subscribe(
      (response: any) => {
        this.getpoint = response;
        console.log('API Response getPoint:', response);
        let foundItem = [];
        
        for (let i = 0; i < this.allimage.length; i++) {
          let currentItem = this.getpoint.find((item: { imageID: any; }) => item.imageID === this.allimage[i].imageID);
          if (currentItem) {
            foundItem.push(currentItem);
          } else {
            console.log('No item found with imageID:', this.allimage[i].imageID);
          }
        }
        console.log('Item found:', foundItem);
        this.result = foundItem;
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }
}