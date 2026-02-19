import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-layout-content container-fluid px-0">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class AdminLayoutComponent {}
