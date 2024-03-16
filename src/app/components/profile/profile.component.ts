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
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
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
})
export class ProfileComponent {
  // showImage: boolean = true;
  data: UserPostRequest[] = [];
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
      this.data = JSON.parse(params['data']);
      console.log('Received data in profile:', this.data);
      const firstItem = this.data.length > 0 ? this.data[0] : null;
      this.userId = firstItem ? firstItem.userID : null;

      this.cdr.detectChanges(); // Force change detection
      this.getallpic();
    });

    this.getallpic();
  }

  navigateToIndex() {
    this.router.navigate(['/index'], {
      queryParams: { data: JSON.stringify(this.data) },
    });
  }

  // changePage1() {
  //   this.router.navigate(['/profile/allpicture'], {
  //     queryParams: { data: JSON.stringify(this.data) },
  //   });
  // }

  changePage2() {
    this.router.navigate(['/profile/upload'], {
      queryParams: { data: JSON.stringify(this.data) },
    });
  }

  changePage3() {
    this.router.navigate(['/profile/ranked'], {
      queryParams: { data: JSON.stringify(this.data) },
    });
  }

  navigateToEditProfile() {
    this.router.navigate(['/editprofile'], {
      queryParams: { data: JSON.stringify(this.data) },
    });
  }

  getallpic() {
    const url = `${this.constants.API_ENDPOINT}/show/getimage/${this.userId}`;

    this.http.get(url).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        this.allimage = response;
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }
}
