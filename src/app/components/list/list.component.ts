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
    const selectedData = this.data[i];
    this.router.navigate(['/profile'], { queryParams: { data: JSON.stringify(selectedData) } });
  }
}
