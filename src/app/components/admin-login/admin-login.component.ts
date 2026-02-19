import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container-fluid py-5" style="min-height: 90vh;">
      <div class="row justify-content-center">
        <div class="col-12 col-xl-10">
          <div class="card shadow-lg overflow-hidden">
            <div class="row g-0">
              <!-- Left Side - Branding -->
              <div class="col-12 col-md-6 bg-dark text-white p-5">
                <div class="d-flex flex-column h-100 justify-content-center">
                  <h1 class="mb-3">DS Associates Admin</h1>
                  <p class="text-white-50 mb-5">Property Management System</p>
                  <div class="d-grid gap-3 mb-5">
                    <div class="d-flex align-items-center gap-3">
                      <span class="fs-3">📊</span>
                      <span>Manage Properties</span>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                      <span class="fs-3">🖼️</span>
                      <span>Upload Images</span>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                      <span class="fs-3">⚙️</span>
                      <span>Edit Listings</span>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                      <span class="fs-3">👥</span>
                      <span>View Analytics</span>
                    </div>
                  </div>
                  <p class="text-white-50 mb-0">Secure access to your real estate management dashboard</p>
                </div>
              </div>

              <!-- Right Side - Login Form -->
              <div class="col-12 col-md-6 bg-white p-5">
                <div class="d-flex flex-column h-100 justify-content-center">
                  <div class="mb-4">
                    <h2 class="mb-2">Sign In</h2>
                    <p class="text-muted">Enter your credentials to access the admin dashboard</p>
                  </div>

                  <div *ngIf="error" class="alert alert-danger d-flex align-items-center gap-2">
                    <span>⚠️</span>
                    <span>{{ error }}</span>
                  </div>

                  <form (ngSubmit)="login()" class="d-grid gap-3">
                    <div class="form-group">
                      <label for="email" class="form-label fw-bold">Email Address</label>
                      <div class="input-group">
                        <span class="input-group-text">📧</span>
                        <input
                          type="email"
                          id="email"
                          [(ngModel)]="email"
                          name="email"
                          required
                          placeholder="your.email@example.com"
                          class="form-control"
                        />
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="password" class="form-label fw-bold">Password</label>
                      <div class="input-group">
                        <span class="input-group-text">🔒</span>
                        <input
                          type="password"
                          id="password"
                          [(ngModel)]="password"
                          name="password"
                          required
                          placeholder="Enter your password"
                          class="form-control"
                        />
                      </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center">
                      <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="remember" />
                        <label class="form-check-label" for="remember">Remember me</label>
                      </div>
                      <a href="#" class="text-decoration-none small">Forgot password?</a>
                    </div>

                    <button type="submit" class="btn btn-success w-100 py-2 mt-3" [disabled]="loading">
                      {{ loading ? 'Signing in...' : 'Sign In' }}
                    </button>
                  </form>

                  <div class="text-center mt-4">
                    <p class="text-muted small mb-0">Don't have an admin account? <a routerLink="/" class="text-decoration-none">Contact support</a></p>
                  </div>

                  <!-- Security Badge -->
                  <div class="d-flex align-items-center justify-content-center gap-2 mt-4 text-muted small">
                    <span>🔐</span>
                    <span>Secure Connection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminLoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.email.trim() || !this.password.trim()) {
      this.error = 'Please enter both email and password';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.message || 'Login failed. Please check your credentials.';
        console.error('Login error:', error);
      },
    });
  }
}
