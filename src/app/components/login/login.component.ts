import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Constants } from '../../config/constants';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatToolbar, MatInputModule, MatButtonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private router: Router, private http: HttpClient, private constants: Constants, private route: ActivatedRoute, private dataService: DataService) {}

  async Login(email: HTMLInputElement, password: HTMLInputElement) {
    console.log(email.value, password.value);
    
    const body = {
      email: email,
      password: password
    };

    const url = this.constants.API_ENDPOINT + '/login';

    try {
      let data = await lastValueFrom(
        this.http.get(url, {
          params: {    
            email: email.value,
            password: password.value
          },
        })
      );
      console.log(data);
      // this.dataService.sendData(data);
      // this.router.navigate(['/index']); 
  
      // หลังจากที่ login สำเร็จแล้ว ให้นำทางไปยังหน้า index
      this.router.navigate(['/profile'], { queryParams: { data: JSON.stringify(data) } });
    } catch (error) {
      console.error('Error during login:', error);
    }
   
  }


  
}

