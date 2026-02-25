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
  template: `
    <div class="admin-wrapper d-flex">
      <app-admin-sidebar
        [activeTab]="activeTab"
        [sidebarOpen]="sidebarOpen"
        (activeTabChange)="activeTab = $event"
        (sidebarToggle)="sidebarOpen = $event"
      ></app-admin-sidebar>

      <main class="admin-main flex-grow-1 p-4 bg-light">
        <div class="admin-container">
          <div class="page-header mb-4">
            <h1 class="mb-2">{{ activeTab === 'add' ? 'Add Property' : 'My Properties' }}</h1>
            <p class="text-muted mb-0">
              {{ activeTab === 'add' ? 'Create a new property listing' : 'Manage your property listings' }}
            </p>
          </div>

          <div *ngIf="activeTab === 'add'" class="tab-content card p-4">
            <form (ngSubmit)="saveProperty()" class="property-form">
              <div class="form-section">
                <h3>Property Details</h3>

                <div class="form-group">
                  <label>Name</label>
                  <input type="text" [(ngModel)]="formData.name" name="name" required class="form-control" />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Location</label>
                    <input type="text" [(ngModel)]="formData.location" name="location" required class="form-control" />
                  </div>
                  <div class="form-group">
                    <label>City</label>
                    <input type="text" [(ngModel)]="formData.city" name="city" required class="form-control" />
                  </div>
                </div>

                <div class="form-group">
                  <label>Description</label>
                  <textarea [(ngModel)]="formData.description" name="description" required rows="4" class="form-control"></textarea>
                </div>

                <div class="form-group">
                  <label>Category</label>
                  <div class="d-flex gap-3 flex-wrap">
                    <label><input type="radio" [(ngModel)]="formData.category" name="category" value="residential" /> Residential</label>
                    <label><input type="radio" [(ngModel)]="formData.category" name="category" value="commercial" /> Commercial</label>
                  </div>
                </div>

                <div class="form-group" *ngIf="formData.category === 'residential'">
                  <label>Property Type for Residential</label>
                  <div class="d-flex gap-3 flex-wrap">
                    <label><input type="checkbox" [(ngModel)]="formData.propertyType.apartment" name="ptypeApartment" /> Apartment</label>
                    <label><input type="checkbox" [(ngModel)]="formData.propertyType.villa" name="ptypeVilla" /> Villa</label>
                    <label><input type="checkbox" [(ngModel)]="formData.propertyType.house" name="ptypeHouse" /> House</label>
                  </div>
                </div>

                <div class="form-group" *ngIf="formData.category === 'commercial'">
                  <label>Property Type for Commercial</label>
                  <div class="d-flex gap-3 flex-wrap">
                    <label><input type="checkbox" [(ngModel)]="formData.propertyType.plot" name="ptypePlot" /> Plot</label>
                    <label><input type="checkbox" [(ngModel)]="formData.propertyType.office" name="ptypeOffice" /> Office</label>
                    <label><input type="checkbox" [(ngModel)]="formData.propertyType.shop" name="ptypeShop" /> Shop</label>
                  </div>
                </div>
              </div>

              <div class="form-section">
                <h3>Price & Status</h3>

                <div class="form-row">
                  <div class="form-group">
                    <label>Base Price</label>
                    <input type="number" [(ngModel)]="formData.priceDetails.basePrice" name="basePrice" min="0" required class="form-control" />
                  </div>
                  <div class="form-group">
                    <label>Government Charge</label>
                    <input type="number" [(ngModel)]="formData.priceDetails.governmentCharge" name="governmentCharge" min="0" required class="form-control" />
                  </div>
                  <div class="form-group">
                    <label>Total Price</label>
                    <input type="number" [(ngModel)]="formData.priceDetails.totalPrice" name="totalPrice" min="0" required class="form-control" />
                  </div>
                </div>

                <div class="form-group">
                  <label>Status</label>
                  <div class="d-flex gap-3 flex-wrap">
                    <label><input type="checkbox" [(ngModel)]="formData.status.underConstruction" name="statusUnderConstruction" /> Under Construction</label>
                    <label><input type="checkbox" [(ngModel)]="formData.status.readyToMove" name="statusReadyToMove" /> Ready to Move</label>
                    <label><input type="checkbox" [(ngModel)]="formData.status.resale" name="statusResale" /> Resale</label>
                  </div>
                </div>
              </div>

              <div class="form-section">
                <h3>Unit & Size</h3>

                <div class="form-group">
                  <label>Unit Config</label>
                  <div class="d-flex gap-3 flex-wrap">
                    <label><input type="checkbox" [(ngModel)]="formData.unitConfig['1bhk']" name="unit1bhk" /> 1 BHK</label>
                    <label><input type="checkbox" [(ngModel)]="formData.unitConfig['2bhk']" name="unit2bhk" /> 2 BHK</label>
                    <label><input type="checkbox" [(ngModel)]="formData.unitConfig['3bhk']" name="unit3bhk" /> 3 BHK</label>
                    <label><input type="checkbox" [(ngModel)]="formData.unitConfig['4bhk']" name="unit4bhk" /> 4 BHK</label>
                    <label><input type="checkbox" [(ngModel)]="formData.unitConfig['5bhk']" name="unit5bhk" /> 5 BHK</label>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Carpet Area</label>
                    <input type="number" [(ngModel)]="formData.size.carpetArea" name="carpetArea" min="0" required class="form-control" />
                  </div>
                  <div class="form-group">
                    <label>Built Area</label>
                    <input type="number" [(ngModel)]="formData.size.builtArea" name="builtArea" min="0" required class="form-control" />
                  </div>
                  <div class="form-group">
                    <label>Number of Units</label>
                    <input type="number" [(ngModel)]="formData.numberOfUnits" name="numberOfUnits" min="0" required class="form-control" />
                  </div>
                </div>
              </div>

              <div class="form-section">
                <h3>Price List</h3>
                <div *ngFor="let row of formData.priceList; let i = index" class="form-row align-items-end">
                  <div class="form-group">
                    <label>Configuration</label>
                    <input type="text" [(ngModel)]="row.configuration" [name]="'priceListConfiguration' + i" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label>Area</label>
                    <input type="number" [(ngModel)]="row.area" [name]="'priceListArea' + i" min="0" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label>Price</label>
                    <input type="number" [(ngModel)]="row.price" [name]="'priceListPrice' + i" min="0" class="form-control" />
                  </div>
                  <div class="form-group">
                    <button type="button" class="btn btn-outline-danger" (click)="removePriceListRow(i)">Remove</button>
                  </div>
                </div>
                <button type="button" class="btn btn-outline-primary" (click)="addPriceListRow()">Add Price List Row</button>
              </div>

              <div class="form-section">
                <h3>Floor Plan</h3>
                <div class="form-group">
                  <label>Upload Floor Plan (PDF or Image)</label>
                  <input type="file" multiple accept="image/*,.pdf,application/pdf" (change)="onFloorPlanSelected($event)" class="file-input form-control" />
                  <div class="image-preview mt-2">
                    <div *ngFor="let plan of formData.floorPlans" class="uploaded-item">
                      <a [href]="plan" target="_blank" rel="noopener" class="small text-truncate" style="max-width: 250px;">{{ plan }}</a>
                      <button type="button" class="remove-btn" (click)="removeFloorPlan(plan)">Remove</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-section">
                <h3>Amenities</h3>

                <div class="mb-3">
                  <strong class="d-block mb-2">Sports</strong>
                  <div class="d-flex gap-3 flex-wrap">
                    <label *ngFor="let amenity of sportsAmenityOptions">
                      <input type="checkbox" [checked]="isAmenitySelected('sports', amenity)" (change)="toggleAmenity('sports', amenity, $event)" />
                      {{ amenity }}
                    </label>
                  </div>
                </div>

                <div class="mb-3">
                  <strong class="d-block mb-2">Convenience</strong>
                  <div class="d-flex gap-3 flex-wrap">
                    <label *ngFor="let amenity of convenienceAmenityOptions">
                      <input type="checkbox" [checked]="isAmenitySelected('convenience', amenity)" (change)="toggleAmenity('convenience', amenity, $event)" />
                      {{ amenity }}
                    </label>
                  </div>
                </div>

                <div>
                  <strong class="d-block mb-2">Leisure</strong>
                  <div class="d-flex gap-3 flex-wrap">
                    <label *ngFor="let amenity of leisureAmenityOptions">
                      <input type="checkbox" [checked]="isAmenitySelected('leisure', amenity)" (change)="toggleAmenity('leisure', amenity, $event)" />
                      {{ amenity }}
                    </label>
                  </div>
                </div>
              </div>

              <div class="form-section">
                <h3>RERA Details</h3>
                <div class="form-row">
                  <div class="form-group">
                    <label>RERA Number</label>
                    <input type="text" [(ngModel)]="formData.reraDetails.reraNumber" name="reraNumber" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label>RERA Status</label>
                    <input type="text" [(ngModel)]="formData.reraDetails.reraStatus" name="reraStatus" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label>Possession</label>
                    <input type="text" [(ngModel)]="formData.reraDetails.possession" name="reraPossession" class="form-control" />
                  </div>
                </div>
              </div>

              <div class="form-section">
                <h3>Photos</h3>
                <div class="form-group">
                  <label>Upload Images</label>
                  <input type="file" multiple accept="image/*" (change)="onFileSelected($event)" class="file-input form-control" />
                  <p class="file-hint">You can upload multiple images at once</p>
                  <div class="image-preview">
                    <div *ngFor="let img of formData.images" class="uploaded-item">
                      <img [src]="img" alt="Uploaded image" class="preview-img" />
                      <div class="d-flex gap-2 mt-1">
                        <button type="button" class="btn btn-sm" [class.btn-primary]="formData.mainImage === img" [class.btn-outline-primary]="formData.mainImage !== img" (click)="setMainImage(img)">
                          {{ formData.mainImage === img ? 'Main Image' : 'Set as Main' }}
                        </button>
                      </div>
                      <button type="button" class="remove-btn" (click)="removeUploadedImage(img)">Remove</button>
                    </div>
                    <div *ngFor="let p of selectedPreviews" class="selected-item">
                      <img [src]="p" alt="Selected preview" class="preview-img" />
                      <div class="preview-label">Selected</div>
                    </div>
                  </div>
                </div>

                <div *ngIf="uploadProgress > 0 && uploadProgress < 100" class="progress-bar">
                  <div [style.width.%]="uploadProgress" class="progress-fill">{{ uploadProgress }}%</div>
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-submit btn btn-success" [disabled]="saving || uploadingImages">
                  {{ saving ? 'Saving...' : uploadingImages ? 'Uploading files...' : editingId ? 'Update Property' : 'Add Property' }}
                </button>

                <button *ngIf="editingId" type="button" (click)="cancelEdit()" class="btn-cancel btn btn-outline-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <div *ngIf="activeTab === 'list'" class="tab-content card p-3">
            <div *ngIf="loadingProperties" class="loading">
              <div class="spinner"></div>
              Loading properties...
            </div>

            <div *ngIf="!loadingProperties && myProperties.length === 0" class="no-properties">
              <div class="empty-state-icon">📭</div>
              <h3>No properties yet</h3>
              <p>Add your first property to get started</p>
              <button (click)="activeTab = 'add'" class="btn-add">Add Property</button>
            </div>

            <div class="properties-grid">
              <div *ngFor="let prop of myProperties" class="property-card">
                <div class="property-header">
                  <h3>{{ prop.name || prop.title }}</h3>
                  <span class="property-price">\${{ (prop.priceDetails.totalPrice || prop.price) | number }}</span>
                </div>
                <div class="property-details">
                  <p class="location">📍 {{ prop.location }}{{ prop.city ? ', ' + prop.city : '' }}</p>
                  <div class="property-specs">
                    <span class="spec">🏢 {{ prop.numberOfUnits || 0 }} Units</span>
                    <span class="spec">📐 {{ (prop.size.builtArea || prop.size.totalArea || prop.area) | number }} sqft</span>
                    <span class="spec">🏷️ {{ prop.reraDetails.reraStatus || 'N/A' }}</span>
                  </div>
                </div>
                <div class="property-actions">
                  <button (click)="editProperty(prop)" class="btn-edit"><span>✏️</span> Edit</button>
                  <button (click)="deleteProperty(prop.id!)" class="btn-delete"><span>🗑️</span> Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: []
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

  cancelEdit() {
    this.resetForm();
  }

  private getDefaultProperty(): Property {
    return {
      name: '',
      title: '',
      location: '',
      city: '',
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
      description: this.formData.description,
      numberOfUnits: Number(this.formData.numberOfUnits) || 0,
      category: this.formData.category,
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
