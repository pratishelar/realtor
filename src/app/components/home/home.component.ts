import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="home-container">
      <!-- HERO SECTION -->
      <section class="hero">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <h1>Find Your Dream Property</h1>
          <p>Discover premium real estate opportunities with our expert guidance</p>
          <div class="hero-search">
            <input type="text" [(ngModel)]="searchQuery" placeholder="Search by location..." (keyup.enter)="search()">
            <button (click)="search()" class="btn-search">Search</button>
          </div>
        </div>
      </section>

      <!-- STATS SECTION -->
      <section class="stats">
        <div class="stat-card">
          <h3>500+</h3>
          <p>Active Listings</p>
        </div>
        <div class="stat-card">
          <h3>15,000+</h3>
          <p>Happy Clients</p>
        </div>
        <div class="stat-card">
          <h3>50+</h3>
          <p>Expert Agents</p>
        </div>
        <div class="stat-card">
          <h3>$2B+</h3>
          <p>Properties Sold</p>
        </div>
      </section>

      <!-- FEATURED PROPERTIES SECTION -->
      <section class="featured-section">
        <div class="section-header">
          <h2>Featured Properties</h2>
          <p>Handpicked properties that stand out from the rest</p>
        </div>
        <div *ngIf="loadingFeatured" class="loading">Loading properties...</div>
        <div *ngIf="!loadingFeatured && featuredProperties.length > 0" class="properties-grid">
          <div *ngFor="let property of featuredProperties.slice(0, 6)" class="property-card">
            <div class="property-image">
              <img 
                *ngIf="property.images && property.images.length > 0" 
                [src]="property.images[0]" 
                [alt]="property.title"
              />
              <div *ngIf="!property.images || property.images.length === 0" class="no-image">
                No Image Available
              </div>
              <span class="price-badge">\${{ property.price | number }}</span>
            </div>
            <div class="property-info">
              <h3>{{ property.title }}</h3>
              <p class="location">📍 {{ property.location }}</p>
              <div class="property-specs">
                <span class="spec">🛏️ {{ property.bedrooms }} Beds</span>
                <span class="spec">🚿 {{ property.bathrooms }} Baths</span>
                <span class="spec">📐 {{ property.area | number }} sqft</span>
              </div>
              <button class="btn-view" (click)="viewProperty(property.id)">View Details</button>
            </div>
          </div>
        </div>
      </section>

      <!-- WHY CHOOSE US SECTION -->
      <section class="why-choose-us">
        <div class="section-header">
          <h2>Why Choose Us</h2>
          <p>The best real estate partner for your needs</p>
        </div>
        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon">🏆</div>
            <h3>Award-Winning Team</h3>
            <p>Recognized leaders in real estate with decades of combined experience</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">💼</div>
            <h3>Professional Service</h3>
            <p>Dedicated support from start to finish with personalized attention</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">🔍</div>
            <h3>Thorough Search</h3>
            <p>Access to exclusive listings and advanced market analysis tools</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">💰</div>
            <h3>Best Value</h3>
            <p>Negotiate better deals with our market expertise and negotiation skills</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">🤝</div>
            <h3>Trusted Partners</h3>
            <p>Work with verified lenders, inspectors, and legal professionals</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">⚡</div>
            <h3>Fast & Efficient</h3>
            <p>Streamlined process to get you in your dream home quickly</p>
          </div>
        </div>
      </section>

      <!-- HOW IT WORKS SECTION -->
      <section class="how-it-works">
        <div class="section-header">
          <h2>How It Works</h2>
          <p>Simple steps to find your perfect property</p>
        </div>
        <div class="steps-container">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Browse Properties</h3>
            <p>Explore our extensive collection of premium properties that match your criteria</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>Schedule Tours</h3>
            <p>Book virtual or in-person tours with our expert agents at your convenience</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>Make an Offer</h3>
            <p>Submit competitive offers with our agents' guidance and market insights</p>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <h3>Close the Deal</h3>
            <p>We coordinate with all parties to ensure a smooth closing process</p>
          </div>
        </div>
      </section>

      <!-- TESTIMONIALS SECTION -->
      <section class="testimonials">
        <div class="section-header">
          <h2>What Clients Say</h2>
          <p>Real experiences from our satisfied customers</p>
        </div>
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"Exceptional service! The team helped us find the perfect home in just two weeks."</p>
            <p class="author">- Sarah Johnson</p>
          </div>
          <div class="testimonial-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"Professional, knowledgeable, and always available. Highly recommended!"</p>
            <p class="author">- Michael Chen</p>
          </div>
          <div class="testimonial-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"They negotiated an amazing deal for us. Truly invaluable service!"</p>
            <p class="author">- Emily Rodriguez</p>
          </div>
        </div>
      </section>

      <!-- CTA SECTION -->
      <section class="cta-section">
        <h2>Ready to Find Your Dream Home?</h2>
        <p>Join thousands of happy homeowners who found their perfect property with us</p>
        <a routerLink="/properties" class="btn btn-cta">Browse All Properties</a>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      width: 100%;
      overflow-x: hidden;
    }

    /* HERO SECTION */
    .hero {
      position: relative;
      height: 600px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: white;
      overflow: hidden;
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
    }

    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 800px;
      padding: 2rem;
    }

    .hero h1 {
      font-size: 3.5rem;
      margin-bottom: 1rem;
      font-weight: 700;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .hero p {
      font-size: 1.3rem;
      margin-bottom: 2.5rem;
      opacity: 0.95;
    }

    .hero-search {
      display: flex;
      gap: 0.5rem;
      max-width: 500px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      padding: 0.5rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .hero-search input {
      flex: 1;
      border: none;
      outline: none;
      padding: 0.75rem;
      font-size: 1rem;
      background: transparent;
    }

    .btn-search {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-search:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    /* STATS SECTION */
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: -3rem auto 0;
      position: relative;
      z-index: 3;
    }

    .stat-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-card h3 {
      font-size: 2.5rem;
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .stat-card p {
      color: #666;
      font-size: 1rem;
    }

    /* FEATURED PROPERTIES SECTION */
    .featured-section {
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .section-header h2 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .section-header p {
      color: #666;
      font-size: 1.1rem;
    }

    .properties-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .property-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;
    }

    .property-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .property-image {
      position: relative;
      height: 250px;
      overflow: hidden;
      background: #f0f0f0;
    }

    .property-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .property-card:hover .property-image img {
      transform: scale(1.05);
    }

    .no-image {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #999;
      font-size: 1rem;
      background: #f5f5f5;
    }

    .price-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: #667eea;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: bold;
      font-size: 1.1rem;
    }

    .property-info {
      padding: 1.5rem;
    }

    .property-info h3 {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .location {
      color: #666;
      margin-bottom: 1rem;
      font-size: 0.95rem;
    }

    .property-specs {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .spec {
      color: #666;
      font-size: 0.9rem;
    }

    .btn-view {
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-view:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    /* WHY CHOOSE US SECTION */
    .why-choose-us {
      background: #f8f9fa;
      padding: 4rem 2rem;
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .benefit-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: all 0.3s;
    }

    .benefit-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .benefit-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .benefit-card h3 {
      color: #333;
      margin-bottom: 1rem;
      font-size: 1.2rem;
    }

    .benefit-card p {
      color: #666;
      line-height: 1.6;
    }

    /* HOW IT WORKS SECTION */
    .how-it-works {
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .steps-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .step {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      position: relative;
    }

    .step-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0 auto 1rem;
    }

    .step h3 {
      color: #333;
      margin-bottom: 1rem;
    }

    .step p {
      color: #666;
      line-height: 1.6;
    }

    /* TESTIMONIALS SECTION */
    .testimonials {
      background: #f8f9fa;
      padding: 4rem 2rem;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .testimonial-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: all 0.3s;
    }

    .testimonial-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .stars {
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    .testimonial-card p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1rem;
      font-style: italic;
    }

    .author {
      color: #333;
      font-weight: bold;
      font-style: normal;
      margin: 0 !important;
    }

    /* CTA SECTION */
    .cta-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 2rem;
      text-align: center;
      margin-top: 4rem;
    }

    .cta-section h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .cta-section p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      opacity: 0.95;
    }

    .btn-cta {
      display: inline-block;
      padding: 1rem 3rem;
      background: white;
      color: #667eea;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      font-size: 1.1rem;
      transition: all 0.3s;
    }

    .btn-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    /* LOADING STATE */
    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
      font-size: 1.1rem;
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2rem;
      }

      .hero p {
        font-size: 1rem;
      }

      .hero-search {
        flex-direction: column;
      }

      .section-header h2 {
        font-size: 2rem;
      }

      .stats {
        grid-template-columns: repeat(2, 1fr);
        margin-top: -2rem;
      }

      .properties-grid {
        grid-template-columns: 1fr;
      }

      .cta-section h2 {
        font-size: 1.8rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProperties: Property[] = [];
  loadingFeatured = false;
  searchQuery = '';

  constructor(
    private propertyService: PropertyService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFeaturedProperties();
  }

  loadFeaturedProperties() {
    this.loadingFeatured = true;
    this.propertyService.getProperties().subscribe({
      next: (properties) => {
        this.featuredProperties = properties.sort(() => Math.random() - 0.5).slice(0, 6);
        this.loadingFeatured = false;
      },
      error: (error) => {
        console.error('Error loading featured properties:', error);
        this.loadingFeatured = false;
      },
    });
  }

  search() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/properties'], { queryParams: { q: this.searchQuery } });
    } else {
      this.router.navigate(['/properties']);
    }
  }

  viewProperty(id: string | undefined) {
    if (id) {
      this.router.navigate(['/property', id]);
    }
  }
}
