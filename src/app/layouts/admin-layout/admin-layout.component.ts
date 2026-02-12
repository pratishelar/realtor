import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../components/admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminNavbarComponent],
  template: `
    <app-admin-navbar></app-admin-navbar>
    <div class="admin-layout-content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .admin-layout-content {
      min-height: calc(100vh - 100px);
      background: #1a1a2e;
    }
  `]
})
export class AdminLayoutComponent {}
