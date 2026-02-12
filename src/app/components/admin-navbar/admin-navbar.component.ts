import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="admin-navbar">
      <div class="admin-nav-container">
        <div class="nav-brand">
          <div class="admin-logo">
            🏢 DS Realtor
          </div>
        </div>

        <div class="nav-right">
          <span class="user-info" *ngIf="user$ | async as user">
            👤 {{ $any(user).email }}
          </span>
          <button (click)="logout()" class="btn-logout">
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .admin-navbar {
      background: linear-gradient(90deg, #1a1a2e 0%, #16213e 100%);
      padding: 1.2rem 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      border-bottom: 3px solid #667eea;
    }

    .admin-nav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .nav-brand {
      flex: 0 0 auto;
    }

    .admin-logo {
      color: white;
      font-size: 1.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .admin-logo:hover {
      color: #667eea;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex: 0 0 auto;
    }

    .user-info {
      color: #bbb;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .btn-logout {
      background-color: #f44336;
      color: white;
      border: none;
      padding: 0.7rem 1.2rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-logout:hover {
      background-color: #da190b;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
    }

    @media (max-width: 968px) {
      .admin-nav-container {
        gap: 1rem;
        padding: 0 1rem;
      }

      .nav-center {
        gap: 1rem;
      }

      .nav-center,
      .nav-right {
        flex: 1;
        justify-content: flex-end;
      }

      .user-info {
        font-size: 0.8rem;
      }

      .btn-logout {
        padding: 0.5rem 1rem;
      }
    }

    @media (max-width: 768px) {
      .admin-navbar {
        padding: 1rem 0;
      }

      .admin-nav-container {
        flex-wrap: wrap;
        gap: 1rem;
      }

      .admin-logo {
        font-size: 1.1rem;
      }

      .nav-right {
        order: 2;
      }

      .user-info {
        display: none;
      }
    }
  `]
})
export class AdminNavbarComponent {
  user$: any;

  constructor(public authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      window.location.href = '/';
    });
  }
}
