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
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {
  private readonly fallbackImage = 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1200&h=800&fit=crop&q=80';
  property: Property | null = null;
  relatedProperties: Property[] = [];
  selectedImage: string | null = null;
  galleryOpen = false;
  galleryImages: string[] = [];
  currentGalleryIndex = 0;
  chargesPopupOpen = false;
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

  openChargesPopup() {
    this.chargesPopupOpen = true;
  }

  closeChargesPopup() {
    this.chargesPopupOpen = false;
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
    const value = (amenity || '').toLowerCase().trim();

    if (value.includes('clubhouse')) return '🏛️';
    if (value.includes('gymnasium') || value.includes('gym') || value.includes('fitness')) return '🏋️';
    if (value.includes('swimming pool') || value.includes('pool')) return '🏊';
    if (value.includes('kids play area') || value.includes('play area') || value.includes('kids')) return '🛝';
    if (value.includes('badminton')) return '🏸';
    if (value.includes('football')) return '⚽';
    if (value.includes('cricket')) return '🏏';
    if (value.includes('basketball')) return '🏀';
    if (value.includes('volleyball')) return '🏐';
    if (value.includes('yoga')) return '🧘';
    if (value.includes('jogging')) return '🏃';
    if (value.includes('table tennis')) return '🏓';
    if (value.includes('snooker') || value.includes('billiards')) return '🎱';
    if (value.includes('cycle') || value.includes('cycling')) return '🚴';

    if (value.includes('landscaped garden') || value.includes('garden')) return '🌳';
    if (value.includes('power backup') || value.includes('power') || value.includes('backup')) return '⚡';
    if (value.includes('lift') || value.includes('elevator')) return '🛗';
    if (value.includes('treated water') || value.includes('water')) return '💧';
    if (value.includes('pet area') || value.includes('pet')) return '🐾';

    if (value.includes('library')) return '📚';
    if (value.includes('party hall')) return '🎉';
    if (value.includes('café') || value.includes('cafe')) return '☕';
    if (value.includes('indoor games')) return '🎮';
    if (value.includes('spa')) return '🧖';
    if (value.includes('senior citizen')) return '👴';

    if (value.includes('security') || value.includes('cctv')) return '🛡️';
    if (value.includes('parking')) return '🅿️';

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

  getBasePrice(property: Property): number {
    return Number(property.priceDetails.basePrice || property.price || 0);
  }

  getGovernmentCharge(property: Property): number {
    return Number(property.priceDetails.governmentCharge || 0);
  }

  getTotalPrice(property: Property): number {
    const total = Number(property.priceDetails.totalPrice || 0);
    if (total > 0) {
      return total;
    }

    return this.getBasePrice(property) + this.getGovernmentCharge(property);
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

  getProjectStatus(property: Property): string {
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

    const fallback = `${property.possessionStatus || ''} ${property.reraDetails.possession || ''}`.toLowerCase();
    if (fallback.includes('resale') || fallback.includes('re-sale')) {
      return 'Resale';
    }

    if (fallback.includes('ready')) {
      return 'Ready to Move';
    }

    if (fallback.includes('under') || fallback.includes('construction')) {
      return 'Under Construction';
    }

    if (fallback.includes('pre')) {
      return 'Pre Construction';
    }

    return 'N/A';
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
