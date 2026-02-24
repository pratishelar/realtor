import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Mobile Filter Toggle Button -->
      <div class="d-lg-none mb-3">
        <button class="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" (click)="toggleFilters()">
          <span>{{ showFilters ? '✕' : '☰' }}</span>
          <span>{{ showFilters ? 'Hide Filters' : 'Show Filters' }}</span>
        </button>
      </div>
      
      <div class="row g-4">
        <div class="col-12 col-lg-3" [class.d-none]="!showFilters" [class.d-lg-block]="true">
          <div class="sidebar-filters card p-4">

            <!-- Category (moved to top) -->
            <div class="filter-section mb-4">
              <label class="form-label fw-bold">Category</label>
              <div class="checkbox-group">
                <div class="form-check mb-2">
                  <input type="checkbox" class="form-check-input" id="cat-residential" [(ngModel)]="selectedResidential" (change)="applyFilters()" />
                  <label class="form-check-label" for="cat-residential">Residential</label>
                </div>
                <div class="form-check mb-2">
                  <input type="checkbox" class="form-check-input" id="cat-commercial" [(ngModel)]="selectedCommercial" (change)="applyFilters()" />
                  <label class="form-check-label" for="cat-commercial">Commercial</label>
                </div>
              </div>
            </div>

            <!-- Property Type (moved to top) -->
            <div class="filter-section mb-4">
              <label class="form-label fw-bold">Property Type</label>
              <div class="checkbox-group">
                <div class="form-check mb-2">
                  <input type="checkbox" class="form-check-input" (change)="applyFilters()" />
                  <label class="form-check-label">Apartment</label>
                </div>
                <div class="form-check mb-2">
                  <input type="checkbox" class="form-check-input" (change)="applyFilters()" />
                  <label class="form-check-label">House</label>
                </div>
                <div class="form-check mb-2">
                  <input type="checkbox" class="form-check-input" (change)="applyFilters()" />
                  <label class="form-check-label">Villa</label>
                </div>
                <div class="form-check mb-2">
                  <input type="checkbox" class="form-check-input" (change)="applyFilters()" />
                  <label class="form-check-label">Condo</label>
                </div>
              </div>
            </div>

            <!-- Possession Status -->
            <div class="filter-section mb-4">
              <label class="form-label fw-bold">Possession Status</label>
              <div class="checkbox-group">
                <div class="form-check mb-2">
                  <input type="checkbox" class="form-check-input" id="resale" [(ngModel)]="selectedResale" (change)="applyFilters()" />
                  <label class="form-check-label" for="resale">Resale / Ready to Move</label>
                </div>
                <div class="form-check mb-2">
                  <input type="checkbox" class="form-check-input" id="construction" [(ngModel)]="selectedUnderConstruction" (change)="applyFilters()" />
                  <label class="form-check-label" for="construction">Under Construction</label>
                </div>
              </div>
            </div>

            <!-- Search Bar -->
            <div class="filter-section mb-4">
              <label class="form-label fw-bold">Search</label>
              <input
                type="text"
                placeholder="Search by title, location..."
                [(ngModel)]="searchQuery"
                (keyup)="applyFilters()"
                class="form-control"
              />
            </div>

            <!-- Price Range -->
            <div class="filter-section mb-4">
              <label class="form-label fw-bold">Price Range</label>
              <div class="mb-3">
                <label class="form-label small">Min Price: ₹{{ minPrice | number }}</label>
                <input
                  type="range"
                  [(ngModel)]="minPrice"
                  (input)="onMinPriceChange()"
                  class="form-range"
                  [min]="priceFloor"
                  [max]="priceCeiling"
                  step="10000"
                />
              </div>
              <div class="mb-3">
                <label class="form-label small">Max Price: ₹{{ maxPrice | number }}</label>
                <input
                  type="range"
                  [(ngModel)]="maxPrice"
                  (input)="onMaxPriceChange()"
                  class="form-range"
                  [min]="priceFloor"
                  [max]="priceCeiling"
                  step="10000"
                />
              </div>
              <div class="text-muted small">₹{{ minPrice | number }} - ₹{{ maxPrice | number }}</div>
            </div>

            <!-- Bedrooms -->
            <div class="filter-section mb-4">
              <label class="form-label fw-bold">Bedrooms</label>
              <select [(ngModel)]="selectedBedrooms" (change)="applyFilters()" class="form-select">
                <option [ngValue]="null">All</option>
                <option [ngValue]="1">1</option>
                <option [ngValue]="2">2</option>
                <option [ngValue]="3">3</option>
                <option [ngValue]="4">4</option>
                <option [ngValue]="5">5+</option>
              </select>
            </div>

            <!-- Bathrooms -->
            <div class="filter-section mb-4">
              <label class="form-label fw-bold">Bathrooms</label>
              <select [(ngModel)]="selectedBathrooms" (change)="applyFilters()" class="form-select">
                <option [ngValue]="null">All</option>
                <option [ngValue]="1">1</option>
                <option [ngValue]="2">2</option>
                <option [ngValue]="3">3</option>
                <option [ngValue]="4">4+</option>
              </select>
            </div>


            <!-- Area/Size -->
            <div class="filter-section mb-4">
              <label class="form-label fw-bold">Minimum Area (sqft)</label>
              <input
                type="number"
                [(ngModel)]="minArea"
                (change)="applyFilters()"
                class="form-control"
                placeholder="Min sqft"
              />
            </div>

            <!-- Sort Options -->
            <div class="filter-section mb-4">
              <label class="form-label fw-bold">Sort By</label>
              <select [(ngModel)]="sortBy" (change)="applyFilters()" class="form-select">
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="size">Size: Large to Small</option>
              </select>
            </div>

            <!-- Reset Filters -->
            <button (click)="resetFilters()" class="btn btn-outline-secondary w-100">Reset All Filters</button>
          </div>
        </div>

        <div class="col-12 col-lg-9">
          <div class="d-flex justify-content-end align-items-center mb-4">
            <span class="badge bg-primary">{{ filteredProperties.length }} found</span>
          </div>

          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading properties...</span>
            </div>
          </div>

          <div *ngIf="!loading && loadError" class="alert alert-warning d-flex justify-content-between align-items-center" role="alert">
            <span>{{ loadError }}</span>
            <button class="btn btn-sm btn-outline-dark" (click)="loadProperties()">Retry</button>
          </div>

          <div *ngIf="!loading && !loadError && filteredProperties.length === 0" class="text-center py-5">
            <p class="text-muted mb-3">No properties match your filters.</p>
            <button (click)="resetFilters()" class="btn btn-outline-secondary">Clear Filters</button>
          </div>

          <div class="row g-3">
            <div *ngFor="let property of visibleProperties; trackBy: trackByPropertyId" class="col-12">
              <div class="property-listing-card card overflow-hidden border-0 shadow-sm" (click)="openPropertyDetails(property.id)" (keypress)="onCardKeypress($event, property.id)" tabindex="0" role="button">
                <div class="row g-0">
                  <!-- Property Image -->
                  <div class="col-12 col-lg-5">
                    <div class="property-image-container position-relative">
                      <img
                        *ngIf="property.images && property.images.length > 0"
                        [src]="property.images[0]"
                        [alt]="property.title"
                        loading="lazy"
                        (error)="handleImageError($event)"
                        class="property-main-image"
                      />
                      <div *ngIf="!property.images || property.images.length === 0" class="no-image-placeholder d-flex align-items-center justify-content-center">
                        <span class="text-muted">No Image Available</span>
                      </div>
                      <div class="image-count-badge position-absolute top-0 start-0 m-3 bg-dark bg-opacity-75 text-white px-2 py-1 rounded">
                        <i class="bi bi-images"></i> {{ property.images.length || 0 }}
                      </div>
                      <button class="favorite-btn position-absolute top-0 end-0 m-3 btn btn-light rounded-circle p-2" title="Add to favorites">
                        ♡
                      </button>
                    </div>
                  </div>
                  
                  <!-- Property Details -->
                  <div class="col-12 col-lg-7">
                    <div class="property-content p-3">
                      <!-- Title and Location -->
                      <div class="mb-3">
                        <h3 class="property-listing-title mb-2">{{ property.title }}</h3>
                        <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                          <p class="property-subtitle text-muted mb-0">
                            {{ property.bedrooms }} BHK for Sale in {{ property.location }}
                          </p>
                          <a href="#" class="text-decoration-none small" (click)="$event.preventDefault()">
                            <span class="text-danger">📍</span> See on Map
                          </a>
                        </div>
                      </div>
                      
                      <!-- Price -->
                      <div class="property-price mb-3">
                        <h2 class="mb-0 fw-bold">\${{ property.price | number }}</h2>
                      </div>
                      
                      <!-- Features Grid -->
                      <div class="property-features-grid row g-3 mb-3">
                        <div class="col-6 col-md-4">
                          <div class="feature-item d-flex align-items-center gap-2">
                            <span class="feature-icon">🛏️</span>
                            <span class="feature-text">{{ property.bedrooms }} BHK + {{ property.bathrooms }} Bath</span>
                          </div>
                        </div>
                        <div class="col-6 col-md-4">
                          <div class="feature-item d-flex align-items-center gap-2">
                            <span class="feature-icon">📐</span>
                            <span class="feature-text">{{ property.area | number }} Sq.Ft</span>
                          </div>
                        </div>
                        <div class="col-6 col-md-4">
                          <div class="feature-item d-flex align-items-center gap-2">
                            <span class="feature-icon">🏢</span>
                            <span class="feature-text">Ready To Move</span>
                          </div>
                        </div>
                        <div class="col-6 col-md-4">
                          <div class="feature-item d-flex align-items-center gap-2">
                            <span class="feature-icon">🪑</span>
                            <span class="feature-text">Semi-Furnished</span>
                          </div>
                        </div>
                        <div class="col-6 col-md-4">
                          <div class="feature-item d-flex align-items-center gap-2">
                            <span class="feature-icon">🅿️</span>
                            <span class="feature-text">Covered Parking</span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Description -->
                      <div class="property-description mb-3">
                        <p class="text-muted mb-0 small">
                          {{ (property.description || '') | slice: 0: 180 }}{{ (property.description || '').length > 180 ? '...' : '' }}
                          <a href="#" class="text-primary text-decoration-none" (click)="$event.preventDefault(); $event.stopPropagation(); openPropertyDetails(property.id)">Read More</a>
                        </p>
                      </div>
                      
                      <!-- Tags -->
                      <div class="property-tags mb-3 d-flex flex-wrap gap-2">
                        <span class="badge bg-light text-dark border">SAFE & SECURE</span>
                        <span class="badge bg-light text-dark border">AFFORDABLE</span>
                        <span class="badge bg-light text-dark border">SPACIOUS</span>
                        <span class="badge bg-light text-dark border">WELL MAINTAINED</span>
                      </div>
                      
                      <!-- Agent and Actions -->
                      <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 pt-3 border-top">
                        <div class="agent-info d-flex align-items-center gap-2">
                          <div class="agent-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                            {{ property.owner ? property.owner.charAt(0).toUpperCase() : 'A' }}
                          </div>
                          <div>
                            <div class="fw-semibold">{{ property.owner || 'Property Agent' }}</div>
                            <div class="small text-muted">
                              <span class="badge badge-sm bg-warning text-dark">PRO AGENT</span>
                            </div>
                          </div>
                        </div>
                        <div class="action-buttons d-flex gap-2">
                          <button class="btn btn-outline-dark btn-sm" (click)="$event.stopPropagation()">
                            📞 View Number
                          </button>
                          <button class="btn btn-warning btn-sm text-dark fw-semibold" (click)="$event.stopPropagation(); openPropertyDetails(property.id)">
                            📧 Contact Agent
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mt-4" *ngIf="filteredProperties.length > displayLimit">
            <button class="btn btn-outline-primary" (click)="loadMoreProperties()">Load More Properties</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PropertiesComponent implements OnInit {
  private readonly fallbackImage = 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1200&h=800&fit=crop&q=80';
  allProperties: Property[] = [];
  filteredProperties: Property[] = [];
  visibleProperties: Property[] = [];
  loading = false;
  loadError = '';
  showFilters = false;
  displayLimit = 12;

  searchQuery = '';
  priceFloor = 0;
  priceCeiling = 1000000;
  minPrice = 0;
  maxPrice = 1000000;
  selectedBedrooms: number | null = null;
  selectedBathrooms: number | null = null;
  minArea = 0;
  sortBy = 'newest';
  selectedResidential = false;
  selectedCommercial = false;
  selectedResale = false;
  selectedUnderConstruction = false;

  constructor(private propertyService: PropertyService, private router: Router) {}

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    this.loading = true;
    this.loadError = '';
    this.propertyService.getProperties().subscribe({
      next: (data) => {
        const normalized = (data || []).map((property) => this.normalizeProperty(property));
        this.updatePriceBounds(normalized);
        this.allProperties = normalized;
        this.filteredProperties = normalized;
        this.updateVisibleProperties();
        this.loading = false;
      },
      error: (error) => {
        console.error('PropertiesComponent - Error loading properties:', error);
        this.allProperties = [];
        this.filteredProperties = [];
        this.visibleProperties = [];
        this.loadError = 'Unable to load properties right now. Please try again.';
        this.loading = false;
      },
    });
  }

  applyFilters() {
    if (!this.allProperties || this.allProperties.length === 0) {
      this.filteredProperties = [];
      return;
    }
    
    let filtered = [...this.allProperties];

    // Search filter
    if (this.searchQuery && this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(query)) ||
          (p.location && p.location.toLowerCase().includes(query)) ||
          (p.description && p.description.toLowerCase().includes(query))
      );
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= this.minPrice && p.price <= this.maxPrice
    );

    // Bedrooms filter
    if (this.selectedBedrooms !== null) {
      if (this.selectedBedrooms === 5) {
        filtered = filtered.filter((p) => p.bedrooms >= 5);
      } else {
        filtered = filtered.filter((p) => p.bedrooms === this.selectedBedrooms);
      }
    }

    // Bathrooms filter
    if (this.selectedBathrooms !== null) {
      if (this.selectedBathrooms === 4) {
        filtered = filtered.filter((p) => p.bathrooms >= 4);
      } else {
        filtered = filtered.filter((p) => p.bathrooms === this.selectedBathrooms);
      }
    }

    // Area filter
    filtered = filtered.filter((p) => p.area >= this.minArea);

    // Category filter (Residential/Commercial)
    if (this.selectedResidential || this.selectedCommercial) {
      filtered = filtered.filter((p) => {
        const titleLower = p.title.toLowerCase();
        const descLower = p.description.toLowerCase();
        const isResidential =
          titleLower.includes('apartment') ||
          titleLower.includes('house') ||
          titleLower.includes('villa') ||
          titleLower.includes('condo') ||
          titleLower.includes('residential') ||
          descLower.includes('apartment') ||
          descLower.includes('house') ||
          descLower.includes('villa') ||
          descLower.includes('condo') ||
          descLower.includes('residential');

        const isCommercial =
          titleLower.includes('commercial') ||
          titleLower.includes('office') ||
          titleLower.includes('shop') ||
          titleLower.includes('mall') ||
          descLower.includes('commercial') ||
          descLower.includes('office') ||
          descLower.includes('shop') ||
          descLower.includes('mall');

        // Include if it matches selected category
        if (this.selectedResidential && isResidential) return true;
        if (this.selectedCommercial && isCommercial) return true;
        return false;
      });
    }

    // Possession status filter
    if (this.selectedResale || this.selectedUnderConstruction) {
      filtered = filtered.filter((p) => {
        const poss = (p as any).possessionStatus || (p as any).possession || '';
        const lower = (poss || '').toString().toLowerCase();
        const isResale = lower.includes('resale') || lower.includes('ready') || lower.includes('ready to move') || lower.includes('ready-to-move');
        const isUnder = lower.includes('under') || lower.includes('construction') || lower.includes('under construction');
        if (this.selectedResale && isResale) return true;
        if (this.selectedUnderConstruction && isUnder) return true;
        return false;
      });
    }

    // Sort
    switch (this.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'size':
        filtered.sort((a, b) => b.area - a.area);
        break;
      default:
        // Keep original order (newest first)
        break;
    }

    this.filteredProperties = filtered;
    this.displayLimit = 12;
    this.updateVisibleProperties();
  }

  resetFilters() {
    this.searchQuery = '';
    this.minPrice = 0;
    this.maxPrice = this.priceCeiling;
    this.selectedBedrooms = null;
    this.selectedBathrooms = null;
    this.minArea = 0;
    this.sortBy = 'newest';
    this.selectedResidential = false;
    this.selectedCommercial = false;
    this.selectedResale = false;
    this.selectedUnderConstruction = false;
    this.filteredProperties = [...this.allProperties];
    this.displayLimit = 12;
    this.updateVisibleProperties();
  }

  updateVisibleProperties() {
    this.visibleProperties = this.filteredProperties.slice(0, this.displayLimit);
  }

  loadMoreProperties() {
    this.displayLimit += 12;
    this.updateVisibleProperties();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  onMinPriceChange() {
    if (this.minPrice > this.maxPrice) {
      this.maxPrice = this.minPrice;
    }

    this.applyFilters();
  }

  onMaxPriceChange() {
    if (this.maxPrice < this.minPrice) {
      this.minPrice = this.maxPrice;
    }

    this.applyFilters();
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img.src !== this.fallbackImage) {
      img.src = this.fallbackImage;
      return;
    }

    img.style.display = 'none';
  }

  openPropertyDetails(propertyId: string | undefined) {
    if (propertyId) {
      this.router.navigate(['/property', propertyId]);
    }
  }

  onCardKeypress(event: KeyboardEvent, propertyId: string | undefined) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openPropertyDetails(propertyId);
    }
  }

  trackByPropertyId(index: number, property: Property) {
    return property.id || `${property.title}-${index}`;
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

  private updatePriceBounds(properties: Property[]) {
    const prices = properties
      .map((property) => Number(property.price) || 0)
      .filter((price) => price > 0);

    const maxSeen = prices.length > 0 ? Math.max(...prices) : 1000000;
    const roundedCeiling = Math.ceil(maxSeen / 100000) * 100000;

    this.priceFloor = 0;
    this.priceCeiling = Math.max(roundedCeiling, 1000000);
    this.minPrice = this.priceFloor;
    this.maxPrice = this.priceCeiling;
  }
}
