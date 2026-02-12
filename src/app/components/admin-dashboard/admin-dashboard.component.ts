import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PropertyService } from '../../services/property.service';
import { CloudinaryService } from '../../services/cloudinary.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <h1>Admin Dashboard</h1>

      <div class="admin-tabs">
        <button
          [class.active]="activeTab === 'add'"
          (click)="activeTab = 'add'"
          class="tab-btn"
        >
          Add Property
        </button>
        <button
          [class.active]="activeTab === 'list'"
          (click)="activeTab = 'list'"
          class="tab-btn"
        >
          My Properties
        </button>
      </div>

      <div *ngIf="activeTab === 'add'" class="tab-content">
        <h2>{{ editingId ? 'Edit Property' : 'Add New Property' }}</h2>
        <form (ngSubmit)="saveProperty()">
          <div class="form-group">
            <label>Title</label>
            <input
              type="text"
              [(ngModel)]="formData.title"
              name="title"
              required
              placeholder="Property title"
            />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea
              [(ngModel)]="formData.description"
              name="description"
              required
              rows="4"
              placeholder="Property description"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Price</label>
              <input
                type="number"
                [(ngModel)]="formData.price"
                name="price"
                required
                placeholder="Price in USD"
              />
            </div>
            <div class="form-group">
              <label>Location</label>
              <input
                type="text"
                [(ngModel)]="formData.location"
                name="location"
                required
                placeholder="Property location"
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
              />
            </div>
            <div class="form-group">
              <label>Bathrooms</label>
              <input
                type="number"
                [(ngModel)]="formData.bathrooms"
                name="bathrooms"
                required
              />
            </div>
            <div class="form-group">
              <label>Area (sqft)</label>
              <input
                type="number"
                [(ngModel)]="formData.area"
                name="area"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label>Owner Name</label>
            <input
              type="text"
              [(ngModel)]="formData.owner"
              name="owner"
              required
              placeholder="Your name"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Email</label>
              <input
                type="email"
                [(ngModel)]="formData.email"
                name="email"
                placeholder="Contact email"
              />
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input
                type="tel"
                [(ngModel)]="formData.phone"
                name="phone"
                placeholder="Contact phone"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Features (comma-separated)</label>
            <textarea
              [(ngModel)]="featureInput"
              name="features"
              rows="3"
              placeholder="e.g., Swimming Pool, Garden, Garage"
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
              class="file-input"
            />
            <div class="image-preview">
              <img
                *ngFor="let img of formData.images"
                [src]="img"
                alt="Property image"
                class="preview-img"
              />
            </div>
          </div>

          <div *ngIf="uploadProgress > 0 && uploadProgress < 100" class="progress-bar">
            <div [style.width.%]="uploadProgress" class="progress-fill"></div>
            <span>{{ uploadProgress }}%</span>
          </div>

          <button
            type="submit"
            class="btn-submit"
            [disabled]="saving"
          >
            {{ saving ? 'Saving...' : editingId ? 'Update Property' : 'Add Property' }}
          </button>

          <button
            *ngIf="editingId"
            type="button"
            (click)="cancelEdit()"
            class="btn-cancel"
          >
            Cancel
          </button>
        </form>
      </div>

      <div *ngIf="activeTab === 'list'" class="tab-content">
        <h2>My Properties</h2>
        <div *ngIf="loadingProperties" class="loading">Loading properties...</div>
        <div *ngIf="!loadingProperties && myProperties.length === 0" class="no-properties">
          No properties yet. Add one to get started!
        </div>
        <div class="properties-table">
          <div *ngFor="let prop of myProperties" class="property-row">
            <div class="property-info">
              <h3>{{ prop.title }}</h3>
              <p>\${{ prop.price | number }}</p>
              <p>📍 {{ prop.location }}</p>
            </div>
            <div class="property-actions">
              <button (click)="editProperty(prop)" class="btn-edit">Edit</button>
              <button (click)="deleteProperty(prop.id!)" class="btn-delete">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2.5rem 2rem;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
    }

    .admin-container h1 {
      text-align: center;
      color: #0d47a1;
      margin-bottom: 2.5rem;
      font-size: 2.5rem;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .admin-tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2.5rem;
      border-bottom: 3px solid rgba(255,255,255,0.5);
      padding-bottom: 1rem;
    }

    .tab-btn {
      padding: 0.875rem 2.25rem;
      background: rgba(255, 255, 255, 0.7);
      border: 2px solid transparent;
      border-bottom: 3px solid transparent;
      color: #455a64;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 8px 8px 0 0;
    }

    .tab-btn:hover {
      background: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(13, 71, 161, 0.1);
    }

    .tab-btn.active {
      color: white;
      background: linear-gradient(135deg, #00d9d9 0%, #0097cf 100%);
      border-bottom-color: #0091cc;
    }

    .tab-content {
      background: white;
      padding: 2.5rem;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(13, 71, 161, 0.1);
      border-top: 4px solid #00d9d9;
      animation: slideIn 0.4s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .tab-content h2 {
      color: #0d47a1;
      margin-bottom: 2rem;
      font-size: 1.75rem;
      font-weight: 700;
    }

    .form-group {
      margin-bottom: 1.75rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.75rem;
      color: #0d47a1;
      font-weight: 700;
      font-size: 0.95rem;
      letter-spacing: 0.5px;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 1rem;
      font-family: inherit;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: #fafafa;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #00d9d9;
      background: white;
      box-shadow: 0 0 0 4px rgba(0, 217, 217, 0.15);
    }

    .file-input {
      padding: 0.75rem;
    }

    .image-preview {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .preview-img {
      width: 100%;
      height: 120px;
      object-fit: cover;
      border-radius: 12px;
      border: 2px solid #e0e0e0;
      transition: all 0.3s;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .preview-img:hover {
      transform: scale(1.05);
      border-color: #00d9d9;
    }

    .progress-bar {
      background: #f0f0f0;
      border-radius: 10px;
      height: 40px;
      margin: 1.5rem 0;
      overflow: hidden;
      position: relative;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
    }

    .progress-fill {
      background: linear-gradient(90deg, #00d9d9 0%, #0097cf 100%);
      height: 100%;
      transition: width 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.95rem;
      font-weight: 700;
    }

    .btn-submit,
    .btn-cancel,
    .btn-edit,
    .btn-delete {
      padding: 0.875rem 1.75rem;
      border: none;
      border-radius: 10px;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .btn-submit {
      background: linear-gradient(135deg, #00d9d9 0%, #0097cf 100%);
      color: white;
      margin-right: 1rem;
      box-shadow: 0 6px 20px rgba(0, 217, 217, 0.3);
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 28px rgba(0, 217, 217, 0.4);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-cancel {
      background-color: #eceff1;
      color: #0d47a1;
      border: 2px solid #b0bec5;
    }

    .btn-cancel:hover {
      background-color: #b0bec5;
      color: white;
    }

    .loading {
      text-align: center;
      padding: 3rem 2rem;
      color: #0d47a1;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .no-properties {
      text-align: center;
      padding: 3rem 2rem;
      color: #90a4ae;
      font-size: 1.1rem;
    }

    .properties-table {
      display: grid;
      gap: 1.5rem;
    }

    .property-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
      padding: 1.75rem 2rem;
      border-radius: 12px;
      border-left: 5px solid #00d9d9;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      hover: transform translateY(-3px);
    }

    .property-row:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(13, 71, 161, 0.12);
      border-left-color: #0097cf;
    }

    .property-info h3 {
      margin: 0 0 0.75rem 0;
      color: #0d47a1;
      font-size: 1.25rem;
      font-weight: 700;
    }

    .property-info p {
      margin: 0.4rem 0;
      color: #455a64;
      font-weight: 500;
    }

    .property-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-edit {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .btn-edit:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-delete {
      background: linear-gradient(135deg, #ff5252 0%, #ff1744 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(255, 82, 82, 0.3);
    }

    .btn-delete:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 82, 82, 0.4);
    }

    @media (max-width: 768px) {
      .admin-container {
        padding: 1.5rem 1rem;
      }

      .admin-container h1 {
        font-size: 1.75rem;
        margin-bottom: 1.5rem;
      }

      .tab-content {
        padding: 1.5rem;
      }

      .property-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .property-actions {
        width: 100%;
        margin-top: 1rem;
      }

      .btn-submit {
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'add' | 'list' = 'add';
  myProperties: Property[] = [];
  loadingProperties = false;
  saving = false;
  uploadProgress = 0;
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
      console.log('AdminDashboard - Files selected:', files.length);
      this.cloudinaryService.uploadMultipleImages(files).subscribe({
        next: (results) => {
          console.log('AdminDashboard - Cloudinary results:', results);
          console.log('AdminDashboard - First result:', results[0]);
          console.log('AdminDashboard - secure_url in first:', results[0]?.secure_url);
          
          this.formData.images = results.map((r) => {
            console.log('AdminDashboard - Processing result:', r);
            console.log('AdminDashboard - Secure URL:', r.secure_url);
            return r.secure_url;
          });
          
          console.log('AdminDashboard - formData.images after upload:', this.formData.images);
          this.uploadProgress = 100;
          setTimeout(() => {
            this.uploadProgress = 0;
          }, 2000);
        },
        error: (error) => {
          console.error('Error uploading images:', error);
          this.uploadProgress = 0;
        },
      });
    }
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
