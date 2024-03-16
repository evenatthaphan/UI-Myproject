import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Constants } from '../../../config/constants';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImagePostRequest, UserPostRequest } from '../../../model/data_get_res';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-allpictures',
  standalone: true,
  imports: [MatIconModule, MatCardModule, CommonModule, HttpClientModule],
  templateUrl: './allpictures.component.html',
  styleUrl: './allpictures.component.scss',
})
export class AllpicturesComponent implements OnInit {
  data: ImagePostRequest[] = [];
  userData: UserPostRequest[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private constants: Constants) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.userData = JSON.parse(params['data']);
      console.log('Received data in profile:', this.userData);

      if (this.userData && this.userData.length > 0 && this.userData[0].userID) {
        this.getImageByID(this.userData[0].userID);
      }

      // this.cdr.detectChanges(); // Force change detection
    });
  }
  
  getImageByID(userID: number) {
    const url = `${this.constants.API_ENDPOINT}/show/getimage?userID=${userID}`;
    this.http.get<ImagePostRequest[]>(url).subscribe(
      (response: ImagePostRequest[]) => {
        // Assuming the API returns an array of ImagePostRequest
        this.data = response;
        console.log(this.data);
      },
      (error) => {
        console.error(error);
        // Handle error, e.g., show a user-friendly message
      }
    );
  }
}
