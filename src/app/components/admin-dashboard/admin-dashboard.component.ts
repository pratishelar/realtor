import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, timeout } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { PropertyService } from '../../services/property.service';
import { CloudinaryService } from '../../services/cloudinary.service';
import { Property } from '../../models/property.model';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'add' | 'list' = 'add';
  sidebarOpen = true;
  myProperties: Property[] = [];
  loadingProperties = false;
  saving = false;
  uploadingImages = false;
  uploadProgress = 0;
  selectedPreviews: string[] = [];
  editingId: string | null = null;
  selectedBulkListingIntent: 'sale' | 'rent' = 'sale';
  bulkUpdatingListingIntent = false;

  sportsAmenityOptions: string[] = [
    'Clubhouse',
    'Gymnasium',
    'Swimming Pool',
    'Kids Play Area',
    'Badminton Court',
    'Football',
    'Cricket',
    'Basketball',
    'Volleyball',
    'Yoga',
    'Jogging',
    'Table Tennis',
    'Snooker/pool',
    'Cycle',
  ];

  convenienceAmenityOptions: string[] = [
    'Landscaped Garden',
    'Power Backup',
    'Lift',
    'Treated Water',
    'Pet Area',
  ];

  leisureAmenityOptions: string[] = [
    'Library',
    'Party Hall',
    'Clubhouse',
    'Café',
    'Indoor Games',
    'Spa',
    'Senior Citizen Area',
  ];

  cityOptions: string[] = ['Pune', 'Mumbai'];
  cityDivisionOptions: Record<string, string[]> = {
    Pune: ['Pune east', 'Pune west', 'Pune north', 'Pune south', 'PCMC'],
    Mumbai: ['Mumbai western', 'Thane', 'Mumbai central', 'Vashi', 'Mira Bhayandar', 'Panvel', 'Bhewandi', 'Dombivli'],
  };

  formData: Property = this.getDefaultProperty();

  constructor(
    private authService: AuthService,
    private propertyService: PropertyService,
    private cloudinaryService: CloudinaryService,
    private router: Router
  ) {
    this.authService.getCurrentUser().subscribe((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() {
    this.loadMyProperties();
  }

  loadMyProperties() {
    this.loadingProperties = true;
    this.propertyService.getProperties().subscribe({
      next: (data) => {
        this.myProperties = data;
        this.loadingProperties = false;
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.loadingProperties = false;
      },
    });
  }

  onFileSelected(event: any) {
    const files: File[] = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }

    this.uploadingImages = true;
    this.uploadProgress = 0;
    this.selectedPreviews = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedPreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });

    this.cloudinaryService.uploadMultipleImages(files).subscribe({
      next: (results) => {
        const urls = results.map((r) => r.secure_url).filter(Boolean);
        this.formData.images = [...(this.formData.images || []), ...urls];
        if (!this.formData.mainImage && this.formData.images.length > 0) {
          this.formData.mainImage = this.formData.images[0];
        }
        this.selectedPreviews = [];
        this.uploadProgress = 100;
        this.uploadingImages = false;
        setTimeout(() => {
          this.uploadProgress = 0;
        }, 1000);
      },
      error: (error) => {
        console.error('Error uploading images:', error);
        this.uploadProgress = 0;
        this.uploadingImages = false;
        alert('Image upload failed. Please retry with fewer/smaller images.');
      },
    });
  }

  onFloorPlanSelected(event: any) {
    const files: File[] = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }

    this.uploadingImages = true;
    this.cloudinaryService.uploadMultipleFiles(files).subscribe({
      next: (results) => {
        const urls = results.map((r) => r.secure_url).filter(Boolean);
        this.formData.floorPlans = [...(this.formData.floorPlans || []), ...urls];
        this.uploadingImages = false;
      },
      error: (error) => {
        console.error('Error uploading floor plans:', error);
        this.uploadingImages = false;
        alert('Floor plan upload failed. Please retry.');
      },
    });
  }

  removeUploadedImage(url: string) {
    this.formData.images = (this.formData.images || []).filter((u) => u !== url);
    if (this.formData.mainImage === url) {
      this.formData.mainImage = this.formData.images[0] || undefined;
    }
  }

  setMainImage(url: string) {
    if (!url) {
      return;
    }

    this.formData.mainImage = url;
  }

  removeFloorPlan(url: string) {
    this.formData.floorPlans = (this.formData.floorPlans || []).filter((u) => u !== url);
  }

  addPriceListRow() {
    this.formData.priceList = [...(this.formData.priceList || []), { configuration: '', area: 0, price: 0 }];
  }

  removePriceListRow(index: number) {
    this.formData.priceList = (this.formData.priceList || []).filter((_, i) => i !== index);
  }

  onCityChanged() {
    const divisions = this.cityDivisionOptions[this.formData.city] || [];
    if (!divisions.includes(this.formData.cityDivision)) {
      this.formData.cityDivision = '';
    }
  }

  isAmenitySelected(category: 'sports' | 'convenience' | 'leisure', amenity: string): boolean {
    return (this.formData.amenitiesByCategory[category] || []).includes(amenity);
  }

  toggleAmenity(category: 'sports' | 'convenience' | 'leisure', amenity: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const current = this.formData.amenitiesByCategory[category] || [];

    if (checked) {
      this.formData.amenitiesByCategory[category] = current.includes(amenity) ? current : [...current, amenity];
      return;
    }

    this.formData.amenitiesByCategory[category] = current.filter((item) => item !== amenity);
  }

  saveProperty() {
    if (this.uploadingImages) {
      alert('Please wait for uploads to complete before saving.');
      return;
    }

    this.saving = true;
    const payload = this.preparePropertyPayload();

    if (this.editingId) {
      this.propertyService
        .updateProperty(this.editingId, payload)
        .pipe(
          timeout(20000),
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe({
          next: () => {
            this.activeTab = 'list';
            this.resetForm();
            this.loadMyProperties();
            alert('Property updated successfully!');
          },
          error: (error) => {
            console.error('Error updating property:', error);
            alert('Update took too long or failed. Please try again.');
          },
        });
      return;
    }

    this.propertyService
      .createProperty(payload as Property)
      .pipe(
        timeout(20000),
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe({
        next: () => {
          this.activeTab = 'list';
          this.resetForm();
          this.loadMyProperties();
          alert('Property added successfully!');
        },
        error: (error) => {
          console.error('Error adding property:', error);
          alert('Save took too long or failed. Please try again.');
        },
      });
  }

  editProperty(property: Property) {
    this.activeTab = 'add';
    this.editingId = property.id || null;
    const defaults = this.getDefaultProperty();

    this.formData = {
      ...defaults,
      ...property,
      priceDetails: {
        ...defaults.priceDetails,
        ...(property.priceDetails || {}),
      },
      status: {
        ...defaults.status,
        ...(property.status || {}),
      },
      unitConfig: {
        ...defaults.unitConfig,
        ...(property.unitConfig || {}),
      },
      size: {
        ...defaults.size,
        ...(property.size || {}),
      },
      amenitiesByCategory: {
        ...defaults.amenitiesByCategory,
        ...(property.amenitiesByCategory || {}),
      },
      propertyType: {
        ...defaults.propertyType,
        ...(property.propertyType || {}),
      },
      reraDetails: {
        ...defaults.reraDetails,
        ...(property.reraDetails || {}),
      },
      priceList: Array.isArray(property.priceList) ? property.priceList : [],
      amenities: Array.isArray(property.amenities) ? property.amenities : [],
      floorPlans: Array.isArray(property.floorPlans) ? property.floorPlans : [],
      images: Array.isArray(property.images) ? property.images : [],
      mainImage: property.mainImage || (Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : undefined),
    };

    const normalizedIntent = (this.formData.listingIntent || '').toString().toLowerCase();
    if (normalizedIntent === 'sell') {
      this.formData.listingIntent = 'sale';
    } else if (normalizedIntent !== 'rent' && normalizedIntent !== 'sale') {
      this.formData.listingIntent = 'sale';
    }

    if (!this.cityOptions.includes(this.formData.city)) {
      this.formData.city = this.formData.city?.toLowerCase().includes('mumbai') ? 'Mumbai' : 'Pune';
    }

    this.onCityChanged();

    if ((!this.formData.amenitiesByCategory.sports.length && !this.formData.amenitiesByCategory.convenience.length && !this.formData.amenitiesByCategory.leisure.length) && this.formData.amenities.length > 0) {
      this.formData.amenitiesByCategory.sports = this.formData.amenities.filter((a) => this.sportsAmenityOptions.includes(a));
      this.formData.amenitiesByCategory.convenience = this.formData.amenities.filter((a) => this.convenienceAmenityOptions.includes(a));
      this.formData.amenitiesByCategory.leisure = this.formData.amenities.filter((a) => this.leisureAmenityOptions.includes(a));
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteProperty(id: string) {
    if (confirm('Are you sure you want to delete this property?')) {
      this.propertyService.deleteProperty(id).subscribe({
        next: () => {
          this.loadMyProperties();
          alert('Property deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting property:', error);
          alert('Error deleting property. Please try again.');
        },
      });
    }
  }

  updateAllPropertiesListingIntent() {
    if (this.bulkUpdatingListingIntent) {
      return;
    }

    const intentLabel = this.selectedBulkListingIntent === 'rent' ? 'Rent' : 'Sale';
    const confirmed = confirm(`Update listing type to ${intentLabel} for all properties in DB?`);
    if (!confirmed) {
      return;
    }

    this.bulkUpdatingListingIntent = true;
    this.propertyService.updateListingIntentForAllProperties(this.selectedBulkListingIntent)
      .pipe(
        finalize(() => {
          this.bulkUpdatingListingIntent = false;
        })
      )
      .subscribe({
        next: (count) => {
          this.formData.listingIntent = this.selectedBulkListingIntent;
          this.myProperties = this.myProperties.map((property) => ({
            ...property,
            listingIntent: this.selectedBulkListingIntent,
          }));
          alert(`Updated ${count} properties to ${intentLabel}.`);
        },
        error: (error) => {
          console.error('Error updating listing type for all properties:', error);
          alert('Bulk update failed. Please try again.');
        },
      });
  }

  cancelEdit() {
    this.resetForm();
  }

  private getDefaultProperty(): Property {
    return {
      name: '',
      title: '',
      location: '',
      city: '',
      cityDivision: '',
      description: '',
      numberOfUnits: 0,
      priceDetails: {
        basePrice: 0,
        governmentCharge: 0,
        totalPrice: 0,
      },
      status: {
        underConstruction: false,
        readyToMove: false,
        resale: false,
      },
      unitConfig: {
        '1bhk': false,
        '2bhk': false,
        '3bhk': false,
        '4bhk': false,
        '5bhk': false,
      },
      size: {
        carpetArea: 0,
        builtArea: 0,
        totalArea: 0,
      },
      priceList: [],
      floorPlans: [],
      amenities: [],
      amenitiesByCategory: {
        sports: [],
        convenience: [],
        leisure: [],
      },
      reraDetails: {
        reraNumber: '',
        reraStatus: '',
        possession: '',
      },
      images: [],
      mainImage: undefined,
      category: '',
      listingIntent: 'sale',
      propertyType: {
        apartment: false,
        villa: false,
        house: false,
        plot: false,
        office: false,
        shop: false,
      },
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      possessionStatus: '',
      features: [],
      owner: '',
      phone: '',
      email: '',
    };
  }

  private resetForm() {
    this.editingId = null;
    this.formData = this.getDefaultProperty();
    this.uploadingImages = false;
    this.selectedPreviews = [];
  }

  private preparePropertyPayload(): Partial<Property> {
    const basePrice = Number(this.formData.priceDetails.basePrice) || 0;
    const governmentCharge = Number(this.formData.priceDetails.governmentCharge) || 0;
    const totalPrice = Number(this.formData.priceDetails.totalPrice) || basePrice + governmentCharge;

    const sports = this.formData.amenitiesByCategory.sports || [];
    const convenience = this.formData.amenitiesByCategory.convenience || [];
    const leisure = this.formData.amenitiesByCategory.leisure || [];
    const selectedAmenities = Array.from(new Set([...sports, ...convenience, ...leisure].filter(Boolean)));

    let bedrooms = 0;
    if (this.formData.unitConfig['5bhk']) bedrooms = 5;
    else if (this.formData.unitConfig['4bhk']) bedrooms = 4;
    else if (this.formData.unitConfig['3bhk']) bedrooms = 3;
    else if (this.formData.unitConfig['2bhk']) bedrooms = 2;
    else if (this.formData.unitConfig['1bhk']) bedrooms = 1;

    const possessionStatus =
      this.formData.reraDetails.possession ||
      (this.formData.status.readyToMove
        ? 'Ready to move'
        : this.formData.status.underConstruction
          ? 'Under construction'
          : this.formData.status.resale
            ? 'Resale'
            : '');

    return {
      name: this.formData.name,
      title: this.formData.name,
      location: this.formData.location,
      city: this.formData.city,
      cityDivision: this.formData.cityDivision,
      description: this.formData.description,
      numberOfUnits: Number(this.formData.numberOfUnits) || 0,
      category: this.formData.category,
      listingIntent: this.formData.listingIntent === 'rent' ? 'rent' : 'sale',
      propertyType: {
        apartment: !!this.formData.propertyType.apartment,
        villa: !!this.formData.propertyType.villa,
        house: !!this.formData.propertyType.house,
        plot: !!this.formData.propertyType.plot,
        office: !!this.formData.propertyType.office,
        shop: !!this.formData.propertyType.shop,
      },
      priceDetails: {
        basePrice,
        governmentCharge,
        totalPrice,
      },
      status: {
        underConstruction: !!this.formData.status.underConstruction,
        readyToMove: !!this.formData.status.readyToMove,
        resale: !!this.formData.status.resale,
      },
      unitConfig: {
        '1bhk': !!this.formData.unitConfig['1bhk'],
        '2bhk': !!this.formData.unitConfig['2bhk'],
        '3bhk': !!this.formData.unitConfig['3bhk'],
        '4bhk': !!this.formData.unitConfig['4bhk'],
        '5bhk': !!this.formData.unitConfig['5bhk'],
      },
      size: {
        carpetArea: Number(this.formData.size.carpetArea) || 0,
        builtArea: Number(this.formData.size.builtArea || this.formData.size.totalArea) || 0,
        totalArea: Number(this.formData.size.builtArea || this.formData.size.totalArea) || 0,
      },
      priceList: (this.formData.priceList || [])
        .map((item) => ({
          configuration: (item.configuration || '').trim(),
          area: Number(item.area) || 0,
          price: Number(item.price) || 0,
        }))
        .filter((item) => item.configuration.length > 0),
      floorPlans: Array.isArray(this.formData.floorPlans) ? this.formData.floorPlans.filter(Boolean) : [],
      amenitiesByCategory: {
        sports: sports.filter(Boolean),
        convenience: convenience.filter(Boolean),
        leisure: leisure.filter(Boolean),
      },
      amenities: selectedAmenities,
      reraDetails: {
        reraNumber: this.formData.reraDetails.reraNumber || '',
        reraStatus: this.formData.reraDetails.reraStatus || '',
        possession: this.formData.reraDetails.possession || '',
      },
      images: Array.isArray(this.formData.images) ? this.formData.images.filter(Boolean) : [],
      mainImage: this.formData.mainImage || (Array.isArray(this.formData.images) && this.formData.images.length > 0 ? this.formData.images[0] : undefined),
      price: totalPrice,
      bedrooms,
      bathrooms: Number(this.formData.bathrooms) || 0,
      area: Number(this.formData.size.builtArea || this.formData.size.totalArea || this.formData.size.carpetArea) || 0,
      possessionStatus,
      features: selectedAmenities,
      owner: this.formData.owner,
      email: this.formData.email,
      phone: this.formData.phone,
    };
  }
}
