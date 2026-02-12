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
    <div class="admin-login-wrapper">
      <div class="admin-login-container">
        <!-- Left Side - Branding -->
        <div class="login-branding">
          <div class="brand-content">
            <h1>DS Realtor Admin</h1>
            <p class="subtitle">Property Management System</p>
            <div class="features">
              <div class="feature">
                <span class="feature-icon">📊</span>
                <span>Manage Properties</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🖼️</span>
                <span>Upload Images</span>
              </div>
              <div class="feature">
                <span class="feature-icon">⚙️</span>
                <span>Edit Listings</span>
              </div>
              <div class="feature">
                <span class="feature-icon">👥</span>
                <span>View Analytics</span>
              </div>
            </div>
            <p class="brand-footer">Secure access to your real estate management dashboard</p>
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="login-form-wrapper">
          <div class="login-form">
            <div class="form-header">
              <h2>Sign In</h2>
              <p>Enter your credentials to access the admin dashboard</p>
            </div>

            <div *ngIf="error" class="error-message">
              <span class="error-icon">⚠️</span>
              {{ error }}
            </div>

            <form (ngSubmit)="login()" class="admin-form">
              <div class="form-group">
                <label for="email">Email Address</label>
                <div class="input-wrapper">
                  <span class="input-icon">📧</span>
                  <input
                    type="email"
                    id="email"
                    [(ngModel)]="email"
                    name="email"
                    required
                    placeholder="your.email@example.com"
                    class="form-input"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="password">Password</label>
                <div class="input-wrapper">
                  <span class="input-icon">🔒</span>
                  <input
                    type="password"
                    id="password"
                    [(ngModel)]="password"
                    name="password"
                    required
                    placeholder="Enter your password"
                    class="form-input"
                  />
                </div>
              </div>

              <div class="remember-forgot">
                <label class="remember">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" class="forgot-password">Forgot password?</a>
              </div>

              <button type="submit" class="btn-login" [disabled]="loading">
                <span *ngIf="loading" class="loading-spinner"></span>
                {{ loading ? 'Signing in...' : 'Sign In' }}
              </button>
            </form>

            <div class="form-footer">
              <p>Don't have an admin account? <a routerLink="/">Contact support</a></p>
            </div>
          </div>

          <!-- Security Badge -->
          <div class="security-badge">
            <span class="badge-icon">🔐</span>
            <span>Secure Connection</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-login-wrapper {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .admin-login-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      max-width: 1100px;
      width: 100%;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    /* Left Side - Branding */
    .login-branding {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-content {
      text-align: center;
    }

    .brand-content h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .brand-content .subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin-bottom: 3rem;
    }

    .features {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 1rem;
    }

    .feature-icon {
      font-size: 1.8rem;
      display: inline-block;
    }

    .brand-footer {
      font-size: 0.95rem;
      opacity: 0.85;
      font-style: italic;
    }

    /* Right Side - Login Form */
    .login-form-wrapper {
      padding: 4rem 3rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .login-form {
      width: 100%;
    }

    .form-header {
      margin-bottom: 2rem;
    }

    .form-header h2 {
      font-size: 2rem;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .form-header p {
      color: #666;
      font-size: 0.95rem;
    }

    .error-message {
      background-color: #ffebee;
      color: #c62828;
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 1.5rem;
      border-left: 4px solid #c62828;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .error-icon {
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .admin-form {
      width: 100%;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 600;
      font-size: 0.95rem;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      font-size: 1.2rem;
      pointer-events: none;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 1rem;
      transition: all 0.3s;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .remember-forgot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      font-size: 0.9rem;
    }

    .remember {
      display: flex;
      align-items: center;
      cursor: pointer;
      gap: 0.5rem;
      color: #666;
    }

    .remember input {
      cursor: pointer;
      width: 16px;
      height: 16px;
    }

    .forgot-password {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }

    .forgot-password:hover {
      color: #764ba2;
    }

    .btn-login {
      width: 100%;
      padding: 0.9rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .btn-login:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .loading-spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .form-footer {
      text-align: center;
      margin-top: 1.5rem;
      color: #666;
      font-size: 0.9rem;
    }

    .form-footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .form-footer a:hover {
      text-decoration: underline;
    }

    .security-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 2rem;
      color: #999;
      font-size: 0.85rem;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .admin-login-container {
        grid-template-columns: 1fr;
      }

      .login-branding {
        padding: 2rem;
        min-height: 250px;
      }

      .brand-content h1 {
        font-size: 2rem;
      }

      .features {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
      }

      .feature {
        flex-direction: column;
        text-align: center;
      }
    }

    @media (max-width: 768px) {
      .admin-login-wrapper {
        padding: 1rem;
      }

      .admin-login-container {
        max-width: 100%;
      }

      .login-branding,
      .login-form-wrapper {
        padding: 2rem 1.5rem;
      }

      .brand-content h1 {
        font-size: 1.5rem;
      }

      .brand-content .subtitle {
        font-size: 1rem;
        margin-bottom: 1.5rem;
      }

      .features {
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .form-header h2 {
        font-size: 1.5rem;
      }

      .remember-forgot {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }
    }
  `]
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
