import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
export class PropertiesComponent implements OnInit, OnDestroy {
  private readonly fallbackImage = 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1200&h=800&fit=crop&q=80';
  private readonly enableServerPagination = true;
  allProperties: Property[] = [];
  filteredProperties: Property[] = [];
  visibleProperties: Property[] = [];
  loading = false;
  loadingMore = false;
  loadingAllForFilters = false;
  loadError = '';
  showFilters = false;
  pageSize = 8;
  currentPage = 1;
  hasMoreProperties = false;
  nextCursor: QueryDocumentSnapshot<DocumentData> | null = null;
  serverModeActive = false;
  fullDatasetLoaded = false;

  searchQuery = '';
  selectedSearchLocations: string[] = [];
  selectedCityFilter = '';
  selectedCityDivisionFilter = '';
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
  selectedListingIntent: 'buy' | 'rent' = 'buy';
  selectedPropertyTypes: string[] = [];
  selectedResale = false;
  selectedReadyToMove = false;
  selectedUnderConstruction = false;
  private searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  propertyTypeOptions: Array<{ key: string; label: string; category: 'residential' | 'commercial' }> = [
    { key: 'apartment', label: 'Apartment', category: 'residential' },
    { key: 'villa', label: 'Villa', category: 'residential' },
    { key: 'house', label: 'House', category: 'residential' },
    { key: 'plot', label: 'Plot', category: 'commercial' },
    { key: 'office', label: 'Office', category: 'commercial' },
    { key: 'shop', label: 'Shop', category: 'commercial' },
  ];

