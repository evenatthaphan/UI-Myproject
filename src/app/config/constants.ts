import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Constants {
  public readonly API_ENDPOINT: string = 'https://nodeapi-uxch.onrender.com';
  // public readonly API_ENDPOINT: string = 'http://localhost:3000';

  static BASE_URL: any;
}