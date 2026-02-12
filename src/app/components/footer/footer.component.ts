import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>About DS Realtor</h3>
          <p>Your trusted partner in finding the perfect property. With years of experience and a dedicated team, we make real estate simple and accessible.</p>
        </div>

        <div class="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a routerLink="/">Home</a></li>
            <li><a routerLink="/properties">Properties</a></li>
            <li><a routerLink="/about">About Us</a></li>
            <li><a routerLink="/contact">Contact Us</a></li>
            <li><a routerLink="/admin-login">Admin Login</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Contact Info</h3>
          <p>📍 123 Property Street, Real Estate City, RC 12345</p>
          <p>📞 +1 (555) 123-4567</p>
          <p>📧 info&#64;dsrealtor.com</p>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-container">
          <p>&copy; 2026 DS Realtor. All rights reserved.</p>
          <div class="social-links">
            <a href="#" title="Facebook">f</a>
            <a href="#" title="Twitter">𝕏</a>
            <a href="#" title="Instagram">📷</a>
            <a href="#" title="LinkedIn">in</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #222;
      color: #bbb;
      margin-top: 4rem;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .footer-section h3 {
      color: white;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .footer-section p {
      line-height: 1.6;
      margin-bottom: 0.5rem;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-section ul li {
      margin-bottom: 0.5rem;
    }

    .footer-section a {
      color: #bbb;
      text-decoration: none;
      transition: color 0.3s;
    }

    .footer-section a:hover {
      color: #667eea;
    }

    .footer-section a.admin-link {
      color: #ffc107;
      font-weight: 600;
    }

    .footer-section a.admin-link:hover {
      color: #ffed4e;
    }



    .footer-bottom {
      background-color: #111;
      border-top: 1px solid #333;
      padding: 2rem 0;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .footer-bottom p {
      margin: 0;
      color: #888;
    }

    .social-links {
      display: flex;
      gap: 1.5rem;
    }

    .social-links a {
      color: #bbb;
      text-decoration: none;
      font-weight: bold;
      font-size: 1.2rem;
      transition: color 0.3s;
    }

    .social-links a:hover {
      color: #667eea;
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        padding: 2rem 1rem;
      }

      .footer-container {
        flex-direction: column;
        text-align: center;
      }

      .social-links {
        justify-content: center;
      }
    }
  `]
})
export class FooterComponent {}
