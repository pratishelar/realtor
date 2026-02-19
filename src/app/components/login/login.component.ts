import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container container-fluid d-flex justify-content-center align-items-center" style="min-height: 80vh;">
      <div class="login-form card shadow p-5" style="max-width: 450px; width: 100%;">
        <h1 class="mb-4 text-center">Admin Login</h1>
        
        <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

        <form (ngSubmit)="login()" class="d-grid gap-3">
          <div class="form-group">
            <label class="form-label fw-bold">Email:</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              placeholder="Enter your email"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label class="form-label fw-bold">Password:</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              placeholder="Enter your password"
              class="form-control"
            />
          </div>

          <button type="submit" class="btn btn-primary w-100 py-2 mt-3" [disabled]="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <p class="text-muted text-center mt-4 mb-0 small">Use your Firebase credentials to login as an admin.</p>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        this.error = error.message || 'Login failed. Please try again.';
        this.loading = false;
      },
    });
  }
}
