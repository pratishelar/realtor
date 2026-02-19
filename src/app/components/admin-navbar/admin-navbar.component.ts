import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="admin-navbar navbar navbar-dark bg-dark">
      <div class="admin-nav-container container d-flex justify-content-between align-items-center">
        <div class="nav-brand">
          <div class="admin-logo">
            🏢 DS Associates
          </div>
        </div>

        <div class="nav-right">
          <span class="user-info badge bg-secondary" *ngIf="user$ | async as user">
            👤 {{ $any(user).email }}
          </span>
          <button (click)="logout()" class="btn-logout btn btn-danger btn-sm">
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: []
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
