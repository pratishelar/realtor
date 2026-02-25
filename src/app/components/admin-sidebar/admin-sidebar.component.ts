import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {
  @Input() activeTab: 'add' | 'list' = 'add';
  @Input() sidebarOpen = true;
  @Output() activeTabChange = new EventEmitter<'add' | 'list'>();
  @Output() sidebarToggle = new EventEmitter<boolean>();
  
  constructor(private authService: AuthService, private router: Router) {}

  selectTab(tab: 'add' | 'list') {
    this.activeTabChange.emit(tab);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    this.sidebarToggle.emit(this.sidebarOpen);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        // fallback redirect
        window.location.href = '/';
      }
    });
  }
}
