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
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

export class DialogAnimationsExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>) {}
}

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
    MatIconModule,
    MatDialogModule,
  ],
})
export class ProfileComponent {
  // showImage: boolean = true;
  data: UserPostRequest[] = [];
  allimage: ImagePostRequest[] = [];
  userId: number | null = null;
  imageID: number | null = null;

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
    if (this.allimage.length < 5) {
      
      this.router.navigate(['/profile/upload'], {
        queryParams: { data: JSON.stringify(this.data) },
      });
    } else {
      this.openSnackBar();
    }
  }

  openSnackBar() {
    this._snackBar.open('Can not upload picture > 5.', 'Done', {
      duration: 5000, // 5 วินาที
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
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

  statPage(imageID: number) {
    this.router.navigate(['/stat'], {
      queryParams: {
        data: JSON.stringify(this.data),
        imageID: JSON.stringify(imageID),
      },
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

  daletepicture(imageID: number) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this photo?'
    );
    if (confirmed) {
      const url = `${this.constants.API_ENDPOINT}/delete/${imageID}`;

      this.http.delete(url).subscribe(
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

  
}
