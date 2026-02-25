import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
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
