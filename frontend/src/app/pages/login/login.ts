import { ChangeDetectorRef, Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoaderOverlay } from '../../shared/loader-overlay/loader-overlay';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    LoaderOverlay,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username = '';
  password = '';
  error = '';
  isProcessing = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private toast: Toast,
    private cdr: ChangeDetectorRef,
  ) {
    // redirect to dashboard if already logged in
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    this.isProcessing = true;
    this.cdr.detectChanges(); // Ensure UI updates immediately
    this.auth
      .login({ username: this.username, password: this.password })
      .subscribe({
        next: (res: any) => {
          if (res.statusCode === 200) {
            localStorage.setItem('token', res.data.token);
            this.isProcessing = false;
            this.cdr.detectChanges(); // Ensure UI updates immediately
            this.toast.success('Login successful');
            this.router.navigate(['/dashboard']);
          } else {
            this.error = res.message || 'Login failed';
            this.toast.error(this.error);
            this.isProcessing = false;
            this.cdr.detectChanges(); // Ensure UI updates immediately
          }
        },
        error: (error: any) => {
          this.isProcessing = false;
          this.cdr.detectChanges(); // Ensure UI updates immediately
          this.error =
            'Login failed. ' +
            (error.error?.message || 'Please try again later.');
          this.toast.error(this.error);
        },
      })
      .add(() => {
        this.isProcessing = false;
        this.cdr.detectChanges(); // Ensure UI updates immediately
      });
  }
}
