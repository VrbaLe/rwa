import { Routes } from '@angular/router';
import { HomeComponent } from './screens/home/home.component';
import { LoginComponent } from './screens/login/login.component';
import { RegisterComponent } from './screens/register/register.component';
import { SalonDetailsComponent } from './screens/salon-details/salon-details.component';
import { ProfileComponent } from './screens/profile/profile.component';
import { SalonFormComponent } from './screens/salon-form/salon-form.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { NotAuthGuard } from './shared/guards/not-auth.guard';
import { OwnerGuard } from './shared/guards/owner.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'salon/:id', component: SalonDetailsComponent },
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NotAuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'salons/new', component: SalonFormComponent, canActivate: [OwnerGuard] },
  { path: '**', redirectTo: '' }
];