import { ChangeDetectorRef, Component } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { Constants } from '../../config/constants';
import { UserPostRequest } from '../../model/data_get_res';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [MatToolbar, MatButton, MatCardModule, MatIconModule, CommonModule, FormsModule, MatButtonModule],
  templateUrl: './editprofile.component.html',
  styleUrl: './editprofile.component.scss',
})
export class EditprofileComponent {
  data: UserPostRequest[] = [];
  userId: any;
  userOriginal: any; // ประกาศตัวแปร userOriginal และกำหนดค่าเริ่มต้นเป็น null

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private constants: Constants,
    private http: HttpClient,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
      console.log('Received data in profile:', this.data);
      const firstItem = this.data.length > 0 ? this.data[0] : null;
      this.userId = firstItem ? firstItem.userID : null;

      this.cdr.detectChanges(); // Force change detection
    });

    if (this.userId) {
      this.getUserProfile(); // เรียก method สำหรับดึงข้อมูลเดิมเมื่อ component โหลด
    } else {
      console.error('User ID is missing.');
    }
  }

  getUserProfile(): void {
    if (!this.userId) {
      console.error('User ID is missing.');
      return;
    }
  
    const url = `${this.constants.API_ENDPOINT}/getuserprofile/${this.userId}`;
    this.http.get(url).subscribe(
      (response) => {
        this.userOriginal = response;
      },
      function (error) {
        console.error('Error fetching user profile:', error);
      }
    );
  }
  
  updateProfile(): void {
    if (!this.userId || !this.userOriginal) {
      console.error('User ID or user data is missing.');
      return;
    }

    this.updateUserProfile(this.userId, this.userOriginal);
  }

  updateUserProfile(id: number, user: UserPostRequest): void {
    const url = `${this.constants.API_ENDPOINT}/update/edit/${id}`;
    this.http.put(url, user).subscribe(
      (response: any) => {
        console.log('Updated profile:', response);
        // Handle success response here, e.g., show success message
        alert('Profile updated successfully!');
      },
      (error) => {
        console.error('Error updating profile:', error);
        // Handle error response here, e.g., show error message
        alert('Failed to update profile. Please try again later.');
      }
    );
  }

  goBack(): void {
    this.location.back();
  }
}
