import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Constants } from '../../config/constants';
import { ChangeDetectorRef } from '@angular/core';
import { UserPostRequest, ImagePostRequest } from '../../model/data_get_res';
import { HeaderComponent } from '../index/header/header.component';
import { HttpClient } from '@angular/common/http';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile-other',
  standalone: true,
  imports: [
    MatToolbar,
    MatButtonModule,
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    MatCard,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './profile-other.component.html',
  styleUrl: './profile-other.component.scss'
})
export class ProfileOtherComponent {
  // showImage: boolean = true;
  data: any;
  allimage: ImagePostRequest[] = [];
  userId: number | null = null; 

  constructor(
    private router: Router,
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
      this.cdr.detectChanges();
    });

    this.getallpic();
  }

  navigateToIndex() {
    this.router.navigate(['/index'], {
      queryParams: { data: JSON.stringify(this.data) },
    });
  }
  navigateToProfile() {
    this.router.navigate(['/profile'], { queryParams: { data: JSON.stringify(this.data) } });
  }

  navigateToList() {
    this.router.navigate(['/list']);
  }

  // changePage1() {
  //   this.router.navigate(['/profile/allpicture'], {
  //     queryParams: { data: JSON.stringify(this.data) },
  //   });
  // }

  
  changePage3() {
    this.router.navigate(['/profileother/ranked-other'], {
      queryParams: { data: JSON.stringify(this.data) },
    });
  }

  statPage(data: any){
    this.router.navigate(['/stat'], { queryParams: { data: JSON.stringify(data) } });
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

}