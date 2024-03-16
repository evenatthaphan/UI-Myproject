import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [MatToolbar, MatButton, MatCardModule,MatIconModule],
  templateUrl: './editprofile.component.html',
  styleUrl: './editprofile.component.scss'
})
export class EditprofileComponent {

  constructor() {}

  // readPhoto(file: File): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       resolve(reader.result as string);
  //     };
  //     reader.onerror = () => {
  //       reject(reader.error);
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // }


}
