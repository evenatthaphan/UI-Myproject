import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbar } from '@angular/material/toolbar';
import { Constants } from '../../config/constants';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatToolbar, MatInputModule, MatButtonModule, HttpClientModule,MatSnackBarModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {

  username: string = '';
  email: string = '';
  password: string = '';
  
  constructor(private http: HttpClient, private constants : Constants, private router: Router, private _snackBar: MatSnackBar) {}

  Register(username: string, email: string, password: string) {
    const body = {
      username: username,
      email: email,
      password: password
    };
    const url = this.constants.API_ENDPOINT + '/insert';

    this.http.post(url, body).subscribe(
      (response) => {
        console.log('Insert successful', response);
        this.router.navigate(['/login']);
        this.openSnackBar();
      },
      (error) => {
        console.error('Insert failed', error);
      }
    );

  }

  openSnackBar() {
    this._snackBar.open("Successfully applied for membership", 'Done', {
      duration: 5000,  // 5 วินาที
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
  
  
}


