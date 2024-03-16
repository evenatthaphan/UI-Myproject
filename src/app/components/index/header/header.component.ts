import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { UserPostRequest } from '../../../model/data_get_res';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbar,MatButtonModule,RouterOutlet, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  data : UserPostRequest[] = []; 

  constructor(private router: Router, private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
      console.log('Received data in profile:', this.data);
    });

  }

  navigateToIndex() {
    if(this.data[0].position === 0 ){
      this.router.navigate(['/list'], { queryParams: { data: JSON.stringify(this.data) } });
    }else {
      this.router.navigate(['/index'], { queryParams: { data: JSON.stringify(this.data) } });
    }
  }

  navigateToProfile() {
    this.router.navigate(['/profile'], { queryParams: { data: JSON.stringify(this.data) } });
  }

}
