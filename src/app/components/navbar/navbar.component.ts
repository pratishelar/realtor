import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="logo">
          🏠 DS Realtor
        </a>
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            Home
          </a>
          <a routerLink="/properties" routerLinkActive="active">
            Properties
          </a>
          <a routerLink="/about" routerLinkActive="active">
            About
          </a>
          <a routerLink="/contact" routerLinkActive="active">
            Contact
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: #333;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      color: white;
      font-size: 1.5rem;
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s;
    }
    .logo:hover {
      color: #667eea;
    }
    .nav-links {
      display: flex;
      gap: 2rem;
      align-items: center;
    }
    .nav-links a {
      color: white;
      text-decoration: none;
      transition: color 0.3s;
      font-weight: 500;
    }
    .nav-links a:hover {
      color: #667eea;
    }
    .nav-links a.active {
      color: #667eea;
      border-bottom: 2px solid #667eea;
      padding-bottom: 0.25rem;
    }
    
    @media (max-width: 768px) {
      .nav-links {
        gap: 1rem;
        font-size: 0.9rem;
      }
      .nav-container {
        padding: 0 1rem;
      }
    }
  `]
})
export class NavbarComponent {}
