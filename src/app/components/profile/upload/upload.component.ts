import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserPostRequest } from '../../../model/data_get_res';
import { ImagePostRequest } from '../../../model/data_get_res';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Removed HttpClientModule
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '../../../config/constants';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'], // Corrected the property name to 'styleUrls'
})
export class UploadComponent implements OnInit {
  data: UserPostRequest[] = [];
  datapic: ImagePostRequest[] = [];
  userId: any;
  selectedFile: File | null = null; // Added to declare selectedFile
  // imageName: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private constants: Constants,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
      console.log('Received data in profile:', this.data);
      const firstItem = this.data.length > 0 ? this.data[0] : null;
      this.userId = firstItem ? firstItem.userID : null;

      this.cdr.detectChanges(); // Force change detection
    });
  }

  onFileSelected(event: any) {
    // Update selectedFile when a file is chosen in the input
    // this.imageName = event.target.string ? event.target.string[0] : null;
    this.selectedFile = event.target.files ? event.target.files[0] : null;
  }

  uploadPic(imageName: string) {
    console.log(imageName);
    
    if (this.selectedFile) {
      const url = `${this.constants.API_ENDPOINT}/upload`;

      const formData = new FormData();
      formData.append('Photo', this.selectedFile); // เปลี่ยนชื่อ key เป็น 'Photo'
      formData.append('UserID', this.userId); // ส่ง UserID ไปด้วย

      formData.append('imageName', imageName);

      this.http.post(url, formData).subscribe(
        (response) => {
          this.openSnackBar();
          console.log('Upload successful:', response);
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
    } else {
      console.error('No file selected for upload.');
    }
  }


  openSnackBar() {
    this._snackBar.open('Upload Image successfully.', 'Done', {
      duration: 5000, // 5 วินาที
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }
}

