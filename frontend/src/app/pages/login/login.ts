import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { LoaderOverlay } from '../../shared/loader-overlay/loader-overlay';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    LoaderOverlay
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
    private toast: ToastrService,
  ) {
    // redirect to dashboard if already logged in
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    this.isProcessing = true;
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.data.token);
        this.isProcessing = false;
        this.toast.success('Login successful', 'Success');
        this.router.navigate(['/dashboard']);
      },
      error: () => this.error = 'Invalid credentials'
    }).add(() => {
      this.isProcessing = false;
    });
  }
}
