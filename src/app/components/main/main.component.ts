import { MatButton } from '@angular/material/button';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { ImagePostRequest, UserPostRequest, VotePostRequest } from '../../model/data_get_res';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule} from '@angular/common';
import { Constants } from '../../config/constants';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  imports: [
    MatToolbar,
    MatButton,
    HttpClientModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
  ],
})
export class MainComponent implements OnInit {
  randompic: any;
  top10Data1: ImagePostRequest[] = [];
  top10Data2: UserPostRequest[] = [];
  top10Data3: VotePostRequest[] = [];
  getrank: any;

  constructor(
    private http: HttpClient,
    private constants: Constants,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getRandomPictures();
    this.getTop10();
    this.getRanked();
  }

  voteForPicture(imageID: HTMLInputElement) {
    // const url = `${this.constants.API_ENDPOINT}/vote${imageId}`;
    // const url = `${this.constants.API_ENDPOINT}/voteimage/elo/${imageID_1}/${imageID_2}/${voteCount1}/${voteCount2}`;

    const imageID_1 = this.randompic.pic1.imageID;
    const imageID_2 = this.randompic.pic2.imageID;
    let voteCount1: number;
    let voteCount2: number;

    if (imageID === this.randompic.pic1.imageID) {
      voteCount1 = 1;
      voteCount2 = 0;
    } else {
      voteCount1 = 0;
      voteCount2 = 1;
    }
    const data = {
      imageID_1: imageID_1,
      imageID_2: imageID_2,
      voteCount1: voteCount1,
      voteCount2: voteCount2,
    };

    const url = this.constants.API_ENDPOINT + '/vote/voteimage/elo';
    this.http.post(url, data).subscribe(
      (response: any) => {
        // Handle the response if needed
        console.log(response);
        this.getRandomPictures();
        this.openSnackBar();
      },
      (error) => {
        // Handle errors if any
        console.error(error);
      }
    );
    this.getRandomPictures();
    this.openSnackBar();
    this.getTop10();
    this.getRanked();
  }

  getRandomPictures() {
    // ดึง URL ของ API ที่มีข้อมูลรูปภาพสุ่ม
    const urlall = this.constants.API_ENDPOINT + '/show/randompicture';

    // ใช้ HTTP GET เพื่อเรียกข้อมูลรูปภาพ
    this.http.get(urlall).subscribe((picran: any) => {
      this.randompic = picran;
      for (let i = 0; i < this.randompic.length; i++) {
        this.randompic[i].url_image =
          this.constants.API_ENDPOINT + this.randompic[i].url_image;
        //console.log(this.randompic[i]);
      }
      console.log(this.randompic); // แสดงฟังก์ชัน randomimage
    });
  }

  openSnackBar() {
    this._snackBar.open('You voted successfully.', 'Done', {
      duration: 5000, // 5 วินาที
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  getTop10() {
    const urlall = this.constants.API_ENDPOINT + '/show/top10';

    // ใช้ HTTP GET เพื่อเรียกข้อมูล top 10
    this.http.get(urlall).subscribe(
      (response: any) => {
        this.top10Data1 = response;
        this.top10Data2 = response;
        this.top10Data3 = response;
        console.log('API Response:', response);
       
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }


  statPage(data: any){
    this.router.navigate(['/stat'], { queryParams: { data: JSON.stringify(data) } });
  }

  getRanked(){
    const urlall = this.constants.API_ENDPOINT + '/show/get/diff';
    this.http.get(urlall).subscribe(
      (response: any) => {
        this.getrank = response;
        console.log('API Response getrank:', response);
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }
}
