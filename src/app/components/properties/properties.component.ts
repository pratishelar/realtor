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
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
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
