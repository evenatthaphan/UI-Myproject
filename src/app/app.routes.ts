import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AllpicturesComponent } from './components/profile/allpictures/allpictures.component';
import { UploadComponent } from './components/profile/upload/upload.component';
import { RankedComponent } from './components/profile/ranked/ranked.component';
import { IndexComponent } from './components/index/index.component';
import { EditprofileComponent } from './components/editprofile/editprofile.component';
import { ProfileOtherComponent } from './components/profile-other/profile-other.component';
import { ListComponent } from './components/list/list.component';
import { StatComponent } from './components/stat/stat.component';


export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'index', component: IndexComponent},
  { path: 'editprofile', component: EditprofileComponent},
  { path: 'other', component: ProfileOtherComponent},
  { path: 'list', component: ListComponent},
  { path: 'stat', component: StatComponent},
  { path: 'profileother', component: ProfileOtherComponent},
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      { path: 'allpicture', component: AllpicturesComponent },
      { path: 'upload', component: UploadComponent },
      { path: 'ranked', component: RankedComponent}
    ],
  },
  
];
