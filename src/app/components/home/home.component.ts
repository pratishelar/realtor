import { Component, OnInit } from '@angular/core';
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
  featuredProperties: Property[] = [];
  loadingFeatured = false;
  activeListingsCount = 0;
  searchQuery = '';

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
    if (this.searchQuery.trim()) {
      this.router.navigate(['/properties'], { queryParams: { q: this.searchQuery } });
    } else {
      this.router.navigate(['/properties']);
    }
  }

  viewProperty(id: string | undefined) {
    if (id) {
      this.router.navigate(['/property', id]);
    }
  }
}
