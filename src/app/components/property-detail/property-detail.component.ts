import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4 property-detail-page">
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading property...</span>
        </div>
      </div>

      <div *ngIf="!loading && property" class="container">
        <section class="row g-3">
          <div class="col-12 col-lg-8">
            <div class="card p-2 p-md-3 mb-3 shadow-sm border-0 property-gallery">
              <div class="row g-2">
                <div class="col-12 col-md-8">
                  <div class="gallery-main overflow-hidden rounded-3 border position-relative">
                    <img *ngIf="property.images && property.images.length > 0" [src]="selectedImage || property.images[0]" [alt]="property.title" class="w-100 h-100" loading="lazy" decoding="async" (error)="onImageError($event)" />
                    <div *ngIf="!property.images || property.images.length===0" class="bg-light d-flex align-items-center justify-content-center h-100">
                      <span class="text-muted">📷 No Image</span>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="row g-2">
                    <div class="col-6" *ngFor="let image of property.images | slice:1:5; let i = index">
                      <button class="btn p-0 border rounded-3 overflow-hidden w-100 thumb-btn" (click)="selectedImage = image" [class.border-dark]="selectedImage===image">
                        <img [src]="image" [alt]="property.title" class="w-100 h-100" loading="lazy" decoding="async" (error)="onImageError($event)" />
                      </button>
                    </div>
                    <div class="col-6" *ngIf="property.images && property.images.length < 5">
                      <div class="thumb-btn border rounded-3 bg-light d-flex align-items-center justify-content-center h-100 small text-muted">No more</div>
                    </div>
                    <div class="col-6" *ngIf="property.images && property.images.length > 5">
                      <div class="thumb-btn border rounded-3 bg-dark text-white d-flex align-items-center justify-content-center h-100">+{{ property.images.length - 5 }} Photos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card shadow-sm p-4 mb-4">
              <h3 class="h5 mb-3">About this Property</h3>
              <p class="mb-0">{{ property.description }}</p>
            </div>

            <div class="card shadow-sm p-4 mb-4">
              <h3 class="h5 mb-3">Price List</h3>
              <div class="table-responsive">
                <table class="table table-sm mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>Configuration</th>
                      <th class="text-end">Area (Sq.Ft.)</th>
                      <th class="text-end">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let row of getPriceList(property)">
                      <td>{{ row.configuration }}</td>
                      <td class="text-end">{{ row.area | number:'1.0-0' }}</td>
                      <td class="text-end">₹{{ row.price | number }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="card shadow-sm p-4 mb-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="h5 mb-0">Floor Plans</h3>
                <a href="#" class="small text-decoration-none" (click)="$event.preventDefault()">View all</a>
              </div>
              <div class="row g-3">
                <div class="col-12 col-md-4" *ngFor="let plan of getFloorPlans(property)">
                  <div class="border rounded p-2 h-100">
                    <img [src]="plan.image" [alt]="plan.label" class="w-100 rounded mb-2" style="height: 120px; object-fit: cover;" loading="lazy" decoding="async" (error)="onImageError($event)" />
                    <div class="small fw-semibold">{{ plan.label }}</div>
                    <div class="small text-muted">{{ plan.area | number:'1.0-0' }} Sq.Ft.</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card shadow-sm p-4 mt-4">
              <h3 class="h5 mb-3">Amenities</h3>
              <div class="row g-2 amenity-grid">
                <div class="col-6 col-md-2" *ngFor="let amenity of getAmenities(property)">
                  <div class="p-1 text-center h-100 d-flex flex-column align-items-center justify-content-center amenity-icon-box" [title]="amenity" [attr.aria-label]="amenity">
                    <span class="amenity-icon">{{ getAmenityIcon(amenity) }}</span>
                    <span class="amenity-label">{{ amenity }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="card shadow-sm p-4 mt-4">
              <h3 class="h5 mb-3">Specification</h3>
              <ul class="mb-0 ps-3">
                <li *ngFor="let spec of getSpecifications(property)" class="mb-2">{{ spec }}</li>
              </ul>
            </div>

            <div class="card shadow-sm p-4 mt-4">
              <h3 class="h5 mb-3">Maps & Locality</h3>
              <div class="rounded border p-3 mb-3 bg-light">
                <div class="fw-semibold">{{ property.location }}</div>
                <div class="small text-muted">Schools, hospitals, metro and essentials nearby</div>
              </div>
              <div class="d-flex gap-2 flex-wrap">
                <a [href]="getMapsUrl(property.location)" target="_blank" rel="noopener" class="btn btn-outline-primary">Open in Google Maps</a>
                <button class="btn btn-outline-secondary">Explore Nearby</button>
              </div>
            </div>

            <div class="card shadow-sm p-4 mt-4">
              <h3 class="h5 mb-3">RERA Details</h3>
              <div class="d-flex justify-content-between mb-2">
                <span>RERA Status</span>
                <strong class="text-success">Registered</strong>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>RERA Number</span>
                <strong>{{ getReraNumber(property) }}</strong>
              </div>
              <div class="d-flex justify-content-between mb-0">
                <span>Possession</span>
                <strong>{{ property.possessionStatus || 'As per builder commitment' }}</strong>
              </div>
            </div>

            <div class="card shadow-sm p-4 mt-4">
              <h3 class="h5 mb-3">Ratings & Reviews</h3>
              <div class="d-flex align-items-center gap-3 mb-3">
                <div class="display-6 fw-bold">4.2</div>
                <div>
                  <div class="text-warning">★★★★☆</div>
                  <div class="small text-muted">Based on 124 verified reviews</div>
                </div>
              </div>
              <div class="row g-3">
                <div class="col-12 col-md-6" *ngFor="let review of reviewHighlights">
                  <div class="border rounded p-3 h-100">
                    <div class="fw-semibold mb-1">{{ review.title }}</div>
                    <div class="small text-muted">{{ review.text }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card shadow-sm p-4 mt-4 mb-2">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="h5 mb-0">Similar Properties</h3>
                <a routerLink="/properties" class="small text-decoration-none">View all</a>
              </div>
              <div *ngIf="relatedProperties.length === 0" class="text-muted small">No similar listings available currently.</div>
              <div class="row g-3" *ngIf="relatedProperties.length > 0">
                <div class="col-12 col-md-6" *ngFor="let item of relatedProperties">
                  <div class="border rounded p-2 h-100">
                    <img *ngIf="item.images && item.images.length > 0" [src]="item.images[0]" [alt]="item.title" class="w-100 rounded mb-2" style="height: 130px; object-fit: cover;" loading="lazy" decoding="async" (error)="onImageError($event)" />
                    <div class="fw-semibold small mb-1">{{ item.title }}</div>
                    <div class="small text-muted mb-1">{{ item.location }}</div>
                    <div class="small text-primary fw-semibold">₹{{ item.price | number }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-4">
            <div class="card shadow-sm border p-0 mb-3 top-price-card">
              <div class="p-3 p-md-4 border-bottom">
                <h1 class="h4 mb-1 fw-bold">{{ property.title }}</h1>
                <div class="text-muted">{{ property.location }}</div>
              </div>
              <div class="p-3 p-md-4 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div class="fs-3 fw-bold">{{ getPriceRange(property.price) }} <span class="fs-5 text-muted fw-semibold">+ Charges</span></div>
                <button class="btn btn-outline-warning fw-semibold">Price Insights</button>
              </div>
              <div class="p-3 p-md-4 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <div class="text-muted">Project Status</div>
                  <div class="fs-5 fw-bold">{{ property.possessionStatus || 'Under Construction' }}</div>
                </div>
                <button class="btn btn-outline-warning fw-semibold">RERA Updates</button>
              </div>
              <div class="p-3 p-md-4">
                <div class="row g-3">
                  <div class="col-6 col-md-3">
                    <div class="text-muted small">Unit Config</div>
                    <div class="fw-bold">{{ property.bedrooms }}, {{ property.bedrooms + 1 }} BHK Flats</div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="text-muted small">Size</div>
                    <div class="fw-bold">{{ property.area | number:'1.0-0' }} to {{ (property.area * 1.18) | number:'1.0-0' }} Sq.Ft.</div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="text-muted small">Number of Units</div>
                    <div class="fw-bold">{{ getEstimatedUnits(property.area) }}</div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="text-muted small">Total area</div>
                    <div class="fw-bold">{{ getEstimatedProjectArea(property.area) }} Acres</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card shadow-sm p-3 p-md-4 mb-4 contact-seller-card">
              <div class="d-flex align-items-center gap-2 mb-3">
                <div class="contact-icon-circle">📞</div>
                <h3 class="h4 fw-bold mb-0">Contact our Real Estate Experts</h3>
              </div>

              <form class="contact-expert-form">
                <div class="mb-3">
                  <input type="text" class="form-control contact-input" placeholder="Name" required />
                </div>

                <div class="mb-3">
                  <input type="email" class="form-control contact-input" placeholder="Email ID" required />
                </div>

                <div class="mb-4">
                  <div class="input-group phone-group">
                    <select class="form-select country-code" aria-label="Country code">
                      <option value="+91" selected>+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                    </select>
                    <input type="tel" class="form-control contact-input" placeholder="Phone Number" required />
                  </div>
                </div>

                <button type="submit" class="btn btn-warning w-100 fw-bold py-3 contact-now-btn">Contact Now</button>
              </form>
            </div>
          </div>
        </section>
      </div>

      <div *ngIf="!loading && !property" class="text-center py-5">
        <h2>Property not found</h2>
        <p class="text-muted">It may have been removed or is unavailable.</p>
      </div>
    </div>
  `,
  styles: [`
    .property-detail-page .card {
      border-radius: 0.75rem;
    }

    .brand-pill {
      border: 1px solid #dcdcdc;
      border-radius: 0.5rem;
      padding: 0.5rem 0.85rem;
      font-weight: 700;
      font-size: 0.8rem;
      color: #777;
      background: #fff;
      line-height: 1;
    }

    .gallery-main {
      height: 420px;
    }

    .gallery-main img,
    .thumb-btn img {
      object-fit: cover;
    }

    .thumb-btn {
      height: 132px;
    }

    .why-list li {
      color: #4e4e4e;
    }

    .amenity-icon-box {
      min-height: 74px;
    }

    .amenity-icon {
      font-size: 2rem;
      line-height: 1;
    }

    .amenity-label {
      margin-top: 0.25rem;
      font-size: 0.72rem;
      line-height: 1.2;
      color: #5f5f5f;
      text-align: center;
    }

    .amenity-grid {
      margin-top: 0.1rem;
    }

    .contact-seller-card {
      background: #f3f3f3;
    }

    .contact-icon-circle {
      width: 54px;
      height: 54px;
      border: 2px solid #202020;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.7rem;
      line-height: 1;
      flex-shrink: 0;
    }

    .contact-input,
    .country-code {
      height: 64px;
      border-radius: 1rem;
      border-color: #d8d8d8;
      font-size: 1.1rem;
      padding-left: 1.2rem;
    }

    .phone-group .country-code {
      max-width: 130px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    .phone-group .contact-input {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .contact-now-btn {
      font-size: 1.9rem;
      border-radius: 1rem;
      color: #1f2a44;
    }

    @media (min-width: 992px) {
      .top-price-card {
        min-height: 452px;
      }

      .contact-seller-card {
        position: sticky;
        top: 88px;
      }
    }

    @media (max-width: 767.98px) {
      .gallery-main {
        height: 280px;
      }

      .thumb-btn {
        height: 110px;
      }
    }
  `]
})
export class PropertyDetailComponent implements OnInit {
  private readonly fallbackImage = 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1200&h=800&fit=crop&q=80';
  property: Property | null = null;
  relatedProperties: Property[] = [];
  selectedImage: string | null = null;
  loading = true;
  reviewHighlights = [
    { title: 'Construction Quality', text: 'Residents appreciate quality materials and finishing across common areas.' },
    { title: 'Connectivity', text: 'Strong road and transit access with key hubs reachable in short drive time.' },
    { title: 'Amenities', text: 'Clubhouse, fitness facilities and landscaped open spaces are rated positively.' },
    { title: 'Neighbourhood', text: 'Good social infrastructure with schools, healthcare and retail in proximity.' },
  ];

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.propertyService.getProperty(params['id']).subscribe({
          next: (data) => {
            const normalizedProperty = data ? this.normalizeProperty(data) : null;
            this.property = normalizedProperty;
            
            if (normalizedProperty && normalizedProperty.images.length > 0) {
              this.selectedImage = normalizedProperty.images[0];
            } else {
              this.selectedImage = null;
            }

            if (normalizedProperty && params['id']) {
              this.loadRelatedProperties(params['id'], normalizedProperty.location);
            } else {
              this.relatedProperties = [];
            }

            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading property:', error);
            this.loading = false;
          },
        });
      } else {
        this.property = null;
        this.loading = false;
      }
    });
  }

  getPricePerSqFt(property: Property): number {
    if (!property || !property.area || property.area <= 0) {
      return 0;
    }
    return property.price / property.area;
  }

  onImageError(event: Event) {
    const element = event.target as HTMLImageElement;
    if (element.src !== this.fallbackImage) {
      element.src = this.fallbackImage;
      return;
    }

    element.style.visibility = 'hidden';
  }

  getMapsUrl(location: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location || '')}`;
  }

  getPriceList(property: Property): Array<{ configuration: string; area: number; price: number }> {
    const area = property.area || 0;
    const basePrice = property.price || 0;
    const rows = [
      { configuration: `${Math.max(property.bedrooms, 1)} BHK`, area, price: basePrice },
      { configuration: `${Math.max(property.bedrooms + 1, 2)} BHK`, area: Math.round(area * 1.18), price: Math.round(basePrice * 1.2) },
      { configuration: 'Penthouse', area: Math.round(area * 1.42), price: Math.round(basePrice * 1.55) },
    ];

    return rows.filter((row) => row.area > 0 && row.price > 0);
  }

  getFloorPlans(property: Property): Array<{ label: string; area: number; image: string }> {
    const fallbackImage = 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=800&h=600&fit=crop&q=80';
    const images = property.images && property.images.length > 0 ? property.images : [fallbackImage, fallbackImage, fallbackImage];

    return [
      { label: `${Math.max(property.bedrooms, 1)} BHK Plan`, area: property.area, image: images[0] || fallbackImage },
      { label: `${Math.max(property.bedrooms + 1, 2)} BHK Plan`, area: Math.round(property.area * 1.18), image: images[1] || images[0] || fallbackImage },
      { label: 'Penthouse Plan', area: Math.round(property.area * 1.42), image: images[2] || images[0] || fallbackImage },
    ].filter((plan) => plan.area > 0);
  }

  getAmenities(property: Property): string[] {
    const fallback = ['Clubhouse', 'Gymnasium', 'Swimming Pool', 'Kids Play Area', 'Landscaped Garden', 'Power Backup'];
    return property.amenities && property.amenities.length > 0 ? property.amenities : fallback;
  }

  getAmenityIcon(amenity: string): string {
    const value = (amenity || '').toLowerCase();

    if (value.includes('gym') || value.includes('fitness')) return '🏋️';
    if (value.includes('pool') || value.includes('swim')) return '🏊';
    if (value.includes('club')) return '🏛️';
    if (value.includes('kids') || value.includes('play')) return '🛝';
    if (value.includes('garden') || value.includes('landscape') || value.includes('park')) return '🌳';
    if (value.includes('power') || value.includes('backup') || value.includes('electric')) return '⚡';
    if (value.includes('security') || value.includes('cctv')) return '🛡️';
    if (value.includes('parking')) return '🅿️';
    if (value.includes('lift') || value.includes('elevator')) return '🛗';

    return '✅';
  }

  getSpecifications(property: Property): string[] {
    const fallback = [
      'Vitrified flooring in living and bedrooms',
      'Modular kitchen with premium granite counter',
      'Branded sanitary fittings in all bathrooms',
      '24x7 security with CCTV in common areas',
      'Power backup for essential services',
    ];

    return property.features && property.features.length > 0 ? property.features : fallback;
  }

  getEstimatedEmi(price: number): number {
    if (!price || price <= 0) {
      return 0;
    }

    return price * 0.008;
  }

  getPriceRange(price: number): string {
    if (!price || price <= 0) {
      return '₹0';
    }

    const lower = price * 0.9;
    const upper = price * 1.1;
    return `₹${this.formatCr(lower)} Cr - ₹${this.formatCr(upper)} Cr`;
  }

  getEstimatedUnits(area: number): number {
    if (!area || area <= 0) {
      return 0;
    }

    return Math.max(120, Math.round(area / 7));
  }

  getEstimatedProjectArea(area: number): string {
    if (!area || area <= 0) {
      return '0.00';
    }

    const acres = area / 240;
    return acres.toFixed(2);
  }

  getReraNumber(property: Property): string {
    const ref = (property.id || '000000').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    return `RERA-${ref.padEnd(8, '0')}`;
  }

  private formatCr(amount: number): string {
    const valueInCr = amount / 10000000;
    return valueInCr.toFixed(2);
  }

  private loadRelatedProperties(currentId: string, location: string): void {
    this.propertyService.getProperties().subscribe({
      next: (items) => {
        const normalizedLocation = (location || '').toLowerCase();
        const preferred = items
          .map((item) => this.normalizeProperty(item))
          .filter((item) => item.id !== currentId)
          .sort((a, b) => {
            const aScore = (a.location || '').toLowerCase().includes(normalizedLocation) ? 1 : 0;
            const bScore = (b.location || '').toLowerCase().includes(normalizedLocation) ? 1 : 0;
            return bScore - aScore;
          })
          .slice(0, 4);

        this.relatedProperties = preferred;
      },
      error: () => {
        this.relatedProperties = [];
      },
    });
  }

  private normalizeProperty(property: Property): Property {
    const safeImages = Array.isArray(property.images)
      ? property.images.filter((image): image is string => typeof image === 'string' && image.trim().length > 0)
      : [];

    return {
      ...property,
      images: safeImages,
    };
  }
}
