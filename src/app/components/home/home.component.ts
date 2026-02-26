import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('hotProjectsTrack') hotProjectsTrack?: ElementRef<HTMLDivElement>;

  featuredProperties: Property[] = [];
  allProperties: Property[] = [];
  loadingFeatured = false;
  activeListingsCount = 0;
  searchQuery = '';
  selectedSearchLocation = '';
  searchSuggestions: string[] = [];
  showSearchSuggestions = false;
  searchCategories = ['Residential', 'Commercial'];
  activeSearchCategory = 'Residential';
  supportedCities = ['Pune', 'Mumbai'];
  selectedCity = 'Pune';
  cityDropdownOpen = false;
  activeHotProjectsRegion = 'All';

  cityDivisions: Record<'Pune' | 'Mumbai', string[]> = {
    Pune: ['Pune east', 'Pune west', 'Pune north', 'Pune south', 'PCMC'],
    Mumbai: ['Mumbai western', 'Thane', 'Mumbai central', 'Vashi', 'Mira Bhayandar', 'Panvel', 'Bhewandi', 'Dombivli'],
  };

  cityHeroImages: Record<string, string> = {
    Pune: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1920&h=1080&fit=crop&q=85',
    Mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1920&h=1080&fit=crop&q=85',
  };

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
        this.activeListingsCount = properties.length;
        this.allProperties = [...properties];
        this.featuredProperties = properties
          .sort(() => Math.random() - 0.5)
          .slice(0, 6);
        this.loadingFeatured = false;
      },
      error: (error) => {
        console.error('HomeComponent - Error loading featured properties:', error);
        this.activeListingsCount = 0;
        this.featuredProperties = [];
        this.loadingFeatured = false;
      },
    });
  }

  get currentHotProjectsCity(): 'Pune' | 'Mumbai' {
    return this.selectedCity === 'Mumbai' ? 'Mumbai' : 'Pune';
  }

  get selectedCityDisplay(): string {
    const normalizedCity = (this.selectedCity || '').trim();

    if (!normalizedCity) {
      return this.supportedCities[0] || 'City';
    }

    const supportedMatch = this.supportedCities.find(
      (city) => city.toLowerCase() === normalizedCity.toLowerCase(),
    );

    return supportedMatch || normalizedCity;
  }

  get heroBackgroundStyle(): string {
    const image = this.cityHeroImages[this.selectedCity] || this.cityHeroImages['Pune'];
    return `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.7)), url('${image}')`;
  }

  get currentHotProjectsDescription(): string {
    if (this.currentHotProjectsCity === 'Mumbai') {
      return 'Want to see what’s hot in the market? These hot selling projects in Mumbai are getting snapped up fast. Great locations, trusted builders, and real value make them a worthwhile consideration.';
    }

    return 'Investigating the most in-demand homes? Explore these hot-selling projects in Pune featuring modern architecture, lifestyle-rich amenities, and exclusive locations across the city. These homes are designed to meet both personal comfort and investment potential.';
  }

  get currentCityRegions(): string[] {
    return ['All', ...this.cityDivisions[this.currentHotProjectsCity]];
  }

  get filteredHotProjects(): Property[] {
    const city = this.currentHotProjectsCity.toLowerCase();
    const selectedCategory = this.activeSearchCategory.toLowerCase();
    let projects = this.allProperties.filter((property) =>
      (property.city || '').toLowerCase() === city
      && (property.category || '').toLowerCase() === selectedCategory
    );

    if (this.activeHotProjectsRegion !== 'All') {
      projects = projects.filter(
        (property) => (property.cityDivision || '').toLowerCase() === this.activeHotProjectsRegion.toLowerCase()
      );
    }

    return [...projects]
      .sort((left, right) => {
        const rightStamp = this.getSortTimestamp(right);
        const leftStamp = this.getSortTimestamp(left);
        if (rightStamp !== leftStamp) {
          return rightStamp - leftStamp;
        }
        const rightPrice = Number(right.priceDetails?.totalPrice || right.price || 0);
        const leftPrice = Number(left.priceDetails?.totalPrice || left.price || 0);
        return rightPrice - leftPrice;
      })
      .slice(0, 3);
  }

  getHotProjectImage(property: Property): string {
    if (property.mainImage && property.mainImage.trim().length > 0) {
      return property.mainImage;
    }

    if (property.images && property.images.length > 0) {
      return property.images[0];
    }

    return 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1200&h=800&fit=crop&q=80';
  }

  onCityChange() {
    this.cityDropdownOpen = false;
    this.activeHotProjectsRegion = 'All';
    this.selectedSearchLocation = '';
    this.searchQuery = '';
    this.searchSuggestions = [];
    this.showSearchSuggestions = false;
    const track = this.hotProjectsTrack?.nativeElement;
    if (track) {
      track.scrollLeft = 0;
    }
  }

  toggleCityDropdown() {
    this.cityDropdownOpen = !this.cityDropdownOpen;
  }

  selectCity(city: string) {
    const normalizedCity = (city || '').trim();

    if (!normalizedCity) {
      return;
    }

    const supportedMatch = this.supportedCities.find(
      (supportedCity) => supportedCity.toLowerCase() === normalizedCity.toLowerCase(),
    );

    const resolvedCity = supportedMatch || normalizedCity;

    if (resolvedCity !== this.selectedCity) {
      this.selectedCity = resolvedCity;
    }

    this.onCityChange();
  }

  @HostListener('document:click')
  closeCityDropdown() {
    this.cityDropdownOpen = false;
  }

  onSearchInput() {
    if (
      this.selectedSearchLocation &&
      this.searchQuery.trim().toLowerCase() !== this.selectedSearchLocation.toLowerCase()
    ) {
      this.selectedSearchLocation = '';
    }

    this.updateSearchSuggestions();
  }

  onSearchFocus() {
    this.updateSearchSuggestions();
  }

  onSearchBlur() {
    setTimeout(() => {
      this.showSearchSuggestions = false;
    }, 120);
  }

  selectSearchSuggestion(suggestion: string) {
    this.selectedSearchLocation = suggestion;
    this.searchQuery = suggestion;
    this.searchSuggestions = [];
    this.showSearchSuggestions = false;
  }

  setHotProjectsRegion(region: string) {
    this.activeHotProjectsRegion = region;
    const track = this.hotProjectsTrack?.nativeElement;
    if (track) {
      track.scrollLeft = 0;
    }
  }

  scrollHotProjects() {
    const track = this.hotProjectsTrack?.nativeElement;
    if (track) {
      track.scrollBy({ left: 360, behavior: 'smooth' });
    }
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
    const query = this.searchQuery.trim();
    const normalizedQuery = query.toLowerCase();
    const matchedDivision = (this.cityDivisions[this.currentHotProjectsCity] || []).find(
      (division) => division.toLowerCase() === normalizedQuery,
    );

    const queryParams: { q?: string; city?: string; mode?: string; location?: string; cityDivision?: string } = {
      city: this.selectedCity,
      mode: this.activeSearchCategory,
    };

    if (query) {
      queryParams.q = query;
      queryParams.location = this.selectedSearchLocation || query;
    }

    if (matchedDivision) {
      queryParams.cityDivision = matchedDivision;
    } else if (this.selectedSearchLocation) {
      const selectedDivision = (this.cityDivisions[this.currentHotProjectsCity] || []).find(
        (division) => division.toLowerCase() === this.selectedSearchLocation.toLowerCase(),
      );

      if (selectedDivision) {
        queryParams.cityDivision = selectedDivision;
      }
    }

    this.router.navigate(['/properties'], { queryParams });
  }

  private updateSearchSuggestions() {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query || !!this.selectedSearchLocation) {
      this.searchSuggestions = [];
      this.showSearchSuggestions = false;
      return;
    }

    const city = this.selectedCity.toLowerCase();
    const locationPool = this.allProperties
      .filter((property) => (property.city || '').toLowerCase() === city)
      .flatMap((property) => [property.location, property.cityDivision])
      .map((value) => (value || '').trim())
      .filter((value) => value.length > 0);

    const fallbackPool = [
      this.selectedCity,
      ...(this.cityDivisions[this.currentHotProjectsCity] || []),
    ];

    const uniqueLocations = Array.from(new Set([...locationPool, ...fallbackPool]));
    this.searchSuggestions = uniqueLocations
      .filter((value) => value.toLowerCase().includes(query))
      .sort((a, b) => a.localeCompare(b))
      .slice(0, 8);

    this.showSearchSuggestions = this.searchSuggestions.length > 0;
  }

  viewProperty(id: string | undefined) {
    if (id) {
      this.router.navigate(['/property', id]);
    }
  }
}
