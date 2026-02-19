import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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

      <!-- MAIN CONTENT AREA -->
      <main class="admin-main flex-grow-1 p-4 bg-light">
        <div class="admin-container">
          <div class="page-header mb-4">
            <h1 class="mb-2">{{ activeTab === 'add' ? 'Add Property' : 'My Properties' }}</h1>
            <p class="text-muted mb-0">
              {{ activeTab === 'add' ? 'Create a new property listing' : 'Manage your property listings' }}
            </p>
          </div>

          <!-- ADD PROPERTY TAB CONTENT -->
          <div *ngIf="activeTab === 'add'" class="tab-content card p-4">
            <form (ngSubmit)="saveProperty()" class="property-form">
              <div class="form-section">
                <h3>Basic Information</h3>
                <div class="form-group">
                  <label>Property Title</label>
                  <input
                    type="text"
                    [(ngModel)]="formData.title"
                    name="title"
                    required
                    placeholder="Enter property title"
                    class="form-control"
                  />
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
                    <label>Price (USD)</label>
                    <input
                      type="number"
                      [(ngModel)]="formData.price"
                      name="price"
                      required
                      placeholder="0.00"
                      class="form-control"
                    />
                  </div>
                  <div class="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      [(ngModel)]="formData.location"
                      name="location"
                      required
                      placeholder="City, State, Country"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Bedrooms</label>
                    <input
                      type="number"
                      [(ngModel)]="formData.bedrooms"
                      name="bedrooms"
                      required
                      min="0"
                      class="form-control"
                    />
                  </div>
                  <div class="form-group">
                    <label>Bathrooms</label>
                    <input
                      type="number"
                      [(ngModel)]="formData.bathrooms"
                      name="bathrooms"
                      required
                      min="0"
                      class="form-control"
                    />
                  </div>
                  <div class="form-group">
                    <label>Area (sqft)</label>
                    <input
                      type="number"
                      [(ngModel)]="formData.area"
                      name="area"
                      required
                      min="0"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>

              <div class="form-section">
                <h3>Contact Information</h3>
                <div class="form-group">
                  <label>Owner Name</label>
                  <input
                    type="text"
                    [(ngModel)]="formData.owner"
                    name="owner"
                    required
                    placeholder="Your full name"
                    class="form-control"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      [(ngModel)]="formData.email"
                      name="email"
                      placeholder="your.email@example.com"
                      class="form-control"
                    />
                  </div>
                  <div class="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      [(ngModel)]="formData.phone"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>

              <div class="form-section">
                <h3>Features & Images</h3>
                <div class="form-group">
                  <label>Features (comma-separated)</label>
                  <textarea
                    [(ngModel)]="featureInput"
                    name="features"
                    rows="3"
                    placeholder="e.g., Swimming Pool, Garden, Garage, Air Conditioning"
                    class="form-control"
                  ></textarea>
                </div>

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
                  [disabled]="saving"
                >
                  {{ saving ? 'Saving...' : editingId ? 'Update Property' : 'Add Property' }}
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

          <!-- MY PROPERTIES TAB CONTENT -->
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
                  <h3>{{ prop.title }}</h3>
                  <span class="property-price">\${{ prop.price | number }}</span>
                </div>
                <div class="property-details">
                  <p class="location">📍 {{ prop.location }}</p>
                  <div class="property-specs">
                    <span class="spec">🛏️ {{ prop.bedrooms }} Beds</span>
                    <span class="spec">🚿 {{ prop.bathrooms }} Baths</span>
                    <span class="spec">📐 {{ prop.area | number }} sqft</span>
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
  uploadProgress = 0;
  selectedPreviews: string[] = [];
  editingId: string | null = null;
  featureInput = '';

  formData: Property = {
    title: '',
    description: '',
    price: 0,
    location: '',
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    images: [],
    features: [],
    owner: '',
    email: '',
    phone: '',
  };

  constructor(
    private authService: AuthService,
    private propertyService: PropertyService,
    private cloudinaryService: CloudinaryService,
    private router: Router
  ) {
    // Check if user is authenticated
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
        // In a real app, you'd filter by current user
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
    const files: File[] = Array.from(event.target.files);
    if (files.length > 0) {
      this.uploadProgress = 0;
      this.selectedPreviews = [];
      // generate local previews immediately
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedPreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });

      console.log('AdminDashboard - Files selected for upload:', files.length);
      this.cloudinaryService.uploadMultipleImages(files).subscribe({
        next: (results) => {
          const urls = results.map((r) => r.secure_url).filter(Boolean);
          // append uploaded urls to existing images
          this.formData.images = [...(this.formData.images || []), ...urls];
          // clear local previews after upload
          this.selectedPreviews = [];
          this.uploadProgress = 100;
          setTimeout(() => {
            this.uploadProgress = 0;
          }, 1500);
        },
        error: (error) => {
          console.error('Error uploading images:', error);
          this.uploadProgress = 0;
        },
      });
    }
  }

  removeUploadedImage(url: string) {
    this.formData.images = (this.formData.images || []).filter((u) => u !== url);
  }

  saveProperty() {
    this.saving = true;
    this.formData.features = this.featureInput
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    console.log('AdminDashboard - Saving property:', this.formData);
    console.log('AdminDashboard - Images in formData:', this.formData.images);

    if (this.editingId) {
      this.propertyService.updateProperty(this.editingId, this.formData).subscribe({
        next: () => {
          console.log('AdminDashboard - Property updated successfully');
          this.saving = false;
          this.resetForm();
          this.loadMyProperties();
          alert('Property updated successfully!');
        },
        error: (error) => {
          console.error('Error updating property:', error);
          this.saving = false;
          alert('Error updating property. Please try again.');
        },
      });
    } else {
      this.propertyService.createProperty(this.formData).subscribe({
        next: () => {
          console.log('AdminDashboard - Property created successfully');
          this.saving = false;
          this.resetForm();
          this.loadMyProperties();
          alert('Property added successfully!');
        },
        error: (error) => {
          console.error('Error adding property:', error);
          this.saving = false;
          alert('Error adding property. Please try again.');
        },
      });
    }
  }

  editProperty(property: Property) {
    this.activeTab = 'add';
    this.editingId = property.id || null;
    this.formData = { ...property };
    this.featureInput = property.features?.join(', ') || '';
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

  private resetForm() {
    this.editingId = null;
    this.formData = {
      title: '',
      description: '',
      price: 0,
      location: '',
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      images: [],
      features: [],
      owner: '',
      email: '',
      phone: '',
    };
    this.featureInput = '';
  }
}
