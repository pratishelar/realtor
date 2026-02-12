import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="property-detail-wrapper">
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading property details...</p>
      </div>

      <div *ngIf="!loading && property" class="property-detail-content">
        <!-- HEADER WITH PRICE -->
        <div class="header-section">
          <div class="header-content">
            <h1>{{ property.title }}</h1>
            <div class="header-meta">
              <span class="price">₹{{ property.price | number }}</span>
              <span class="location">📍 {{ property.location }}</span>
            </div>
          </div>
        </div>

        <!-- IMAGE GALLERY -->
        <div class="gallery-section">
          <div class="main-image">
            <img
              *ngIf="property.images && property.images.length > 0"
              [src]="selectedImage || property.images[0]"
              [alt]="property.title"
            />
            <div *ngIf="!property.images || property.images.length === 0" class="no-image-placeholder">
              📷 No Image Available
            </div>
          </div>
          <div class="image-thumbnails" *ngIf="property.images && property.images.length > 1">
            <img
              *ngFor="let image of property.images"
              [src]="image"
              (click)="selectedImage = image"
              [class.active]="selectedImage === image"
              class="thumbnail"
              [alt]="property.title"
            />
          </div>
        </div>

        <!-- MAIN CONTENT GRID -->
        <div class="content-grid">
          <!-- LEFT COLUMN -->
          <div class="left-column">
            <!-- KEY HIGHLIGHTS -->
            <div class="section highlight-section">
              <h2>Key Highlights</h2>
              <div class="highlights-grid">
                <div class="highlight-item">
                  <span class="highlight-icon">🏡</span>
                  <span class="highlight-text">Premium Property</span>
                </div>
                <div class="highlight-item">
                  <span class="highlight-icon">🔐</span>
                  <span class="highlight-text">Secure Location</span>
                </div>
                <div class="highlight-item">
                  <span class="highlight-icon">✨</span>
                  <span class="highlight-text">Well Maintained</span>
                </div>
                <div class="highlight-item">
                  <span class="highlight-icon">👥</span>
                  <span class="highlight-text">Established Builder</span>
                </div>
              </div>
            </div>

            <!-- PROPERTY INFORMATION TABLE -->
            <div class="section info-section">
              <h2>Property Information</h2>
              <div class="info-table">
                <div class="info-row">
                  <span class="label">Property Type</span>
                  <span class="value">Apartment</span>
                </div>
                <div class="info-row">
                  <span class="label">Bedrooms</span>
                  <span class="value">{{ property.bedrooms }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Bathrooms</span>
                  <span class="value">{{ property.bathrooms }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Area</span>
                  <span class="value">{{ property.area | number }} Sq.Ft.</span>
                </div>
                <div class="info-row">
                  <span class="label">Location</span>
                  <span class="value">{{ property.location }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Price</span>
                  <span class="value">₹{{ property.price | number }}</span>
                </div>
              </div>
            </div>

            <!-- DESCRIPTION -->
            <div class="section description-section">
              <h2>Description</h2>
              <p class="description-text">{{ property.description }}</p>
            </div>

            <!-- AMENITIES -->
            <div class="section amenities-section">
              <h2>Amenities</h2>
              <div class="amenities-grid">
                <div class="amenity-item">
                  <span class="amenity-icon">🏋️</span>
                  <span>Gymnasium</span>
                </div>
                <div class="amenity-item">
                  <span class="amenity-icon">🎾</span>
                  <span>Sports Court</span>
                </div>
                <div class="amenity-item">
                  <span class="amenity-icon">🏃</span>
                  <span>Jogging Track</span>
                </div>
                <div class="amenity-item">
                  <span class="amenity-icon">⚡</span>
                  <span>Power Backup</span>
                </div>
                <div class="amenity-item">
                  <span class="amenity-icon">❄️</span>
                  <span>Central AC</span>
                </div>
                <div class="amenity-item">
                  <span class="amenity-icon">🍽️</span>
                  <span>Restaurant</span>
                </div>
                <div class="amenity-item">
                  <span class="amenity-icon">🎪</span>
                  <span>Clubhouse</span>
                </div>
                <div class="amenity-item">
                  <span class="amenity-icon">🏥</span>
                  <span>Medical Facility</span>
                </div>
              </div>
            </div>

            <!-- FEATURES -->
            <div class="section features-section" *ngIf="property.features && property.features.length > 0">
              <h2>Features Included</h2>
              <ul class="features-list">
                <li *ngFor="let feature of property.features">
                  <span class="feature-icon">✓</span>
                  {{ feature }}
                </li>
              </ul>
            </div>
          </div>

          <!-- RIGHT COLUMN (SIDEBAR) -->
          <div class="right-column">
            <!-- QUICK STATS -->
            <div class="section stats-card">
              <h3>Property Overview</h3>
              <div class="stats-grid">
                <div class="stat">
                  <span class="stat-label">Bedrooms</span>
                  <span class="stat-value">{{ property.bedrooms }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Bathrooms</span>
                  <span class="stat-value">{{ property.bathrooms }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Area (Sq.Ft.)</span>
                  <span class="stat-value">{{ property.area | number }}</span>
                </div>
              </div>
            </div>

            <!-- CONTACT OWNER CARD -->
            <div class="section contact-card">
              <h3>Contact Owner</h3>
              <div class="owner-info">
                <div class="owner-avatar">👤</div>
                <div class="owner-details">
                  <p class="owner-name">{{ property.owner }}</p>
                  <p *ngIf="property.email" class="owner-email">
                    <a [href]="'mailto:' + property.email">{{ property.email }}</a>
                  </p>
                  <p *ngIf="property.phone" class="owner-phone">
                    <a [href]="'tel:' + property.phone">{{ property.phone }}</a>
                  </p>
                </div>
              </div>
              <button class="btn btn-primary">Request Call</button>
              <button class="btn btn-secondary">Send Message</button>
            </div>

            <!-- PRICE CARD -->
            <div class="section price-card">
              <div class="price-per-sqft">
                <span class="label">Price per Sq.Ft.</span>
                <span class="value">₹{{ (property.price / property.area * 100000) | number: '1.0-0' }}</span>
              </div>
              <div class="total-price">
                <span class="label">Total Price</span>
                <span class="value">₹{{ property.price | number }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !property" class="not-found">
        <div class="not-found-content">
          <h2>Property Not Found</h2>
          <p>The property you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .property-detail-wrapper {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
      padding: 2rem 0;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 500px;
      color: #0d47a1;
      font-size: 1.2rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(13, 71, 161, 0.3);
      border-top-color: #0d47a1;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .property-detail-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    /* HEADER SECTION */
    .header-section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      box-shadow: 0 4px 12px rgba(13, 71, 161, 0.1);
    }

    .header-content h1 {
      font-size: 2.2rem;
      color: #0d47a1;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .header-meta {
      display: flex;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .price {
      font-size: 1.8rem;
      font-weight: 700;
      color: #00d9d9;
    }

    .location {
      font-size: 1.1rem;
      color: #455a64;
    }

    /* GALLERY SECTION */
    .gallery-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(13, 71, 161, 0.1);
    }

    .main-image {
      width: 100%;
      height: 450px;
      border-radius: 12px;
      overflow: hidden;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .main-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .main-image:hover img {
      transform: scale(1.02);
    }

    .no-image-placeholder {
      font-size: 3rem;
      color: #999;
    }

    .image-thumbnails {
      display: flex;
      gap: 1rem;
      overflow-x: auto;
      padding: 0.5rem 0;
    }

    .thumbnail {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
      cursor: pointer;
      border: 3px solid transparent;
      transition: all 0.3s;
      flex-shrink: 0;
    }

    .thumbnail:hover {
      border-color: #00d9d9;
      transform: scale(1.05);
    }

    .thumbnail.active {
      border-color: #0d47a1;
      box-shadow: 0 4px 12px rgba(13, 71, 161, 0.3);
    }

    /* CONTENT GRID */
    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    /* SECTIONS */
    .section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(13, 71, 161, 0.1);
      margin-bottom: 2rem;
    }

    .section h2 {
      color: #0d47a1;
      font-size: 1.4rem;
      margin-bottom: 1.5rem;
      font-weight: 700;
      border-bottom: 3px solid #00d9d9;
      padding-bottom: 0.75rem;
    }

    .section h3 {
      color: #0d47a1;
      font-size: 1.1rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    /* HIGHLIGHT SECTION */
    .highlight-section {
      background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
    }

    .highlights-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .highlight-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      border-left: 4px solid #00d9d9;
      transition: all 0.3s;
    }

    .highlight-item:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 12px rgba(0, 217, 217, 0.2);
    }

    .highlight-icon {
      font-size: 1.8rem;
    }

    .highlight-text {
      color: #455a64;
      font-weight: 600;
    }

    /* INFO TABLE */
    .info-table {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .info-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
      transition: background 0.3s;
    }

    .info-row:hover {
      background: #f5f7fa;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-row .label {
      color: #666;
      font-weight: 600;
      font-size: 0.95rem;
    }

    .info-row .value {
      color: #0d47a1;
      font-weight: 700;
      text-align: right;
    }

    /* DESCRIPTION */
    .description-text {
      color: #455a64;
      line-height: 1.8;
      font-size: 1rem;
    }

    /* AMENITIES */
    .amenities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1.5rem;
    }

    .amenity-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background: #f5f7fa;
      border-radius: 8px;
      text-align: center;
      transition: all 0.3s;
      cursor: pointer;
      border: 2px solid transparent;
    }

    .amenity-item:hover {
      background: white;
      border-color: #00d9d9;
      transform: translateY(-5px);
      box-shadow: 0 6px 16px rgba(0, 217, 217, 0.2);
    }

    .amenity-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .amenity-item span:last-child {
      color: #455a64;
      font-weight: 600;
      font-size: 0.9rem;
    }

    /* FEATURES */
    .features-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .features-list li {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      background: #f5f7fa;
      border-radius: 6px;
      color: #455a64;
      transition: all 0.3s;
    }

    .features-list li:hover {
      background: #e8f4f8;
      transform: translateX(5px);
    }

    .feature-icon {
      color: #00d9d9;
      font-weight: 700;
      margin-right: 1rem;
      font-size: 1.2rem;
    }

    /* RIGHT COLUMN CARDS */
    .right-column {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .stats-card {
      background: linear-gradient(135deg, #00d9d9 0%, #0097cf 100%);
      color: white;
      padding: 2rem;
      margin-bottom: 0;
    }

    .stats-card h3 {
      color: white;
      margin-bottom: 1.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
    }

    .stat-label {
      font-size: 0.85rem;
      opacity: 0.9;
      margin-bottom: 0.5rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
    }

    /* CONTACT CARD */
    .contact-card {
      border: 2px solid #00d9d9;
      background: #f9fafb;
    }

    .owner-info {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
    }

    .owner-avatar {
      font-size: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      background: #e8f4f8;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .owner-details {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .owner-name {
      font-weight: 700;
      color: #0d47a1;
      margin: 0;
    }

    .owner-email, .owner-phone {
      margin: 0.25rem 0;
      font-size: 0.9rem;
    }

    .owner-email a, .owner-phone a {
      color: #00d9d9;
      text-decoration: none;
      font-weight: 600;
    }

    .owner-email a:hover, .owner-phone a:hover {
      text-decoration: underline;
    }

    .btn {
      width: 100%;
      padding: 0.875rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #00d9d9 0%, #0097cf 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(0, 217, 217, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 217, 217, 0.4);
    }

    .btn-secondary {
      background: white;
      color: #0d47a1;
      border: 2px solid #0d47a1;
    }

    .btn-secondary:hover {
      background: #0d47a1;
      color: white;
      transform: translateY(-2px);
    }

    /* PRICE CARD */
    .price-card {
      background: white;
      border: 2px solid #f0f0f0;
      margin-bottom: 0;
    }

    .price-per-sqft, .total-price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .price-per-sqft:last-child, .total-price:last-child {
      border-bottom: none;
    }

    .price-card .label {
      color: #666;
      font-size: 0.95rem;
    }

    .price-card .value {
      color: #0d47a1;
      font-weight: 700;
      font-size: 1.2rem;
    }

    /* NOT FOUND */
    .not-found {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      margin: 2rem;
    }

    .not-found-content h2 {
      color: #0d47a1;
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .not-found-content p {
      color: #666;
      font-size: 1.1rem;
    }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }

      .highlights-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .property-detail-wrapper {
        padding: 1rem 0;
      }

      .property-detail-content {
        padding: 0 1rem;
      }

      .header-content h1 {
        font-size: 1.5rem;
      }

      .header-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .main-image {
        height: 300px;
      }

      .gallery-section {
        padding: 1rem;
      }

      .section {
        padding: 1.5rem;
      }

      .info-row {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .info-row .value {
        text-align: left;
      }

      .amenities-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class PropertyDetailComponent implements OnInit {
  property: Property | null = null;
  selectedImage: string | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.propertyService.getProperty(params['id']).subscribe({
          next: (data) => {
            this.property = data;
            console.log('Property loaded:', data);
            console.log('Property images:', data?.images);
            
            if (data && Array.isArray(data.images) && data.images.length > 0) {
              this.selectedImage = data.images[0];
              console.log('First image set:', this.selectedImage);
            } else {
              console.warn('No images found for property');
              this.selectedImage = null;
            }
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading property:', error);
            this.loading = false;
          },
        });
      }
    });
  }
}
