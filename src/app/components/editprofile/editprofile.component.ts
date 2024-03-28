import { ChangeDetectorRef, Component } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { Constants } from '../../config/constants';
import { UserPostRequest } from '../../model/data_get_res';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms'; 


@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [MatToolbar, MatButton, MatCardModule, MatIconModule, CommonModule, FormsModule, MatButtonModule],
  templateUrl: './editprofile.component.html',
  styleUrl: './editprofile.component.scss',
})
export class EditprofileComponent {
  data: UserPostRequest[] = [];
  userId: any;
  userOriginal: any; // ประกาศตัวแปร userOriginal และกำหนดค่าเริ่มต้นเป็น null  
  username: string="";
  email: string="";
  userForm!: FormGroup;
  avatar: File | undefined;
  Data_User: any;
  Password: any;
  Data: any;

  constructor(
    private constants: Constants, 
    private route: ActivatedRoute, 
    private http: HttpClient,
    private router : Router, 
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private location: Location
    ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
      console.log('Received data in profile:', this.data);
      const firstItem = this.data.length > 0 ? this.data[0] : null;
      this.userId = firstItem ? firstItem.userID : null;

      this.userForm = this.formBuilder.group({
        // User_Id: [''],  // ตรวจสอบว่า this.data มีค่าหรือไม่ก่อนใช้
        UserName: [''],
        Email:[''],
        Avatar:[''],
        Password:['']
      });

      this.cdr.detectChanges(); // Force change detection
    });

  }


  frofile(userID: number) {

    if (!this.username) {
      alert('Please enter the UserName .'); 
      return; 
    }
    // if (!this.Name) {
    //   alert('Please enter the Name .'); 
    //   return; 
    // }

    if (!this.email) {
      alert('Please enter the Email .'); 
      return; 
  }

    const fileInput = document.getElementById('avatar') as HTMLInputElement;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert('Please select an image file');
      return;
    }


    const formData = new FormData();
    formData.append('username', (document.getElementById('username') as HTMLInputElement).value);
    // formData.append('Name', (document.getElementById('Name') as HTMLInputElement).value);
    formData.append('email', (document.getElementById('email') as HTMLInputElement).value);

    const urledituser = `${this.constants.API_ENDPOINT}/update/edit/${this.userId}`;
    this.http.put(urledituser,formData).subscribe(
      response => {
        console.log('save Image successfully:', response);
        alert(' save Frofile successfully!');
      },
      error => {
        console.error('Error frofile edit:', error);
        alert('Your password may be incorrect.');
      }
    );


    }

    imageUrl: string | null = null;
    FileSelected(event: any) {
      const file = event.target.files[0];
      console.log(file); // ตรวจสอบไฟล์ที่ได้รับ
      const reader = new FileReader();
      reader.onload = (e: any) => {
          console.log(e.target.result); // ตรวจสอบข้อมูล URL ของรูปภาพ
          this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
  }
  
    dataprifile(){
      const dataimage = `${this.constants.API_ENDPOINT}/show/getimage/${this.userId}`;
      this.http.get(dataimage).subscribe((Data:any)=>{
        this.data = Data ;
        // console.log("Data_User : ",this.Data_User);
        
      });
    }

    goBack(): void {
    this.location.back();
  }
  
}