  constructor(
    private propertyService: PropertyService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const mode = (params['mode'] || '').toString().toLowerCase();
      const city = (params['city'] || '').toString().trim();
      const query = (params['q'] || '').toString().trim();
      const location = (params['location'] || '').toString().trim();
      const cityDivision = (params['cityDivision'] || '').toString().trim();

      if (mode === 'residential' || mode === 'commercial') {
        this.selectedCategory = mode;
      }

      if (city) {
        this.selectedSearchLocations = location ? [location] : [];
        this.selectedCityFilter = city;
      } else {
        this.selectedSearchLocations = location ? [location] : [];
        this.selectedCityFilter = '';
      }

      this.selectedCityDivisionFilter = cityDivision;

      this.searchQuery = query || location || '';

      if (this.allProperties.length > 0) {
        this.applyFilters();
      }
    });

    this.loadProperties();
  }

  ngOnDestroy() {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = null;
    }
  }

  loadProperties() {
    this.loading = true;
    this.loadError = '';
    this.hasMoreProperties = false;
    this.nextCursor = null;

    if (this.enableServerPagination) {
      this.propertyService.getPropertiesPage(this.pageSize, null).subscribe({
        next: (pageResult) => {
          const normalized = (pageResult.items || [])
            .map((property) => this.normalizeProperty(property))
            .sort((left, right) => this.getSortTimestamp(right) - this.getSortTimestamp(left));

          this.updatePriceBounds(normalized);
          this.allProperties = normalized;
          this.serverModeActive = true;
          this.fullDatasetLoaded = false;
          this.hasMoreProperties = pageResult.hasMore;
          this.nextCursor = pageResult.nextCursor;
          this.currentPage = 1;
          this.applyFilters();
          this.loading = false;

          this.propertyService.getProperties().subscribe({
            next: (allItems) => {
              const fullNormalized = (allItems || [])
                .map((property) => this.normalizeProperty(property))
                .sort((left, right) => this.getSortTimestamp(right) - this.getSortTimestamp(left));

              this.allProperties = fullNormalized;
              this.updatePriceBounds(fullNormalized);
              this.fullDatasetLoaded = true;

              if (!this.hasActiveFilters()) {
                this.serverModeActive = false;
                this.hasMoreProperties = false;
                this.nextCursor = null;
                this.applyFilters();
              }
            },
            error: () => {
              // Ignore warm-cache errors; server-paged data is already usable.
            },
          });
        },
        error: (error) => {
          console.error('PropertiesComponent - Error loading paged properties:', error);
          this.serverModeActive = false;
          this.fullDatasetLoaded = false;
          this.loadAllProperties();
        },
      });
      return;
    }

    this.loadAllProperties();
  }

  private loadAllProperties() {
    this.propertyService.getProperties().subscribe({
      next: (items) => {
        const normalized = (items || [])
          .map((property) => this.normalizeProperty(property))
          .sort((left, right) => this.getSortTimestamp(right) - this.getSortTimestamp(left));
        this.updatePriceBounds(normalized);
        this.allProperties = normalized;
        this.fullDatasetLoaded = true;
        this.serverModeActive = false;
        this.hasMoreProperties = false;
        this.nextCursor = null;
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

    if (this.serverModeActive && this.hasActiveFilters() && !this.fullDatasetLoaded) {
      this.ensureFullDataForFilters();
      return;
    }
    
    let filtered = [...this.allProperties];

    if (this.selectedSearchLocations.length > 0) {
      const selectedQueries = this.selectedSearchLocations
        .map((value) => value.toLowerCase().trim())
        .filter((value) => value.length > 0);

      filtered = filtered.filter((p) => {
        const city = (p.city || '').toLowerCase();
        const division = (p.cityDivision || '').toLowerCase();
        const location = (p.location || '').toLowerCase();

        return selectedQueries.some(
          (query) => city.includes(query) || division.includes(query) || location.includes(query)
        );
      });
    }

    if (this.selectedCityFilter && this.selectedCityFilter.trim()) {
      const cityQuery = this.selectedCityFilter.toLowerCase().trim();
      filtered = filtered.filter((p) => (p.city || '').toLowerCase() === cityQuery);
    }

    if (this.selectedCityDivisionFilter && this.selectedCityDivisionFilter.trim()) {
      const divisionQuery = this.selectedCityDivisionFilter.toLowerCase().trim();
      filtered = filtered.filter((p) => (p.cityDivision || '').toLowerCase() === divisionQuery);
    }

    // Search filter
    if (this.selectedSearchLocations.length === 0 && this.searchQuery && this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          (p.city && p.city.toLowerCase().includes(query)) ||
          (p.cityDivision && p.cityDivision.toLowerCase().includes(query)) ||
          (p.location && p.location.toLowerCase().includes(query))
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
        const descLower = (p.description || '').toLowerCase();
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

    if (this.selectedListingIntent) {
      const intent = this.selectedListingIntent === 'buy' ? 'sale' : this.selectedListingIntent.toLowerCase();
      filtered = filtered.filter((p) => {
        const explicitIntentValue = (p.listingIntent || '').toLowerCase().trim();
        const explicitIntent = explicitIntentValue === 'sell' ? 'sale' : explicitIntentValue;

        if (intent === 'sale') {
          if (!explicitIntent || explicitIntent === 'sale') {
            return true;
          }

          return explicitIntent !== 'rent';
        }

        if (explicitIntent === intent) {
          return true;
        }

        const titleLower = (p.name || p.title || '').toLowerCase();
        const descLower = (p.description || '').toLowerCase();
        if (intent === 'rent') {
          return (
            this.containsWholeWord(titleLower, 'rent') ||
            this.containsWholeWord(titleLower, 'rental') ||
            this.containsWholeWord(descLower, 'rent') ||
            this.containsWholeWord(descLower, 'rental')
          );
        }

        return (
          this.containsWholeWord(titleLower, 'sale') ||
          this.containsWholeWord(titleLower, 'sell') ||
          this.containsWholeWord(descLower, 'sale') ||
          this.containsWholeWord(descLower, 'sell')
        );
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
    this.selectedSearchLocations = [];
    this.selectedCityFilter = '';
    this.selectedCityDivisionFilter = '';
    this.locationSuggestions = [];
    this.showLocationSuggestions = false;
    this.minPrice = 0;
    this.maxPrice = this.priceCeiling;
    this.selectedBedrooms = null;
    this.selectedBathrooms = null;
    this.minArea = 0;
    this.sortBy = 'newest';
    this.selectedCategory = 'residential';
    this.selectedListingIntent = 'buy';
    this.selectedPropertyTypes = [];
    this.selectedResale = false;
    this.selectedReadyToMove = false;
    this.selectedUnderConstruction = false;
    this.applyFilters();
  }

  updateVisibleProperties() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.visibleProperties = this.filteredProperties.slice(start, end);
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

    if (
      this.serverModeActive &&
      page === this.currentPage + 1 &&
      this.hasMoreProperties &&
      this.nextCursor
    ) {
      this.loadNextServerPage(page);
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
    return Math.max(1, Math.ceil(this.filteredProperties.length / this.pageSize));
  }

  private hasActiveFilters(): boolean {
    return !!(
      this.selectedSearchLocations.length > 0 ||
      (this.searchQuery && this.searchQuery.trim().length > 0) ||
      (this.selectedCityFilter && this.selectedCityFilter.trim().length > 0) ||
      (this.selectedCityDivisionFilter && this.selectedCityDivisionFilter.trim().length > 0) ||
      this.minPrice > this.priceFloor ||
      this.maxPrice < this.priceCeiling ||
      this.selectedBedrooms !== null ||
      this.selectedBathrooms !== null ||
      this.minArea > 0 ||
      this.sortBy !== 'newest' ||
      this.selectedListingIntent === 'rent' ||
      this.selectedPropertyTypes.length > 0 ||
      this.selectedResale ||
      this.selectedReadyToMove ||
      this.selectedUnderConstruction
    );
  }

  private ensureFullDataForFilters() {
    if (this.loadingAllForFilters) {
      return;
    }

    this.loadingAllForFilters = true;
    this.loading = true;

    this.propertyService.getProperties().subscribe({
      next: (items) => {
        const normalized = (items || [])
          .map((property) => this.normalizeProperty(property))
          .sort((left, right) => this.getSortTimestamp(right) - this.getSortTimestamp(left));

        this.allProperties = normalized;
        this.updatePriceBounds(normalized);
        this.fullDatasetLoaded = true;
        this.serverModeActive = false;
        this.hasMoreProperties = false;
        this.nextCursor = null;
        this.loadingAllForFilters = false;
        this.loading = false;
        this.applyFilters();
      },
      error: (error) => {
        console.error('PropertiesComponent - Error loading full dataset for filters:', error);
        this.loadingAllForFilters = false;
        this.loading = false;
      },
    });
  }

  private loadNextServerPage(targetPage: number) {
    if (!this.nextCursor || this.loadingMore) {
      return;
    }

    this.loadingMore = true;

    this.propertyService.getPropertiesPage(this.pageSize, this.nextCursor).subscribe({
      next: (pageResult) => {
        const incoming = (pageResult.items || [])
          .map((property) => this.normalizeProperty(property));

        const merged = [...this.allProperties, ...incoming]
          .sort((left, right) => this.getSortTimestamp(right) - this.getSortTimestamp(left));

        this.allProperties = merged;
        this.filteredProperties = merged;
        this.hasMoreProperties = pageResult.hasMore;
        this.nextCursor = pageResult.nextCursor;
        this.currentPage = targetPage;
        this.updateVisibleProperties();
        this.loadingMore = false;
      },
      error: (error) => {
        console.error('PropertiesComponent - Error loading next server page:', error);
        this.loadingMore = false;
      },
    });
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
    this.updateLocationSuggestions();
    this.scheduleFilterApply();
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
    const exists = this.selectedSearchLocations.some(
      (value) => value.toLowerCase() === suggestion.toLowerCase()
    );

    if (!exists) {
      this.selectedSearchLocations = [...this.selectedSearchLocations, suggestion];
    }

    this.searchQuery = '';
    this.updateLocationSuggestions();
    this.applyFilters();
  }

  removeSelectedLocation(location: string, event?: Event) {
    event?.stopPropagation();
    this.selectedSearchLocations = this.selectedSearchLocations.filter(
      (value) => value.toLowerCase() !== location.toLowerCase()
    );
    this.updateLocationSuggestions();
    this.applyFilters();
  }

  onCityFilterChange() {
    this.updateLocationSuggestions();
    this.applyFilters();
  }

  getAvailableCities(): string[] {
    const uniqueCities = Array.from(
      new Set(
        this.allProperties
          .map((property) => (property.city || '').trim())
          .filter((city) => city.length > 0)
      )
    );

    return uniqueCities.sort((left, right) => left.localeCompare(right));
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
    this.applyFilters();
  }

  onListingIntentChange() {
    this.applyFilters();
  }

  onPossessionFilterChange() {
    this.applyFilters();
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
    return Number(property.priceDetails?.totalPrice || property.price || property.priceDetails?.basePrice || 0);
  }

  getDisplayArea(property: Property): number {
    return Number(property.size?.totalArea || property.area || property.size?.carpetArea || 0);
  }

  getDisplayStatus(property: Property): string {
    if (property.reraDetails?.possession) {
      return property.reraDetails.possession;
    }

    if (property.status?.resale) {
      return 'Resale';
    }

    if (property.status?.readyToMove) {
      return 'Ready to Move';
    }

    if (property.status?.underConstruction) {
      return 'Under Construction';
    }

    if (property.status?.preConstruction) {
      return 'Pre Construction';
    }

    return property.possessionStatus || 'N/A';
  }

  getListingIntentLabel(property: Property): string {
    const normalized = (property.listingIntent || '').toString().toLowerCase().trim();
    if (normalized === 'rent') {
      return 'Rent';
    }

    return 'Buy';
  }

  getPrimaryBedroomCount(property: Property): number {
    if (property.unitConfig?.['5bhk']) return 5;
    if (property.unitConfig?.['4bhk']) return 4;
    if (property.unitConfig?.['3bhk']) return 3;
    if (property.unitConfig?.['2bhk']) return 2;
    if (property.unitConfig?.['1bhk']) return 1;
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

  private scheduleFilterApply(delayMs = 140) {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    this.searchDebounceTimer = setTimeout(() => {
      this.applyFilters();
      this.searchDebounceTimer = null;
    }, delayMs);
  }

  private updateLocationSuggestions() {
    const query = this.searchQuery.toLowerCase().trim();
    const selectedCity = this.selectedCityFilter.toLowerCase().trim();

    if (!selectedCity || !query) {
      this.locationSuggestions = [];
      this.showLocationSuggestions = false;
      return;
    }

    const scopedProperties = this.allProperties.filter(
      (property) => (property.city || '').toLowerCase() === selectedCity
    );

    const locationPool = scopedProperties.flatMap((property) => [property.cityDivision, property.location])
      .map((value) => (value || '').trim())
      .filter((value) => value.length > 0);

    const uniqueLocations = Array.from(new Set(locationPool));
    this.locationSuggestions = uniqueLocations
      .filter((value) => value.toLowerCase().includes(query))
      .filter(
        (value) => !this.selectedSearchLocations.some(
          (selected) => selected.toLowerCase() === value.toLowerCase()
        )
      )
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
      description: property.description || '',
      city: property.city || '',
      cityDivision: property.cityDivision || '',
      location: property.location || '',
      listingIntent: (property.listingIntent || '').toString().toLowerCase() === 'rent'
        ? 'rent'
        : ['sale', 'sell'].includes((property.listingIntent || '').toString().toLowerCase())
          ? 'sale'
          : '',
      status: {
        underConstruction: !!property.status?.underConstruction,
        readyToMove: !!property.status?.readyToMove,
        resale: !!property.status?.resale,
        preConstruction: !!property.status?.preConstruction,
      },
      unitConfig: {
        '1bhk': !!property.unitConfig?.['1bhk'],
        '2bhk': !!property.unitConfig?.['2bhk'],
        '3bhk': !!property.unitConfig?.['3bhk'],
        '4bhk': !!property.unitConfig?.['4bhk'],
        '5bhk': !!property.unitConfig?.['5bhk'],
      },
      size: {
        carpetArea: Number(property.size?.carpetArea || 0),
        builtArea: Number(property.size?.builtArea || property.size?.totalArea || property.area || 0),
        totalArea: Number(property.size?.totalArea || property.size?.builtArea || property.area || 0),
        label: property.size?.label,
      },
      reraDetails: {
        reraNumber: property.reraDetails?.reraNumber || '',
        reraStatus: property.reraDetails?.reraStatus || '',
        possession: property.reraDetails?.possession || '',
      },
      priceDetails: {
        basePrice: Number(property.priceDetails?.basePrice || property.price || 0),
        governmentCharge: Number(property.priceDetails?.governmentCharge || 0),
        totalPrice: Number(property.priceDetails?.totalPrice || property.price || property.priceDetails?.basePrice || 0),
      },
      propertyType: {
        apartment: !!property.propertyType?.apartment,
        villa: !!property.propertyType?.villa,
        house: !!property.propertyType?.house,
        plot: !!property.propertyType?.plot,
        office: !!property.propertyType?.office,
        shop: !!property.propertyType?.shop,
      },
      amenities: Array.isArray(property.amenities) ? property.amenities : [],
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

  private getSortTimestamp(property: Property): number {
    const value = property.updatedAt || property.createdAt;

    if (!value) {
      return 0;
    }

    if (value instanceof Date) {
      return value.getTime();
    }

    if (typeof value === 'object' && value !== null && 'seconds' in value) {
      return Number((value as { seconds?: unknown }).seconds || 0) * 1000;
    }

    const parsed = new Date(value as string).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  }
}
