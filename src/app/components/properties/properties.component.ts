import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="properties-wrapper">
      <div class="sidebar-filters">
        <h3>Filter Properties</h3>
        
        <!-- Search Bar -->
        <div class="filter-section">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by title, location..."
            [(ngModel)]="searchQuery"
            (keyup)="applyFilters()"
            class="search-input"
          />
        </div>

        <!-- Price Range -->
        <div class="filter-section">
          <label>Price Range</label>
          <div class="price-inputs">
            <div class="input-group">
              <label class="small-label">Min Price</label>
              <input
                type="number"
                [(ngModel)]="minPrice"
                (change)="applyFilters()"
                class="number-input"
                placeholder="Min"
              />
            </div>
            <div class="input-group">
              <label class="small-label">Max Price</label>
              <input
                type="number"
                [(ngModel)]="maxPrice"
                (change)="applyFilters()"
                class="number-input"
                placeholder="Max"
              />
            </div>
          </div>
          <div class="price-display">\${{ minPrice | number }} - \${{ maxPrice | number }}</div>
        </div>

        <!-- Bedrooms -->
        <div class="filter-section">
          <label>Bedrooms</label>
          <select [(ngModel)]="selectedBedrooms" (change)="applyFilters()" class="select-input">
            <option [ngValue]="null">All</option>
            <option [ngValue]="1">1</option>
            <option [ngValue]="2">2</option>
            <option [ngValue]="3">3</option>
            <option [ngValue]="4">4</option>
            <option [ngValue]="5">5+</option>
          </select>
        </div>

        <!-- Bathrooms -->
        <div class="filter-section">
          <label>Bathrooms</label>
          <select [(ngModel)]="selectedBathrooms" (change)="applyFilters()" class="select-input">
            <option [ngValue]="null">All</option>
            <option [ngValue]="1">1</option>
            <option [ngValue]="2">2</option>
            <option [ngValue]="3">3</option>
            <option [ngValue]="4">4+</option>
          </select>
        </div>

        <!-- Property Category -->
        <div class="filter-section">
          <label>Category</label>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="selectedResidential" (change)="applyFilters()" />
              Residential
            </label>
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="selectedCommercial" (change)="applyFilters()" />
              Commercial
            </label>
          </div>
        </div>

        <!-- Property Type -->
        <div class="filter-section">
          <label>Property Type</label>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" (change)="applyFilters()" />
              Apartment
            </label>
            <label class="checkbox-label">
              <input type="checkbox" (change)="applyFilters()" />
              House
            </label>
            <label class="checkbox-label">
              <input type="checkbox" (change)="applyFilters()" />
              Villa
            </label>
            <label class="checkbox-label">
              <input type="checkbox" (change)="applyFilters()" />
              Condo
            </label>
          </div>
        </div>

        <!-- Area/Size -->
        <div class="filter-section">
          <label>Minimum Area (sqft)</label>
          <input
            type="number"
            [(ngModel)]="minArea"
            (change)="applyFilters()"
            class="number-input"
            placeholder="Min sqft"
          />
        </div>

        <!-- Sort Options -->
        <div class="filter-section">
          <label>Sort By</label>
          <select [(ngModel)]="sortBy" (change)="applyFilters()" class="select-input">
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="size">Size: Large to Small</option>
          </select>
        </div>

        <!-- Reset Filters -->
        <button (click)="resetFilters()" class="btn-reset">Reset All Filters</button>
      </div>

      <div class="main-content">
        <div class="results-header">
          <h2>Properties</h2>
          <span class="results-count">{{ filteredProperties.length }} properties found</span>
        </div>

        <div *ngIf="loading" class="loading">Loading properties...</div>

        <div *ngIf="!loading && filteredProperties.length === 0" class="no-results">
          <p>No properties match your filters.</p>
          <button (click)="resetFilters()" class="btn-reset">Clear Filters</button>
        </div>

        <div class="properties-grid">
          <div *ngFor="let property of filteredProperties" class="property-card">
            <div class="property-image">
              <img
                *ngIf="property.images && property.images.length > 0"
                [src]="property.images[0]"
                [alt]="property.title"
              />
              <div *ngIf="!property.images || property.images.length === 0" class="no-image">
                No Image Available
              </div>
              <div class="price-badge">\${{ property.price | number }}</div>
            </div>
            <div class="property-details">
              <h3>{{ property.title }}</h3>
              <p class="location">📍 {{ property.location }}</p>
              <div class="specs">
                <span class="spec">🛏️ {{ property.bedrooms }} beds</span>
                <span class="spec">🚿 {{ property.bathrooms }} baths</span>
                <span class="spec">📐 {{ property.area | number }} sqft</span>
              </div>
              <p class="description">{{ property.description | slice: 0: 100 }}...</p>
              <a [routerLink]="['/property', property.id]" class="btn btn-view">View Details</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .properties-wrapper {
      display: flex;
      gap: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      min-height: 100vh;
    }

    /* SIDEBAR FILTERS */
    .sidebar-filters {
      flex: 0 0 280px;
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      height: fit-content;
      position: sticky;
      top: 2rem;
    }

    .sidebar-filters h3 {
      margin-top: 0;
      margin-bottom: 1.5rem;
      color: #333;
      font-size: 1.2rem;
      border-bottom: 2px solid #667eea;
      padding-bottom: 0.75rem;
    }

    .filter-section {
      margin-bottom: 1.5rem;
    }

    .filter-section label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #333;
      font-size: 0.9rem;
    }

    .filter-section > label.small-label {
      font-size: 0.85rem;
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .search-input,
    .number-input,
    .select-input {
      width: 100%;
      padding: 0.65rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.9rem;
      transition: border-color 0.3s;
    }

    .search-input:focus,
    .number-input:focus,
    .select-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
    }

    .price-inputs {
      display: flex;
      gap: 0.75rem;
    }

    .input-group {
      flex: 1;
    }

    .input-group input {
      width: 100%;
    }

    .price-display {
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: #667eea;
      font-weight: 600;
    }

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      font-weight: 400;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .checkbox-label input {
      margin-right: 0.5rem;
      cursor: pointer;
    }

    .btn-reset {
      width: 100%;
      padding: 0.75rem;
      background: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 1rem;
    }

    .btn-reset:hover {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    /* MAIN CONTENT */
    .main-content {
      flex: 1;
      min-width: 0;
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #eee;
    }

    .results-header h2 {
      margin: 0;
      color: #333;
    }

    .results-count {
      color: #666;
      font-size: 0.95rem;
    }

    .loading,
    .no-results {
      text-align: center;
      padding: 3rem 2rem;
      background: white;
      border-radius: 8px;
      color: #666;
    }

    .no-results p {
      margin: 0 0 1rem 0;
    }

    /* PROPERTIES GRID */
    .properties-grid {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .property-card {
      display: flex;
      gap: 1.5rem;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;
    }

    .property-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .property-image {
      position: relative;
      width: 350px;
      height: 250px;
      overflow: hidden;
      background: #f0f0f0;
      flex-shrink: 0;
    }

    .property-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .property-card:hover .property-image img {
      transform: scale(1.08);
    }

    .no-image {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #999;
      font-size: 0.9rem;
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
      font-size: 1rem;
    }

    .property-details {
      padding: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .property-details h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.1rem;
    }

    .location {
      color: #666;
      margin: 0.5rem 0;
      font-size: 0.9rem;
    }

    .specs {
      display: flex;
      gap: 0.75rem;
      margin: 1rem 0;
      flex-wrap: wrap;
    }

    .spec {
      color: #666;
      font-size: 0.85rem;
      background: #f5f5f5;
      padding: 0.35rem 0.75rem;
      border-radius: 4px;
    }

    .description {
      color: #666;
      font-size: 0.85rem;
      margin: 1rem 0;
      line-height: 1.4;
    }

    .btn-view {
      display: block;
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      text-decoration: none;
      text-align: center;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: auto;
    }

    .btn-view:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      .properties-wrapper {
        flex-direction: column;
      }

      .sidebar-filters {
        flex: 1;
        position: static;
      }

      .property-card {
        flex-direction: column;
      }

      .property-image {
        width: 100%;
        height: 220px;
      }
    }

    @media (max-width: 768px) {
      .properties-wrapper {
        padding: 1rem;
        gap: 1rem;
      }

      .sidebar-filters {
        padding: 1rem;
      }

      .property-card {
        flex-direction: column;
      }

      .property-image {
        width: 100%;
        height: 200px;
      }

      .results-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
  `]
})
export class PropertiesComponent implements OnInit {
  allProperties: Property[] = [];
  filteredProperties: Property[] = [];
  loading = true;

  searchQuery = '';
  minPrice = 0;
  maxPrice = 1000000;
  selectedBedrooms: number | null = null;
  selectedBathrooms: number | null = null;
  minArea = 0;
  sortBy = 'newest';
  selectedResidential = false;
  selectedCommercial = false;

  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    this.loading = true;
    this.propertyService.getProperties().subscribe({
      next: (data) => {
        this.allProperties = data;
        this.filteredProperties = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.loading = false;
      },
    });
  }

  applyFilters() {
    let filtered = [...this.allProperties];

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
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
  }

  resetFilters() {
    this.searchQuery = '';
    this.minPrice = 0;
    this.maxPrice = 1000000;
    this.selectedBedrooms = null;
    this.selectedBathrooms = null;
    this.minArea = 0;
    this.sortBy = 'newest';
    this.selectedResidential = false;
    this.selectedCommercial = false;
    this.filteredProperties = [...this.allProperties];
  }
}
