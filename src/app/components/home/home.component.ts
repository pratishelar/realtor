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
    <div class="home-container container-fluid px-0">
      <!-- HERO SECTION -->
      <section class="hero">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <h1>Find Your Dream Property</h1>
          <p>Discover premium real estate opportunities with our expert guidance</p>
          <div class="hero-search input-group">
            <input class="form-control" type="text" [(ngModel)]="searchQuery" placeholder="Search by location..." (keyup.enter)="search()">
            <button (click)="search()" class="btn-search btn btn-primary">Search</button>
          </div>
        </div>
      </section>

      <!-- STATS SECTION -->
      <section class="stats container py-5">
        <div class="row g-4">
          <div class="col-6 col-md-3">
            <div class="stat-card card text-center p-4">
              <h3 class="mb-2">500+</h3>
              <p class="mb-0">Active Listings</p>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-card card text-center p-4">
              <h3 class="mb-2">15,000+</h3>
              <p class="mb-0">Happy Clients</p>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-card card text-center p-4">
              <h3 class="mb-2">50+</h3>
              <p class="mb-0">Expert Agents</p>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-card card text-center p-4">
              <h3 class="mb-2">$2B+</h3>
              <p class="mb-0">Properties Sold</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURED PROPERTIES SECTION -->
      <section class="featured-section container py-5">
        <div class="section-header text-center mb-5">
          <h2 class="mb-3">Featured Properties</h2>
          <p class="text-muted">Handpicked properties that stand out from the rest</p>
        </div>
        <div *ngIf="loadingFeatured" class="loading">Loading properties...</div>
        <div *ngIf="!loadingFeatured && featuredProperties.length > 0" class="row g-4">
          <div *ngFor="let property of featuredProperties.slice(0, 6)" class="col-12 col-md-6 col-lg-4">
            <div class="property-card card h-100 p-0 overflow-hidden">
              <div class="property-image">
                <img 
                  *ngIf="property.images && property.images.length > 0" 
                  [src]="property.images[0]" 
                  [alt]="property.title"                  loading="lazy"
                  (error)="handleImageError($event)"                />
                <div *ngIf="!property.images || property.images.length === 0" class="no-image">
                  No Image Available
                </div>
                <span class="price-badge">\${{ property.price | number }}</span>
              </div>
              <div class="property-info p-3">
                <h3 class="mb-2">{{ property.title }}</h3>
                <p class="location mb-3">📍 {{ property.location }}</p>
                <div class="property-specs mb-3 d-flex gap-3">
                  <span class="spec">🛏️ {{ property.bedrooms }}</span>
                  <span class="spec">🚿 {{ property.bathrooms }}</span>
                  <span class="spec">📐 {{ property.area | number }} sqft</span>
                </div>
                <button class="btn btn-outline-primary w-100" (click)="viewProperty(property.id)">View Details</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- WHY CHOOSE US SECTION -->
      <section class="why-choose-us bg-light py-5">
        <div class="container">
          <div class="section-header text-center mb-5">
            <h2 class="mb-3">Why Choose Us</h2>
            <p class="text-muted">The best real estate partner for your needs</p>
          </div>
          <div class="row g-4">
            <div class="col-12 col-md-6 col-lg-4">
              <div class="benefit-card card h-100 text-center p-4">
                <div class="benefit-icon mb-3">🏆</div>
                <h3 class="mb-3">Award-Winning Team</h3>
                <p class="mb-0">Recognized leaders in real estate with decades of combined experience</p>
              </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
              <div class="benefit-card card h-100 text-center p-4">
                <div class="benefit-icon mb-3">💼</div>
                <h3 class="mb-3">Professional Service</h3>
                <p class="mb-0">Dedicated support from start to finish with personalized attention</p>
              </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
              <div class="benefit-card card h-100 text-center p-4">
                <div class="benefit-icon mb-3">🔍</div>
                <h3 class="mb-3">Thorough Search</h3>
                <p class="mb-0">Access to exclusive listings and advanced market analysis tools</p>
              </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
              <div class="benefit-card card h-100 text-center p-4">
                <div class="benefit-icon mb-3">💰</div>
                <h3 class="mb-3">Best Value</h3>
                <p class="mb-0">Negotiate better deals with our market expertise and negotiation skills</p>
              </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
              <div class="benefit-card card h-100 text-center p-4">
                <div class="benefit-icon mb-3">🤝</div>
                <h3 class="mb-3">Trusted Partners</h3>
                <p class="mb-0">Work with verified lenders, inspectors, and legal professionals</p>
              </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
              <div class="benefit-card card h-100 text-center p-4">
                <div class="benefit-icon mb-3">⚡</div>
                <h3 class="mb-3">Fast & Efficient</h3>
                <p class="mb-0">Streamlined process to get you in your dream home quickly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- HOW IT WORKS SECTION -->
      <section class="how-it-works container py-5">
        <div class="section-header text-center mb-5">
          <h2 class="mb-3">How It Works</h2>
          <p class="text-muted">Simple steps to find your perfect property</p>
        </div>
        <div class="row g-4">
          <div class="col-12 col-md-6 col-lg-3">
            <div class="step card h-100 text-center p-4">
              <div class="step-number mb-3">1</div>
              <h3 class="mb-3">Browse Properties</h3>
              <p class="mb-0">Explore our extensive collection of premium properties that match your criteria</p>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="step card h-100 text-center p-4">
              <div class="step-number mb-3">2</div>
              <h3 class="mb-3">Schedule Tours</h3>
              <p class="mb-0">Book virtual or in-person tours with our expert agents at your convenience</p>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="step card h-100 text-center p-4">
              <div class="step-number mb-3">3</div>
              <h3 class="mb-3">Make an Offer</h3>
              <p class="mb-0">Submit competitive offers with our agents' guidance and market insights</p>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="step card h-100 text-center p-4">
              <div class="step-number mb-3">4</div>
              <h3 class="mb-3">Close the Deal</h3>
              <p class="mb-0">We coordinate with all parties to ensure a smooth closing process</p>
            </div>
          </div>
        </div>
      </section>

      <!-- TESTIMONIALS SECTION -->
      <section class="testimonials bg-light py-5">
        <div class="container">
          <div class="section-header text-center mb-5">
            <h2 class="mb-3">What Clients Say</h2>
            <p class="text-muted">Real experiences from our satisfied customers</p>
          </div>
          <div class="row g-4">
            <div class="col-12 col-md-4">
              <div class="testimonial-card card h-100 p-4">
                <div class="stars mb-3">⭐⭐⭐⭐⭐</div>
                <p class="mb-3">"Exceptional service! The team helped us find the perfect home in just two weeks."</p>
                <p class="author mb-0 fw-bold">- Sarah Johnson</p>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="testimonial-card card h-100 p-4">
                <div class="stars mb-3">⭐⭐⭐⭐⭐</div>
                <p class="mb-3">"Professional, knowledgeable, and always available. Highly recommended!"</p>
                <p class="author mb-0 fw-bold">- Michael Chen</p>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="testimonial-card card h-100 p-4">
                <div class="stars mb-3">⭐⭐⭐⭐⭐</div>
                <p class="mb-3">"They negotiated an amazing deal for us. Truly invaluable service!"</p>
                <p class="author mb-0 fw-bold">- Emily Rodriguez</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA SECTION -->
      <section class="cta-section text-white text-center py-5">
        <div class="container py-5">
          <h2 class="mb-3">Ready to Find Your Dream Home?</h2>
          <p class="mb-4">Join thousands of happy homeowners who found their perfect property with us</p>
          <a routerLink="/properties" class="btn btn-light btn-lg">Browse All Properties</a>
        </div>
      </section>
    </div>
  `,
  styles: []
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
        this.featuredProperties = properties
          .sort(() => Math.random() - 0.5)
          .slice(0, 6);
        this.loadingFeatured = false;
      },
      error: (error) => {
        console.error('HomeComponent - Error loading featured properties:', error);
        this.featuredProperties = [];
        this.loadingFeatured = false;
      },
    });
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
      const noImageDiv = document.createElement('div');
      noImageDiv.className = 'no-image';
      noImageDiv.textContent = 'Image unavailable';
      parent.appendChild(noImageDiv);
    }
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
