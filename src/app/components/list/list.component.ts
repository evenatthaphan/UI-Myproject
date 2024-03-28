import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbar } from '@angular/material/toolbar';
import { Constants } from '../../config/constants';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatToolbar,
    MatButton,
    HttpClientModule,
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  isListPage = false;
  data: any;

  constructor(private http: HttpClient, private constants: Constants, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.showData();
  }

  showData() {
    const url = this.constants.API_ENDPOINT + '/list';
    this.http.get(url).subscribe((result: any) => {
      this.data = result;
      console.log(this.data);
    });
  }

  onClick(i: any) {
    this.router.navigate(['/profileother'], { queryParams: { data: JSON.stringify(this.data[i]) } });
  }

  navigateToIndex() {
    this.router.navigate(['/list']);
  }
}