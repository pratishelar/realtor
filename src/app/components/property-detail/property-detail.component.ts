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
    <div class="container-fluid py-4">
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading property...</span>
        </div>
      </div>

      <div *ngIf="!loading && property" class="container">
        <header class="mb-4">
          <div class="row g-4 align-items-start">
            <div class="col-12 col-md-8">
              <h1 class="mb-2">{{ property.title }}</h1>
              <p class="text-muted mb-0">📍 {{ property.location }}</p>
            </div>
            <div class="col-12 col-md-4 text-md-end">
              <div class="badge bg-primary fs-4 mb-3">₹{{ property.price | number }}</div>
              <div class="d-flex gap-2 justify-content-md-end">
                <button class="btn btn-primary">Request Call</button>
                <button class="btn btn-outline-secondary">Message</button>
              </div>
            </div>
          </div>
        </header>

        <section class="row g-4">
          <div class="col-12 col-lg-8">
            <div class="card p-0 mb-4">
              <img *ngIf="property.images && property.images.length>0" [src]="selectedImage || property.images[0]" [alt]="property.title" class="w-100" style="max-height: 500px; object-fit: cover;" loading="lazy" decoding="async" (error)="onImageError($event)" />
              <div *ngIf="!property.images || property.images.length===0" class="bg-light d-flex align-items-center justify-content-center" style="height: 400px;">
                <span class="text-muted">📷 No Image</span>
              </div>
            </div>
            <div class="d-flex gap-2 mb-4 overflow-auto" *ngIf="property.images && property.images.length>1">
              <button *ngFor="let image of property.images | slice:0:12" (click)="selectedImage = image" class="btn p-0 border" [class.border-primary]="selectedImage===image" [class.border-2]="selectedImage===image">
                <img [src]="image" [alt]="property.title" style="width: 100px; height: 75px; object-fit: cover;" loading="lazy" decoding="async" (error)="onImageError($event)" />
              </button>
            </div>

            <div class="card shadow-sm p-4 mb-4">
              <h3 class="mb-3">Description</h3>
              <p class="mb-0">{{ property.description }}</p>
            </div>

            <div class="card shadow-sm p-4 mb-4">
              <h3 class="mb-3">Key Highlights</h3>
              <div class="d-flex flex-wrap gap-2">
                <span class="badge bg-light text-dark border">🏡 Premium Property</span>
                <span class="badge bg-light text-dark border">🔐 Secure Location</span>
                <span class="badge bg-light text-dark border">✨ Well Maintained</span>
                <span class="badge bg-light text-dark border">👥 Established Builder</span>
              </div>
            </div>

            <div class="card shadow-sm p-4">
              <h3 class="mb-3">Amenities</h3>
              <div class="d-flex flex-wrap gap-2">
                <span *ngFor="let a of (property.amenities || ['Gym','Clubhouse','Parking'])" class="badge bg-primary">{{ a }}</span>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-4">
            <div class="card shadow-sm p-4 mb-4">
              <h3 class="mb-3">Overview</h3>
              <div class="d-flex justify-content-between mb-2">
                <span>Bedrooms</span>
                <strong>{{ property.bedrooms }}</strong>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Bathrooms</span>
                <strong>{{ property.bathrooms }}</strong>
              </div>
              <div class="d-flex justify-content-between mb-0">
                <span>Area</span>
                <strong>{{ property.area | number }} Sq.Ft.</strong>
              </div>
            </div>

            <div class="card shadow-sm p-4 mb-4">
              <h3 class="mb-3">Contact Owner</h3>
              <div class="d-flex align-items-center gap-3 mb-3">
                <div class="bg-light rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                  <span class="fs-3">👤</span>
                </div>
                <div>
                  <div class="fw-bold">{{ property.owner }}</div>
                  <div *ngIf="property.phone" class="small"><a [href]="'tel:' + property.phone" class="text-decoration-none">{{ property.phone }}</a></div>
                  <div *ngIf="property.email" class="small"><a [href]="'mailto:' + property.email" class="text-decoration-none">{{ property.email }}</a></div>
                </div>
              </div>
              <button class="btn btn-primary w-100">Request Visit</button>
            </div>

            <div class="card shadow-sm p-4">
              <div class="d-flex justify-content-between mb-2">
                <span>Price per Sq.Ft.</span>
                <strong>₹{{ getPricePerSqFt(property) | number:'1.0-0' }}</strong>
              </div>
              <div class="d-flex justify-content-between mb-0">
                <span>Total</span>
                <strong class="text-primary">₹{{ property.price | number }}</strong>
              </div>
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
  styles: []
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
            
            if (data && Array.isArray(data.images) && data.images.length > 0) {
              this.selectedImage = data.images[0];
            } else {
              this.selectedImage = null;
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
    element.style.visibility = 'hidden';
  }
}
