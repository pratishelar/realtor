import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-dark bg-dark sticky-top py-2">
      <div class="container">
        <a routerLink="/" class="navbar-brand m-0 fw-bold">
          <span class="logo-text">DS Associates</span>
        </a>
        <button 
          class="navbar-toggler d-md-none border-0" 
          type="button" 
          (click)="toggleMenu()"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="d-none d-md-flex align-items-center gap-4">
          <a class="nav-link text-white px-2" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            Home
          </a>
          <a class="nav-link text-white px-2" routerLink="/properties" routerLinkActive="active">
            Properties
          </a>
          <a class="nav-link text-white px-2" routerLink="/about" routerLinkActive="active">
            About
          </a>
          <a class="nav-link text-white px-2" routerLink="/contact" routerLinkActive="active">
            Contact
          </a>
        </div>
      </div>
      <div 
        class="mobile-menu d-md-none" 
        [class.show]="menuOpen"
        *ngIf="menuOpen"
      >
        <div class="container py-3">
          <a 
            class="nav-link text-white py-2 border-bottom" 
            routerLink="/" 
            routerLinkActive="active" 
            [routerLinkActiveOptions]="{ exact: true }"
            (click)="closeMenu()"
          >
            Home
          </a>
          <a 
            class="nav-link text-white py-2 border-bottom" 
            routerLink="/properties" 
            routerLinkActive="active"
            (click)="closeMenu()"
          >
            Properties
          </a>
          <a 
            class="nav-link text-white py-2 border-bottom" 
            routerLink="/about" 
            routerLinkActive="active"
            (click)="closeMenu()"
          >
            About
          </a>
          <a 
            class="nav-link text-white py-2" 
            routerLink="/contact" 
            routerLinkActive="active"
            (click)="closeMenu()"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}