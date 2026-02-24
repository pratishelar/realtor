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
                <h3>Basic Information</h3>
                <div class="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    [(ngModel)]="formData.name"
                    name="name"
                    required
                    placeholder="Enter property name"
                    class="form-control"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      [(ngModel)]="formData.location"
                      name="location"
                      required
                      placeholder="Enter location"
                      class="form-control"
                    />
                  </div>
                  <div class="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      [(ngModel)]="formData.city"
                      name="city"
                      required
                      placeholder="Enter city"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label>Description</label>
                  <textarea
                    [(ngModel)]="formData.description"
                    name="description"
                    required
                    rows="4"
                    placeholder="Describe the property in detail"
                    class="form-control"
                  ></textarea>
                </div>
              </div>

              <div class="form-section">
                <h3>Property Details</h3>
                <div class="form-row">
                  <div class="form-group">
                    <label>Base Price</label>
                    <input
                      type="number"
                      [(ngModel)]="formData.priceDetails.basePrice"
                      name="basePrice"
                      required
                      min="0"
                      class="form-control"
                    />
                  </div>
                  <div class="form-group">
                    <label>Government Charge</label>
                    <input
                      type="number"
                      [(ngModel)]="formData.priceDetails.governmentCharge"
                      name="governmentCharge"
                      required
                      min="0"
                      class="form-control"
                    />
                  </div>
                  <div class="form-group">
                    <label>Total Price</label>
                    <input
                      type="number"
                      [(ngModel)]="formData.priceDetails.totalPrice"
                      name="totalPrice"
                      required
                      min="0"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label>Status</label>
                  <div class="d-flex gap-3 flex-wrap">
                    <label>
                      <input type="checkbox" [(ngModel)]="formData.status.preConstruction" name="statusPreConstruction" /> Pre Construction
                    </label>
                    <label>
                      <input type="checkbox" [(ngModel)]="formData.status.underConstruction" name="statusUnderConstruction" /> Under Construction
                    </label>
                    <label>
                      <input type="checkbox" [(ngModel)]="formData.status.readyToMove" name="statusReadyToMove" /> Ready to Move
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label>Unit Configuration</label>
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
                    <input
                      type="number"
                      [(ngModel)]="formData.size.carpetArea"
                      name="carpetArea"
                      required
                      min="0"
                      class="form-control"
                    />
                  </div>
                  <div class="form-group">
                    <label>Total Area</label>
                    <input
                      type="number"
                      [(ngModel)]="formData.size.totalArea"
                      name="totalArea"
                      required
                      min="0"
                      class="form-control"
                    />
                  </div>
                  <div class="form-group">
                    <label>Size Label</label>
                    <input
                      type="text"
                      [(ngModel)]="formData.size.label"
                      name="sizeLabel"
                      required
                      placeholder="e.g., Compact / Premium"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Number of Units</label>
                    <input
                      type="number"
                      [(ngModel)]="formData.numberOfUnits"
                      name="numberOfUnits"
                      required
                      min="0"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>

              <div class="form-section">
                <h3>Price List</h3>
                <div *ngFor="let row of formData.priceList; let i = index" class="form-row align-items-end">
                  <div class="form-group">
                    <label>Configuration</label>
                    <input type="text" [(ngModel)]="row.configuration" [name]="'priceListConfig' + i" class="form-control" />
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
                  <label>Floor Plan Image URLs (comma-separated)</label>
                  <textarea
                    [(ngModel)]="floorPlanInput"
                    name="floorPlans"
                    rows="3"
                    placeholder="https://.../floor1.jpg, https://.../floor2.jpg"
                    class="form-control"
                  ></textarea>
                </div>
              </div>

              <div class="form-section">
                <h3>Amenities</h3>
                <div class="d-flex gap-3 flex-wrap">
                  <label *ngFor="let amenity of amenityOptions">
                    <input
                      type="checkbox"
                      [checked]="isAmenitySelected(amenity)"
                      (change)="toggleAmenity(amenity, $event)"
                    />
                    {{ amenity }}
                  </label>
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
                  <input
                    type="file"
                    #fileInput
                    multiple
                    accept="image/*"
                    (change)="onFileSelected($event)"
                    class="file-input form-control"
                  />
                  <p class="file-hint">You can upload multiple images at once</p>
                  <div class="image-preview">
                    <div *ngFor="let img of formData.images" class="uploaded-item">
                      <img [src]="img" alt="Uploaded image" class="preview-img" />
                      <button type="button" class="remove-btn" (click)="removeUploadedImage(img)">Remove</button>
                    </div>

                    <div *ngFor="let p of selectedPreviews" class="selected-item">
                      <img [src]="p" alt="Selected preview" class="preview-img" />
                      <div class="preview-label">Selected</div>
                    </div>
                  </div>
                </div>

                <div *ngIf="uploadProgress > 0 && uploadProgress < 100" class="progress-bar">
                  <div [style.width.%]="uploadProgress" class="progress-fill">
                    {{ uploadProgress }}%
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn-submit btn btn-success"
                  [disabled]="saving || uploadingImages"
                >
                  {{ saving ? 'Saving...' : uploadingImages ? 'Uploading images...' : editingId ? 'Update Property' : 'Add Property' }}
                </button>

                <button
                  *ngIf="editingId"
                  type="button"
                  (click)="cancelEdit()"
                  class="btn-cancel btn btn-outline-secondary"
                >
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
                    <span class="spec">📐 {{ (prop.size.totalArea || prop.area) | number }} sqft</span>
                    <span class="spec">🏷️ {{ prop.reraDetails.reraStatus || 'N/A' }}</span>
                  </div>
                </div>
                <div class="property-actions">
                  <button (click)="editProperty(prop)" class="btn-edit">
                    <span>✏️</span> Edit
                  </button>
                  <button (click)="deleteProperty(prop.id!)" class="btn-delete">
                    <span>🗑️</span> Delete
                  </button>
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
  floorPlanInput = '';
  amenityOptions: string[] = [
    'Clubhouse',
    'Gymnasium',
    'Swimming Pool',
    'Kids Play Area',
    'Landscaped Garden',
    'Power Backup',
    'Lift',
    'Treated Water',
    'Pet Area',
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
    'Library',
    'Party Hall',
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

  removeUploadedImage(url: string) {
    this.formData.images = (this.formData.images || []).filter((u) => u !== url);
  }

  saveProperty() {
    if (this.uploadingImages) {
      alert('Please wait for image upload to complete before saving.');
      return;
    }

    this.saving = true;
    this.formData.floorPlans = this.floorPlanInput
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

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
    } else {
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
      reraDetails: {
        ...defaults.reraDetails,
        ...(property.reraDetails || {}),
      },
      priceList: Array.isArray(property.priceList) ? property.priceList : [],
      amenities: Array.isArray(property.amenities) ? property.amenities : [],
      floorPlans: Array.isArray(property.floorPlans) ? property.floorPlans : [],
      images: Array.isArray(property.images) ? property.images : [],
    };
    this.floorPlanInput = this.formData.floorPlans.join(', ');
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

  addPriceListRow() {
    this.formData.priceList = [...(this.formData.priceList || []), { configuration: '', area: 0, price: 0 }];
  }

  removePriceListRow(index: number) {
    this.formData.priceList = (this.formData.priceList || []).filter((_, i) => i !== index);
  }

  isAmenitySelected(amenity: string): boolean {
    return (this.formData.amenities || []).includes(amenity);
  }

  toggleAmenity(amenity: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const currentAmenities = this.formData.amenities || [];

    if (checked) {
      this.formData.amenities = currentAmenities.includes(amenity)
        ? currentAmenities
        : [...currentAmenities, amenity];
      return;
    }

    this.formData.amenities = currentAmenities.filter((item) => item !== amenity);
  }

  private getDefaultProperty(): Property {
    return {
      name: '',
      title: '',
      description: '',
      location: '',
      city: '',
      numberOfUnits: 0,
      priceDetails: {
        basePrice: 0,
        governmentCharge: 0,
        totalPrice: 0,
      },
      status: {
        preConstruction: false,
        underConstruction: false,
        readyToMove: false,
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
        totalArea: 0,
        label: '',
      },
      priceList: [],
      floorPlans: [],
      amenities: [],
      reraDetails: {
        reraNumber: '',
        reraStatus: '',
        possession: '',
      },
      images: [],
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      features: [],
      owner: '',
      email: '',
      phone: '',
    };
  }

  private resetForm() {
    this.editingId = null;
    this.formData = this.getDefaultProperty();
    this.floorPlanInput = '';
    this.uploadingImages = false;
    this.selectedPreviews = [];
  }

  private preparePropertyPayload(): Partial<Property> {
    const totalPrice = Number(this.formData.priceDetails.totalPrice) || 0;
    const basePrice = Number(this.formData.priceDetails.basePrice) || 0;
    const governmentCharge = Number(this.formData.priceDetails.governmentCharge) || 0;
    const selectedAmenities = Array.isArray(this.formData.amenities) ? this.formData.amenities.filter(Boolean) : [];

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
          : this.formData.status.preConstruction
            ? 'Pre construction'
            : '');

    return {
      name: this.formData.name,
      title: this.formData.name,
      description: this.formData.description,
      price: totalPrice || basePrice,
      location: this.formData.location,
      city: this.formData.city,
      numberOfUnits: Number(this.formData.numberOfUnits) || 0,
      priceDetails: {
        basePrice,
        governmentCharge,
        totalPrice: totalPrice || basePrice + governmentCharge,
      },
      status: {
        preConstruction: !!this.formData.status.preConstruction,
        underConstruction: !!this.formData.status.underConstruction,
        readyToMove: !!this.formData.status.readyToMove,
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
        totalArea: Number(this.formData.size.totalArea) || 0,
        label: this.formData.size.label || '',
      },
      priceList: (this.formData.priceList || [])
        .map((item) => ({
          configuration: (item.configuration || '').trim(),
          area: Number(item.area) || 0,
          price: Number(item.price) || 0,
        }))
        .filter((item) => item.configuration.length > 0),
      floorPlans: Array.isArray(this.formData.floorPlans) ? this.formData.floorPlans.filter(Boolean) : [],
      amenities: selectedAmenities,
      reraDetails: {
        reraNumber: this.formData.reraDetails.reraNumber || '',
        reraStatus: this.formData.reraDetails.reraStatus || '',
        possession: this.formData.reraDetails.possession || '',
      },
      images: Array.isArray(this.formData.images) ? this.formData.images.filter(Boolean) : [],
      bedrooms,
      bathrooms: Number(this.formData.bathrooms) || 0,
      area: Number(this.formData.size.totalArea || this.formData.size.carpetArea) || 0,
      possessionStatus,
      features: selectedAmenities,
      owner: this.formData.owner,
      email: this.formData.email,
      phone: this.formData.phone,
    };
  }
}
