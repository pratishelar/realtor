import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  project: Property | null = null;
  relatedProjects: Property[] = [];
  loading = true;
  loadError = '';
  selectedImage = '';
  currentProjectId = '';
  private readonly isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      this.loading = false;
      return;
    }

    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (!id) {
        this.loading = false;
        this.loadError = 'Project not found.';
        return;
      }

      this.currentProjectId = id;
      this.fetchProject(id);
    });
  }

  fetchProject(id: string): void {
    if (!id) {
      this.loading = false;
      this.loadError = 'Project not found.';
      return;
    }

    this.loading = true;
    this.loadError = '';
    this.projectServiceRequest(id);
  }

  private projectServiceRequest(id: string): void {
    this.propertyService.getProperty(id).subscribe({
      next: (value) => {
        this.project = value;
        this.selectedImage = this.getPrimaryImage(value);
        this.loading = false;
        if (!value) {
          this.loadError = 'Project not found.';
          this.relatedProjects = [];
          return;
        }

        this.loadRelatedProjects(value.id || '', value.location || '');
      },
      error: () => {
        this.loading = false;
        this.loadError = 'Unable to load project details right now.';
        this.relatedProjects = [];
      }
    });
  }

  getPrimaryImage(project: Property | null): string {
    if (!project) {
      return '';
    }

    return project.mainImage || (project.images && project.images.length > 0 ? project.images[0] : '');
  }

  getBuilderName(project: Property | null): string {
    if (!project) {
      return '';
    }

    return (project.owner || '').trim() || 'DS Associates';
  }

  getDisplayPrice(project: Property | null): number {
    if (!project) {
      return 0;
    }

    return Number(project.priceDetails?.totalPrice || project.priceDetails?.basePrice || project.price || 0);
  }

  getDisplayArea(project: Property | null): number {
    if (!project) {
      return 0;
    }

    return Number(project.size?.builtArea || project.size?.totalArea || project.area || 0);
  }

  getAmenityTags(project: Property | null): string[] {
    if (!project) {
      return [];
    }

    return Array.isArray(project.amenities) ? project.amenities.slice(0, 8) : [];
  }

  getOrderedImages(project: Property | null): string[] {
    if (!project) {
      return [];
    }

    const safeImages = Array.isArray(project.images)
      ? project.images.filter((image): image is string => typeof image === 'string' && image.trim().length > 0)
      : [];

    const mainImage = (project.mainImage || '').trim();
    if (!mainImage) {
      return safeImages;
    }

    const remaining = safeImages.filter((image) => image !== mainImage);
    return [mainImage, ...remaining];
  }

  getDisplayStatus(project: Property | null): string {
    if (!project) {
      return 'N/A';
    }

    if (project.status?.readyToMove) {
      return 'Ready to Move';
    }

    if (project.status?.underConstruction) {
      return 'Under Construction';
    }

    if (project.status?.resale) {
      return 'Resale';
    }

    if (project.reraDetails?.possession) {
      return project.reraDetails.possession;
    }

    return 'N/A';
  }

  getUnitConfigLabel(project: Property | null): string {
    if (!project) {
      return 'N/A';
    }

    const configs: string[] = [];
    if (project.unitConfig?.['1bhk']) configs.push('1 BHK');
    if (project.unitConfig?.['2bhk']) configs.push('2 BHK');
    if (project.unitConfig?.['3bhk']) configs.push('3 BHK');
    if (project.unitConfig?.['4bhk']) configs.push('4 BHK');
    if (project.unitConfig?.['5bhk']) configs.push('5 BHK');

    if (configs.length > 0) {
      return configs.join(', ');
    }

    return project.bedrooms > 0 ? `${project.bedrooms} BHK` : 'N/A';
  }

  getTotalAreaInAcres(project: Property | null): string {
    const totalArea = Number(project?.size?.totalArea || project?.area || 0);
    if (totalArea <= 0) {
      return '0.00';
    }

    return (totalArea / 43560).toFixed(2);
  }

  getPriceList(project: Property | null): Array<{ configuration: string; area: number; price: number }> {
    if (!project) {
      return [];
    }

    if (Array.isArray(project.priceList) && project.priceList.length > 0) {
      return project.priceList
        .map((item) => ({
          configuration: item.configuration,
          area: Number(item.area || 0),
          price: Number(item.price || 0),
        }))
        .filter((item) => item.configuration && item.area > 0 && item.price > 0);
    }

    const area = this.getDisplayArea(project);
    const price = this.getDisplayPrice(project);
    if (area > 0 && price > 0) {
      return [{ configuration: this.getUnitConfigLabel(project), area, price }];
    }

    return [];
  }

  getFloorPlans(project: Property | null): string[] {
    if (!project || !Array.isArray(project.floorPlans)) {
      return [];
    }

    return project.floorPlans.filter((plan): plan is string => typeof plan === 'string' && plan.trim().length > 0);
  }

  openProject(projectId?: string): void {
    if (!projectId || projectId === this.currentProjectId) {
      return;
    }

    this.router.navigate(['/projects', projectId]);
  }

  getSpecItems(project: Property | null): Array<{ label: string; value: string }> {
    if (!project) {
      return [];
    }

    return [
      { label: 'Builder', value: this.getBuilderName(project) },
      { label: 'Project Status', value: this.getDisplayStatus(project) },
      { label: 'Configuration', value: this.getUnitConfigLabel(project) },
      { label: 'Total Units', value: `${project.numberOfUnits || 0}` },
      { label: 'Project Area', value: `${this.getTotalAreaInAcres(project)} Acres` },
      { label: 'RERA Number', value: project.reraDetails?.reraNumber || 'N/A' },
    ];
  }

  private loadRelatedProjects(currentId: string, location: string): void {
    this.propertyService.getProperties().subscribe({
      next: (items) => {
        const normalizedLocation = (location || '').toLowerCase();
        this.relatedProjects = items
          .filter((item) => item.id !== currentId)
          .sort((left, right) => {
            const leftScore = (left.location || '').toLowerCase().includes(normalizedLocation) ? 1 : 0;
            const rightScore = (right.location || '').toLowerCase().includes(normalizedLocation) ? 1 : 0;
            return rightScore - leftScore;
          })
          .slice(0, 4);
      },
      error: () => {
        this.relatedProjects = [];
      },
    });
  }
}