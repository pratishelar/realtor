import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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
            <div class="card p-0 mb-3 shadow-sm border-0 property-gallery overflow-hidden">
              <div class="row g-2">
                <div class="col-12" [class.col-md-8]="property.images && property.images.length > 1" [class.col-md-12]="!property.images || property.images.length <= 1">
                  <div class="gallery-main overflow-hidden rounded-3 border position-relative">
                    <img *ngIf="getOrderedImages(property).length > 0" [src]="selectedImage || getOrderedImages(property)[0]" [alt]="property.name || property.title" class="w-100 h-100" loading="lazy" decoding="async" (error)="onImageError($event)" (click)="openGallery(getOrderedImages(property), selectedImage || getOrderedImages(property)[0])" style="cursor: zoom-in;" />
                    <div *ngIf="getOrderedImages(property).length===0" class="bg-light d-flex align-items-center justify-content-center h-100">
                      <span class="text-muted">📷 No Image</span>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-4" *ngIf="getOrderedImages(property).length > 1">
                  <div class="row g-2">
                    <div class="col-6" *ngFor="let image of getOrderedImages(property) | slice:1:5; let i = index">
                      <button class="btn p-0 border rounded-3 overflow-hidden w-100 thumb-btn" (click)="selectedImage = image; openGallery(getOrderedImages(property), image)" [class.border-dark]="selectedImage===image" type="button">
                        <img [src]="image" [alt]="property.name || property.title" class="w-100 h-100" loading="lazy" decoding="async" (error)="onImageError($event)" />
                      </button>
                    </div>
                    <div class="col-6" *ngIf="getOrderedImages(property).length > 5">
                      <button type="button" class="thumb-btn border rounded-3 bg-dark text-white d-flex align-items-center justify-content-center h-100 w-100" (click)="openGallery(getOrderedImages(property))">+{{ getOrderedImages(property).length - 5 }} Photos</button>
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
                        <div class="small text-muted" *ngIf="plan.area > 0">{{ plan.area | number:'1.0-0' }} Sq.Ft.</div>
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
              <h3 class="h5 mb-3">RERA Details</h3>
              <div class="d-flex justify-content-between mb-2">
                <span>RERA Status</span>
                <strong class="text-success">{{ property.reraDetails.reraStatus || 'N/A' }}</strong>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>RERA Number</span>
                <strong>{{ property.reraDetails.reraNumber || getReraNumber(property) }}</strong>
              </div>
              <div class="d-flex justify-content-between mb-0">
                <span>Possession</span>
                <strong>{{ property.reraDetails.possession || getDisplayStatus(property) }}</strong>
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
                    <img *ngIf="getOrderedImages(item).length > 0" [src]="getOrderedImages(item)[0]" [alt]="item.name || item.title" class="w-100 rounded mb-2" style="height: 130px; object-fit: cover;" loading="lazy" decoding="async" (error)="onImageError($event)" />
                    <div class="fw-semibold small mb-1">{{ item.name || item.title }}</div>
                    <div class="small text-muted mb-1">{{ item.location }}{{ item.city ? ', ' + item.city : '' }}</div>
                    <div class="small text-primary fw-semibold">₹{{ getDisplayPrice(item) | number }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-4">
            <div class="card shadow-sm border p-0 mb-3 top-price-card">
              <div class="p-3 p-md-4 border-bottom">
                <h1 class="h4 mb-1 fw-bold">{{ property.name || property.title }}</h1>
                <div class="text-muted">{{ property.location }}{{ property.city ? ', ' + property.city : '' }}</div>
              </div>
              <div class="p-3 p-md-4 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div class="fs-3 fw-bold">{{ getPriceRange(getDisplayPrice(property)) }} <span class="fs-5 text-muted fw-semibold">+ Charges</span></div>
                <button class="btn btn-outline-warning fw-semibold">Price Insights</button>
              </div>
              <div class="p-3 p-md-4 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <div class="text-muted">Project Status</div>
                  <div class="fs-5 fw-bold">{{ getDisplayStatus(property) }}</div>
                </div>
                <button class="btn btn-outline-warning fw-semibold">RERA Updates</button>
              </div>
              <div class="p-3 p-md-4">
                <div class="row g-3">
                  <div class="col-6 col-md-3">
                    <div class="text-muted small">Unit Config</div>
                    <div class="fw-bold">{{ getUnitConfigLabel(property) }}</div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="text-muted small">Size</div>
                    <div class="fw-bold">{{ property.size.carpetArea | number:'1.0-0' }} to {{ property.size.totalArea | number:'1.0-0' }} Sq.Ft.</div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="text-muted small">Number of Units</div>
                    <div class="fw-bold">{{ property.numberOfUnits || 0 }}</div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="text-muted small">Total area</div>
                    <div class="fw-bold">{{ getTotalAreaInAcres(property) }} Acres</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card shadow-sm p-3 p-md-4 mb-4 contact-seller-card">
              <div class="d-flex align-items-center gap-2 mb-3">
                <div class="contact-icon-circle">📞</div>
                <h3 class="h4 fw-bold mb-0">Contact our Real Estate Experts</h3>
              </div>

              <form class="contact-expert-form" (ngSubmit)="submitExpertForm(property)">
                <div class="mb-3">
                  <input
                    type="text"
                    class="form-control contact-input"
                    placeholder="Name"
                    [(ngModel)]="expertForm.name"
                    name="expertName"
                    required
                  />
                </div>

                <div class="mb-3">
                  <input
                    type="email"
                    class="form-control contact-input"
                    placeholder="Email ID"
                    [(ngModel)]="expertForm.email"
                    name="expertEmail"
                    required
                  />
                </div>

                <div class="mb-4">
                  <div class="input-group phone-group">
                    <select class="form-select country-code" aria-label="Country code" [(ngModel)]="expertForm.countryCode" name="expertCountryCode">
                      <option value="+91" selected>+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                    </select>
                    <input
                      type="tel"
                      class="form-control contact-input"
                      placeholder="Phone Number"
                      [(ngModel)]="expertForm.phone"
                      name="expertPhone"
                      required
                    />
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

      <div *ngIf="galleryOpen" class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center" style="z-index: 2000;" (click)="closeGallery()">
        <div class="position-relative w-100 h-100 d-flex align-items-center justify-content-center p-3" (click)="$event.stopPropagation()">
          <button type="button" class="btn btn-light position-absolute top-0 end-0 m-3" (click)="closeGallery()">✕</button>

          <button type="button" class="btn btn-light position-absolute start-0 ms-2 ms-md-4" (click)="showPreviousImage()" *ngIf="galleryImages.length > 1">‹</button>

          <img
            *ngIf="galleryImages.length > 0"
            [src]="galleryImages[currentGalleryIndex]"
            alt="Gallery image"
            class="rounded"
            style="max-width: 95vw; max-height: 85vh; object-fit: contain;"
            (error)="onImageError($event)"
          />

          <button type="button" class="btn btn-light position-absolute end-0 me-2 me-md-4" (click)="showNextImage()" *ngIf="galleryImages.length > 1">›</button>

          <div class="position-absolute bottom-0 mb-3 text-white small" *ngIf="galleryImages.length > 0">
            {{ currentGalleryIndex + 1 }} / {{ galleryImages.length }}
          </div>
        </div>
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
  galleryOpen = false;
  galleryImages: string[] = [];
  currentGalleryIndex = 0;
  loading = true;
  expertForm = {
    name: '',
    email: '',
    countryCode: '+91',
    phone: '',
  };

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
              this.selectedImage = this.getOrderedImages(normalizedProperty)[0] || null;
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
    const area = this.getDisplayArea(property);
    const price = this.getDisplayPrice(property);
    if (!property || !area || area <= 0) {
      return 0;
    }
    return price / area;
  }

  onImageError(event: Event) {
    const element = event.target as HTMLImageElement;
    if (element.src !== this.fallbackImage) {
      element.src = this.fallbackImage;
      return;
    }

    element.style.visibility = 'hidden';
  }

  openGallery(images: string[] | undefined, currentImage?: string) {
    const safeImages = Array.isArray(images)
      ? images.filter((image): image is string => typeof image === 'string' && image.trim().length > 0)
      : [];

    if (safeImages.length === 0) {
      return;
    }

    this.galleryImages = safeImages;
    const selectedIndex = currentImage ? safeImages.indexOf(currentImage) : 0;
    this.currentGalleryIndex = selectedIndex >= 0 ? selectedIndex : 0;
    this.galleryOpen = true;
  }

  closeGallery() {
    this.galleryOpen = false;
    this.galleryImages = [];
    this.currentGalleryIndex = 0;
  }

  showPreviousImage() {
    if (this.galleryImages.length <= 1) {
      return;
    }

    this.currentGalleryIndex =
      this.currentGalleryIndex === 0 ? this.galleryImages.length - 1 : this.currentGalleryIndex - 1;
  }

  showNextImage() {
    if (this.galleryImages.length <= 1) {
      return;
    }

    this.currentGalleryIndex =
      this.currentGalleryIndex === this.galleryImages.length - 1 ? 0 : this.currentGalleryIndex + 1;
  }

  submitExpertForm(property: Property) {
    const name = (this.expertForm.name || '').trim();
    const email = (this.expertForm.email || '').trim();
    const phone = (this.expertForm.phone || '').trim();
    const countryCode = (this.expertForm.countryCode || '').trim();

    if (!name || !email || !phone) {
      alert('Please fill all contact fields before submitting.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const to = 'pratishshelar961992@gmail.com';
    const subject = `Property Inquiry: ${property.name || property.title}`;
    const message = [
      `Hello Team,`,
      '',
      `I am interested in this property: ${property.name || property.title}`,
      `Location: ${property.location}${property.city ? `, ${property.city}` : ''}`,
      `Property ID: ${property.id || 'N/A'}`,
      '',
      `My Details:`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${countryCode} ${phone}`,
      '',
      `Please contact me with more details.`,
      '',
      `Thanks,`,
      name,
    ].join('\n');

    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  }

  getPriceList(property: Property): Array<{ configuration: string; area: number; price: number }> {
    if (property.priceList && property.priceList.length > 0) {
      return property.priceList
        .map((row) => ({
          configuration: row.configuration,
          area: Number(row.area) || 0,
          price: Number(row.price) || 0,
        }))
        .filter((row) => row.configuration && row.area > 0 && row.price > 0);
    }

    const area = this.getDisplayArea(property);
    const basePrice = this.getDisplayPrice(property);
    const config = this.getUnitConfigLabel(property);
    if (area > 0 && basePrice > 0) {
      return [{ configuration: config, area, price: basePrice }];
    }

    return [];
  }

  getFloorPlans(property: Property): Array<{ label: string; area: number; image: string }> {
    const plans = property.floorPlans && property.floorPlans.length > 0 ? property.floorPlans : [];
    const area = this.getDisplayArea(property);

    return plans
      .filter((image) => typeof image === 'string' && image.trim().length > 0)
      .map((image, index) => ({
        label: `Floor Plan ${index + 1}`,
        area,
        image,
      }));
  }

  getAmenities(property: Property): string[] {
    return property.amenities && property.amenities.length > 0 ? property.amenities : [];
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
      title: property.title || property.name || '',
      name: property.name || property.title || '',
      mainImage: property.mainImage || safeImages[0] || undefined,
      images: safeImages,
    };
  }

  getOrderedImages(property: Property): string[] {
    const safeImages = Array.isArray(property.images)
      ? property.images.filter((image): image is string => typeof image === 'string' && image.trim().length > 0)
      : [];

    const mainImage = (property.mainImage || '').trim();
    if (!mainImage) {
      return safeImages;
    }

    const remaining = safeImages.filter((image) => image !== mainImage);
    return [mainImage, ...remaining];
  }

  getDisplayPrice(property: Property): number {
    return Number(property.priceDetails.totalPrice || property.price || property.priceDetails.basePrice || 0);
  }

  getDisplayArea(property: Property): number {
    return Number(property.size.totalArea || property.area || property.size.carpetArea || 0);
  }

  getDisplayStatus(property: Property): string {
    if (property.reraDetails.possession) {
      return property.reraDetails.possession;
    }

    if (property.status.readyToMove) {
      return 'Ready to Move';
    }

    if (property.status.underConstruction) {
      return 'Under Construction';
    }

    if (property.status.preConstruction) {
      return 'Pre Construction';
    }

    return property.possessionStatus || 'N/A';
  }

  getUnitConfigLabel(property: Property): string {
    const configs: string[] = [];
    if (property.unitConfig['1bhk']) configs.push('1 BHK');
    if (property.unitConfig['2bhk']) configs.push('2 BHK');
    if (property.unitConfig['3bhk']) configs.push('3 BHK');
    if (property.unitConfig['4bhk']) configs.push('4 BHK');
    if (property.unitConfig['5bhk']) configs.push('5 BHK');

    if (configs.length > 0) {
      return configs.join(', ');
    }

    return property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'N/A';
  }

  getTotalAreaInAcres(property: Property): string {
    const totalArea = Number(property.size.totalArea || property.area || 0);
    if (totalArea <= 0) {
      return '0.00';
    }

    return (totalArea / 43560).toFixed(2);
  }
}
