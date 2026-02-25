import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
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

            <!-- Search Bar -->
            <div class="filter-section mb-4">
              <label class="form-label fw-bold">Search</label>
              <div class="search-autocomplete position-relative">
                <input
                  type="text"
                  placeholder="Search by title, location..."
                  [(ngModel)]="searchQuery"
                  (input)="onSearchInput()"
                  (focus)="onSearchFocus()"
                  (blur)="onSearchBlur()"
                  class="form-control"
                />

                <div class="search-suggestions list-group" *ngIf="showLocationSuggestions && locationSuggestions.length > 0">
                  <button
                    type="button"
                    class="list-group-item list-group-item-action"
                    *ngFor="let suggestion of locationSuggestions"
                    (mousedown)="$event.preventDefault()"
                    (click)="selectLocationSuggestion(suggestion)"
                  >
                    {{ suggestion }}
                  </button>
                </div>

                <div class="selected-search-badge mt-2" *ngIf="selectedSearchLocation">
                  <span class="badge text-bg-light border d-inline-flex align-items-center gap-2 py-2 px-3">
                    {{ selectedSearchLocation }}
                    <button
                      type="button"
                      class="badge-clear-btn"
                      (click)="clearSelectedLocation($event)"
                      aria-label="Clear selected location"
                    >
                      ×
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <!-- Category (moved to top) -->
            <div class="filter-section mb-4">
              <label class="form-label fw-bold">Category</label>
              <div class="property-type-chip-wrap">
                <button
                  type="button"
                  class="property-type-chip"
                  [class.active]="selectedCategory === 'residential'"
                  [attr.aria-pressed]="selectedCategory === 'residential'"
                  (click)="selectedCategory = 'residential'; onCategoryChange()"
                >
                  <span class="chip-check">✓</span>
                  <span>Residential</span>
                </button>

                <button
                  type="button"
                  class="property-type-chip"
                  [class.active]="selectedCategory === 'commercial'"
                  [attr.aria-pressed]="selectedCategory === 'commercial'"
                  (click)="selectedCategory = 'commercial'; onCategoryChange()"
                >
                  <span class="chip-check">✓</span>
                  <span>Commercial</span>
                </button>
              </div>
            </div>

            <!-- Property Type (moved to top) -->
            <div class="filter-section mb-4">
              <label class="form-label fw-bold">Property Type</label>
              <div class="property-type-chip-wrap">
                <button
                  type="button"
                  class="property-type-chip"
                  *ngFor="let type of getAvailablePropertyTypes()"
                  [class.active]="isPropertyTypeSelected(type.key)"
                  [attr.aria-pressed]="isPropertyTypeSelected(type.key)"
                  (click)="togglePropertyType(type.key)"
                >
                  <span class="chip-check">✓</span>
                  <span>{{ type.label }}</span>
                </button>
              </div>
            </div>

            <!-- Possession Status -->
            <div class="filter-section mb-4">
              <label class="form-label fw-bold">Possession Status</label>
              <div class="property-type-chip-wrap">
                <button
                  type="button"
                  class="property-type-chip"
                  [class.active]="selectedResale"
                  [attr.aria-pressed]="selectedResale"
                  (click)="selectedResale = !selectedResale; onPossessionFilterChange()"
                >
                  <span class="chip-check">✓</span>
                  <span>Resale</span>
                </button>

                <button
                  type="button"
                  class="property-type-chip"
                  [class.active]="selectedReadyToMove"
                  [attr.aria-pressed]="selectedReadyToMove"
                  (click)="selectedReadyToMove = !selectedReadyToMove; onPossessionFilterChange()"
                >
                  <span class="chip-check">✓</span>
                  <span>Ready to Move</span>
                </button>

                <button
                  type="button"
                  class="property-type-chip"
                  [class.active]="selectedUnderConstruction"
                  [attr.aria-pressed]="selectedUnderConstruction"
                  (click)="selectedUnderConstruction = !selectedUnderConstruction; onPossessionFilterChange()"
                >
                  <span class="chip-check">✓</span>
                  <span>Under Construction</span>
                </button>
              </div>
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

            <!-- Reset Filters -->
            <button (click)="resetFilters()" class="btn btn-outline-secondary w-100">Reset All Filters</button>
          </div>
        </div>

        <div class="col-12 col-lg-9">
          <div class="listings-toolbar d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <div>
              <h2 class="listings-count mb-1">Showing {{ filteredProperties.length | number }} Listings</h2>
            </div>

            <div class="d-flex flex-wrap align-items-center gap-2 gap-md-3">
              <select [(ngModel)]="sortBy" (change)="applyFilters()" class="toolbar-select form-select">
                <option value="newest">Sort By</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="size">Size: Large to Small</option>
              </select>
            </div>
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
                        *ngIf="property.mainImage || (property.images && property.images.length > 0)"
                        [src]="getPrimaryImage(property)"
                        [alt]="property.name || property.title"
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
                        <h3 class="property-listing-title mb-2">{{ property.name || property.title }}</h3>
                        <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                          <p class="property-subtitle text-muted mb-0">
                            {{ getPrimaryConfig(property) }} for Sale in {{ property.city || property.location }}
                          </p>
                     
                        </div>
                      </div>
                      
                      <!-- Price -->
                      <div class="property-price mb-3">
                        <h2 class="mb-0 fw-bold">₹{{ getDisplayPrice(property) | number }}</h2>
                      </div>
                      
                      <!-- Features Grid -->
                      <div class="property-features-grid row g-3 mb-3">
                        <div class="col-6 col-md-4">
                          <div class="feature-item d-flex align-items-center gap-2">
                            <span class="feature-icon">🛏️</span>
                            <span class="feature-text">{{ getPrimaryConfig(property) }} + {{ property.bathrooms }} Bath</span>
                          </div>
                        </div>
                        <div class="col-6 col-md-4">
                          <div class="feature-item d-flex align-items-center gap-2">
                            <span class="feature-icon">📐</span>
                            <span class="feature-text">{{ getDisplayArea(property) | number }} Sq.Ft</span>
                          </div>
                        </div>
                        <div class="col-6 col-md-4">
                          <div class="feature-item d-flex align-items-center gap-2">
                            <span class="feature-icon">🏢</span>
                            <span class="feature-text">{{ getDisplayStatus(property) }}</span>
                          </div>
                        </div>
                        <div class="col-6 col-md-4">
                          <div class="feature-item d-flex align-items-center gap-2">
                            <span class="feature-icon">🪑</span>
                            <span class="feature-text">{{ property.numberOfUnits || 0 }} Units</span>
                          </div>
                        </div>
                        <div class="col-6 col-md-4">
                          <div class="feature-item d-flex align-items-center gap-2">
                            <span class="feature-icon">🅿️</span>
                            <span class="feature-text">RERA: {{ property.reraDetails.reraStatus || 'N/A' }}</span>
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
                        <span class="badge bg-light text-dark border" *ngFor="let tag of getAmenityTags(property)">{{ tag }}</span>
                      </div>
                      
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="d-flex justify-content-center align-items-center gap-2 mt-4" *ngIf="!loading && !loadError && filteredProperties.length > 0">
        <button class="btn btn-outline-primary btn-sm" (click)="previousPage()" [disabled]="currentPage === 1 || loadingMore">Previous</button>

        <button
          type="button"
          class="btn btn-sm"
          *ngFor="let page of getPaginationPages()"
          [class.btn-primary]="page === currentPage"
          [class.btn-outline-primary]="page !== currentPage"
          (click)="goToPage(page)"
          [disabled]="loadingMore"
        >
          {{ page }}
        </button>

        <button class="btn btn-outline-primary btn-sm" (click)="nextPage()" [disabled]="loadingMore || (!hasMoreProperties && currentPage >= totalPages)">
          Next
        </button>
      </div>
    </div>
  `,
  styles: [`
    .property-type-chip-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .property-type-chip {
      border: 1px solid #cfcfcf;
      border-radius: 0.95rem;
      background: #fff;
      color: #5e5e5e;
      padding: 0.5rem 0.8rem;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      font-weight: 600;
      font-size: 0.9rem;
      line-height: 1;
      transition: all 0.2s ease;
    }

    .property-type-chip:hover {
      border-color: #b9b9b9;
      background: #fafafa;
    }

    .property-type-chip.active {
      border-color: #9ec8ff;
      background: #e8f3ff;
      color: #1f5fa8;
    }

    .chip-check {
      font-size: 0.85rem;
      color: #9b9b9b;
      font-weight: 700;
    }

    .property-type-chip.active .chip-check {
      color: #2c74c9;
    }

    .listings-count {
      font-size: 1.55rem;
      font-weight: 700;
      color: #2f3237;
      line-height: 1.2;
    }

    .search-suggestions {
      position: absolute;
      top: calc(100% + 0.25rem);
      left: 0;
      right: 0;
      z-index: 12;
      border: 1px solid #e0e0e0;
      border-radius: 0.5rem;
      max-height: 220px;
      overflow-y: auto;
      background: #fff;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    }

    .badge-clear-btn {
      border: 0;
      background: transparent;
      color: #6c757d;
      line-height: 1;
      font-size: 1rem;
      padding: 0;
      cursor: pointer;
    }

    .badge-clear-btn:hover {
      color: #212529;
    }

    .toolbar-select {
      min-width: 148px;
      border-radius: 0.85rem;
      border-color: #d0d3d8;
      background-color: #f4f4f4;
      color: #343a40;
      font-weight: 500;
      font-size: 0.92rem;
      padding-top: 0.52rem;
      padding-bottom: 0.52rem;
      padding-left: 0.85rem;
      padding-right: 2rem;
    }

    @media (max-width: 767.98px) {
      .toolbar-select {
        width: 100%;
      }
    }
  `]
})
export class PropertiesComponent implements OnInit {
  private readonly fallbackImage = 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1200&h=800&fit=crop&q=80';
  allProperties: Property[] = [];
  filteredProperties: Property[] = [];
  visibleProperties: Property[] = [];
  loading = false;
  loadingMore = false;
  loadError = '';
  showFilters = false;
  pageSize = 4;
  currentPage = 1;
  hasMoreProperties = false;
  nextCursor: QueryDocumentSnapshot<DocumentData> | null = null;

  searchQuery = '';
  selectedSearchLocation = '';
  locationSuggestions: string[] = [];
  showLocationSuggestions = false;
  priceFloor = 0;
  priceCeiling = 1000000;
  minPrice = 0;
  maxPrice = 1000000;
  selectedBedrooms: number | null = null;
  selectedBathrooms: number | null = null;
  minArea = 0;
  sortBy = 'newest';
  selectedCategory: 'residential' | 'commercial' = 'residential';
  selectedPropertyTypes: string[] = [];
  selectedResale = false;
  selectedReadyToMove = false;
  selectedUnderConstruction = false;

  propertyTypeOptions: Array<{ key: string; label: string; category: 'residential' | 'commercial' }> = [
    { key: 'apartment', label: 'Apartment', category: 'residential' },
    { key: 'villa', label: 'Villa', category: 'residential' },
    { key: 'house', label: 'House', category: 'residential' },
    { key: 'plot', label: 'Plot', category: 'commercial' },
    { key: 'office', label: 'Office', category: 'commercial' },
    { key: 'shop', label: 'Shop', category: 'commercial' },
  ];

  constructor(private propertyService: PropertyService, private router: Router) {}

  ngOnInit() {
    this.loadProperties();
  }

  private getServerFilters() {
    return {
      category: this.selectedCategory,
      resale: this.selectedResale,
      readyToMove: this.selectedReadyToMove,
      underConstruction: this.selectedUnderConstruction,
    };
  }

  loadProperties() {
    this.loading = true;
    this.loadError = '';
    this.nextCursor = null;
    this.hasMoreProperties = false;

    this.propertyService.getPropertiesPage(this.pageSize, null, this.getServerFilters()).subscribe({
      next: (page) => {
        const normalized = (page.items || []).map((property) => this.normalizeProperty(property));
        this.updatePriceBounds(normalized);
        this.allProperties = normalized;
        this.hasMoreProperties = page.hasMore;
        this.nextCursor = page.nextCursor;
        this.currentPage = 1;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('PropertiesComponent - Error loading properties:', error);
        this.allProperties = [];
        this.filteredProperties = [];
        this.visibleProperties = [];
        this.hasMoreProperties = false;
        this.nextCursor = null;
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

    if (this.selectedSearchLocation && this.selectedSearchLocation.trim()) {
      const locationQuery = this.selectedSearchLocation.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          (p.city && p.city.toLowerCase().includes(locationQuery)) ||
          (p.location && p.location.toLowerCase().includes(locationQuery))
      );
    }

    // Search filter
    if (!this.selectedSearchLocation && this.searchQuery && this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(query)) ||
          (p.name && p.name.toLowerCase().includes(query)) ||
          (p.city && p.city.toLowerCase().includes(query)) ||
          (p.location && p.location.toLowerCase().includes(query)) ||
          (p.description && p.description.toLowerCase().includes(query))
      );
    }

    // Price filter
    filtered = filtered.filter(
        (p) => this.getDisplayPrice(p) >= this.minPrice && this.getDisplayPrice(p) <= this.maxPrice
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
    filtered = filtered.filter((p) => this.getDisplayArea(p) >= this.minArea);

    // Category filter (single-select)
    if (this.selectedCategory) {
      filtered = filtered.filter((p) => {
        const directCategory = (p.category || '').toLowerCase();
        if (directCategory === this.selectedCategory) {
          return true;
        }

        const titleLower = (p.name || p.title || '').toLowerCase();
        const descLower = p.description.toLowerCase();
        const isResidential =
          this.containsWholeWord(titleLower, 'apartment') ||
          this.containsWholeWord(titleLower, 'house') ||
          this.containsWholeWord(titleLower, 'villa') ||
          this.containsWholeWord(titleLower, 'condo') ||
          this.containsWholeWord(titleLower, 'residential') ||
          this.containsWholeWord(descLower, 'apartment') ||
          this.containsWholeWord(descLower, 'house') ||
          this.containsWholeWord(descLower, 'villa') ||
          this.containsWholeWord(descLower, 'condo') ||
          this.containsWholeWord(descLower, 'residential');

        const isCommercial =
          this.containsWholeWord(titleLower, 'commercial') ||
          this.containsWholeWord(titleLower, 'office') ||
          this.containsWholeWord(titleLower, 'shop') ||
          this.containsWholeWord(titleLower, 'mall') ||
          this.containsWholeWord(titleLower, 'plot') ||
          this.containsWholeWord(descLower, 'commercial') ||
          this.containsWholeWord(descLower, 'office') ||
          this.containsWholeWord(descLower, 'shop') ||
          this.containsWholeWord(descLower, 'mall') ||
          this.containsWholeWord(descLower, 'plot');

        return this.selectedCategory === 'residential' ? isResidential : isCommercial;
      });
    }

    // Property type filter
    if (this.selectedPropertyTypes.length > 0) {
      filtered = filtered.filter((p) => {
        const typeFlags = p.propertyType || {};
        const titleLower = (p.name || p.title || '').toLowerCase();
        const descLower = (p.description || '').toLowerCase();

        return this.selectedPropertyTypes.some((typeKey) => {
          if ((typeFlags as any)[typeKey]) {
            return true;
          }

          return titleLower.includes(typeKey) || descLower.includes(typeKey);
        });
      });
    }

    // Possession status filter
    if (this.selectedResale || this.selectedReadyToMove || this.selectedUnderConstruction) {
      filtered = filtered.filter((p) => {
        const lower = this.getDisplayStatus(p).toLowerCase();
        const isResale =
          !!p.status?.resale ||
          lower.includes('resale') ||
          lower.includes('re-sale');
        const isReadyToMove =
          !!p.status?.readyToMove ||
          lower.includes('ready') ||
          lower.includes('ready to move') ||
          lower.includes('ready-to-move');
        const isUnder =
          !!p.status?.underConstruction ||
          lower.includes('under') ||
          lower.includes('construction') ||
          lower.includes('under construction');

        if (this.selectedResale && isResale) return true;
        if (this.selectedReadyToMove && isReadyToMove) return true;
        if (this.selectedUnderConstruction && isUnder) return true;
        return false;
      });
    }

    // Sort
    switch (this.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => this.getDisplayPrice(a) - this.getDisplayPrice(b));
        break;
      case 'price-high':
        filtered.sort((a, b) => this.getDisplayPrice(b) - this.getDisplayPrice(a));
        break;
      case 'size':
        filtered.sort((a, b) => this.getDisplayArea(b) - this.getDisplayArea(a));
        break;
      default:
        // Keep original order (newest first)
        break;
    }

    this.filteredProperties = filtered;
    this.currentPage = 1;
    this.updateVisibleProperties();
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedSearchLocation = '';
    this.locationSuggestions = [];
    this.showLocationSuggestions = false;
    this.minPrice = 0;
    this.maxPrice = this.priceCeiling;
    this.selectedBedrooms = null;
    this.selectedBathrooms = null;
    this.minArea = 0;
    this.sortBy = 'newest';
    this.selectedCategory = 'residential';
    this.selectedPropertyTypes = [];
    this.selectedResale = false;
    this.selectedReadyToMove = false;
    this.selectedUnderConstruction = false;
    this.loadProperties();
  }

  updateVisibleProperties() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.visibleProperties = this.filteredProperties.slice(start, end);
  }

  private fetchMoreProperties(onDone?: () => void) {
    if (!this.nextCursor || this.loadingMore) {
      if (onDone) {
        onDone();
      }
      return;
    }

    this.loadingMore = true;
    this.propertyService.getPropertiesPage(this.pageSize, this.nextCursor, this.getServerFilters()).subscribe({
      next: (page) => {
        const additional = (page.items || []).map((property) => this.normalizeProperty(property));
        this.allProperties = [...this.allProperties, ...additional];
        this.hasMoreProperties = page.hasMore;
        this.nextCursor = page.nextCursor;
        this.updatePriceBounds(this.allProperties);
        const existingPage = this.currentPage;
        this.applyFilters();
        this.currentPage = existingPage;
        this.updateVisibleProperties();
        this.loadingMore = false;
        if (onDone) {
          onDone();
        }
      },
      error: (error) => {
        console.error('PropertiesComponent - Error loading more properties:', error);
        this.loadingMore = false;
        if (onDone) {
          onDone();
        }
      },
    });
  }

  goToPage(page: number) {
    if (page < 1 || this.loadingMore) {
      return;
    }

    if (this.hasLocalDataForPage(page)) {
      this.currentPage = page;
      this.updateVisibleProperties();
      return;
    }

    if (this.hasMoreProperties) {
      this.fetchMoreProperties(() => this.goToPage(page));
      return;
    }

    if (this.totalPages > 0) {
      this.currentPage = Math.min(page, this.totalPages);
      this.updateVisibleProperties();
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  get totalPages(): number {
    const localPages = Math.max(1, Math.ceil(this.filteredProperties.length / this.pageSize));
    return this.hasMoreProperties ? localPages + 1 : localPages;
  }

  getPaginationPages(): number[] {
    const pages: number[] = [];
    const maxButtons = 5;
    const total = this.totalPages;
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(total, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let value = start; value <= end; value++) {
      pages.push(value);
    }

    return pages;
  }

  private hasLocalDataForPage(page: number): boolean {
    const start = (page - 1) * this.pageSize;
    return start < this.filteredProperties.length;
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  onSearchInput() {
    if (this.selectedSearchLocation && this.searchQuery.trim().toLowerCase() !== this.selectedSearchLocation.toLowerCase()) {
      this.selectedSearchLocation = '';
    }

    this.updateLocationSuggestions();
    this.applyFilters();
  }

  onSearchFocus() {
    this.updateLocationSuggestions();
  }

  onSearchBlur() {
    setTimeout(() => {
      this.showLocationSuggestions = false;
    }, 120);
  }

  selectLocationSuggestion(suggestion: string) {
    this.selectedSearchLocation = suggestion;
    this.searchQuery = suggestion;
    this.locationSuggestions = [];
    this.showLocationSuggestions = false;
    this.applyFilters();
  }

  clearSelectedLocation(event?: Event) {
    event?.stopPropagation();
    this.selectedSearchLocation = '';
    this.searchQuery = '';
    this.locationSuggestions = [];
    this.showLocationSuggestions = false;
    this.applyFilters();
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

  onCategoryChange() {
    const allowed = new Set(this.getAvailablePropertyTypes().map((type) => type.key));
    this.selectedPropertyTypes = this.selectedPropertyTypes.filter((typeKey) => allowed.has(typeKey));
    this.loadProperties();
  }

  onPossessionFilterChange() {
    this.loadProperties();
  }

  getAvailablePropertyTypes(): Array<{ key: string; label: string; category: 'residential' | 'commercial' }> {
    if (!this.selectedCategory) {
      return this.propertyTypeOptions;
    }

    return this.propertyTypeOptions.filter((type) => type.category === this.selectedCategory);
  }

  isPropertyTypeSelected(typeKey: string): boolean {
    return this.selectedPropertyTypes.includes(typeKey);
  }

  togglePropertyType(typeKey: string) {
    if (this.selectedPropertyTypes.includes(typeKey)) {
      this.selectedPropertyTypes = this.selectedPropertyTypes.filter((item) => item !== typeKey);
    } else {
      this.selectedPropertyTypes = [...this.selectedPropertyTypes, typeKey];
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
    return property.id || `${property.name || property.title}-${index}`;
  }

  contactAgent(property: Property) {
    if (property.email) {
      window.location.href = `mailto:${property.email}`;
      return;
    }

    this.openPropertyDetails(property.id);
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

    if (property.status.resale) {
      return 'Resale';
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

  getPrimaryBedroomCount(property: Property): number {
    if (property.unitConfig['5bhk']) return 5;
    if (property.unitConfig['4bhk']) return 4;
    if (property.unitConfig['3bhk']) return 3;
    if (property.unitConfig['2bhk']) return 2;
    if (property.unitConfig['1bhk']) return 1;
    return Number(property.bedrooms || 0);
  }

  getPrimaryConfig(property: Property): string {
    const bedroomCount = this.getPrimaryBedroomCount(property);
    return bedroomCount > 0 ? `${bedroomCount} BHK` : 'Config N/A';
  }

  getAmenityTags(property: Property): string[] {
    return (property.amenities || []).slice(0, 4);
  }

  getPrimaryImage(property: Property): string {
    if (property.mainImage && property.mainImage.trim().length > 0) {
      return property.mainImage;
    }

    if (property.images && property.images.length > 0) {
      return property.images[0];
    }

    return this.fallbackImage;
  }

  private containsWholeWord(text: string, word: string): boolean {
    return new RegExp(`\\b${word}\\b`, 'i').test(text || '');
  }

  private updateLocationSuggestions() {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query || !!this.selectedSearchLocation) {
      this.locationSuggestions = [];
      this.showLocationSuggestions = false;
      return;
    }

    const locationPool = this.allProperties.flatMap((property) => [property.city, property.location])
      .map((value) => (value || '').trim())
      .filter((value) => value.length > 0);

    const uniqueLocations = Array.from(new Set(locationPool));
    this.locationSuggestions = uniqueLocations
      .filter((value) => value.toLowerCase().includes(query))
      .sort((a, b) => a.localeCompare(b))
      .slice(0, 8);

    this.showLocationSuggestions = this.locationSuggestions.length > 0;
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

  private updatePriceBounds(properties: Property[]) {
    const prices = properties
      .map((property) => this.getDisplayPrice(property))
      .filter((price) => price > 0);

    const maxSeen = prices.length > 0 ? Math.max(...prices) : 1000000;
    const roundedCeiling = Math.ceil(maxSeen / 100000) * 100000;

    this.priceFloor = 0;
    this.priceCeiling = Math.max(roundedCeiling, 1000000);
    this.minPrice = this.priceFloor;
    this.maxPrice = this.priceCeiling;
  }
}
