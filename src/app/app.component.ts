import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HeaderComponent } from './components/index/header/header.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    MainComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    HeaderComponent,
    HttpClientModule,
  ],
})
export class AppComponent {
  title = 'angular-project';

  isMainPage: boolean = false;
  isLoginPage: boolean = false;
  isRegisterPage: boolean = false;
  isVotePage: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = this.router.url;
        this.isMainPage = currentUrl === '/';
        this.isLoginPage = currentUrl === '/login';
        this.isRegisterPage = currentUrl === '/register';
        this.isVotePage = currentUrl === '/vote';

        console.log('URL:', currentUrl);
        console.log('isVotePage:', this.isVotePage);
      }
    });
  }
}
