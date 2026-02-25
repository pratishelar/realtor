import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Property[] = [];
  loading = false;
  loadError = '';
  private readonly isBrowser: boolean;

  constructor(
    private propertyService: PropertyService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.loadProjects();
  }

  loadProjects(): void {
    if (!this.isBrowser) {
      this.projects = [];
      this.loading = false;
      this.loadError = '';
      return;
    }

    this.loading = true;
    this.loadError = '';

    this.propertyService.getProperties().subscribe({
      next: (items) => {
        this.projects = [...items].sort((left, right) => {
          const leftDate = this.toTime(left.updatedAt || left.createdAt);
          const rightDate = this.toTime(right.updatedAt || right.createdAt);
          return rightDate - leftDate;
        });
        this.loading = false;
      },
      error: () => {
        this.loadError = 'Unable to load builder projects right now.';
        this.loading = false;
      },
    });
  }

  getBuilderName(project: Property): string {
    return (project.owner || '').trim() || 'DS Associates';
  }

  getDisplayPrice(project: Property): number {
    return Number(project.priceDetails?.totalPrice || project.priceDetails?.basePrice || project.price || 0);
  }

  getPrimaryImage(project: Property): string {
    return project.mainImage || (project.images && project.images.length > 0 ? project.images[0] : '');
  }

  openProject(projectId?: string): void {
    if (!projectId) {
      return;
    }

    this.router.navigate(['/projects', projectId]);
  }

  private toTime(value: unknown): number {
    if (!value) {
      return 0;
    }

    if (value instanceof Date) {
      return value.getTime();
    }

    if (typeof value === 'object' && value !== null && 'seconds' in value) {
      const seconds = Number((value as { seconds?: unknown }).seconds || 0);
      return seconds * 1000;
    }

    const parsed = new Date(value as string).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  }
}
