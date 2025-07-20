import { Component, computed, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ResourceService, NavigationService } from '@core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NzLayoutModule, NzMenuModule, NzIconModule, NzButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private resourceService = inject(ResourceService);
  private navigationService = inject(NavigationService);
  
  @Input() isCollapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  
  menuItems = computed(() => this.resourceService.resources());

  onCollapsedChange(collapsed: boolean) {
    this.collapsedChange.emit(collapsed);
  }

  isCurrentRoute(resource: string, action: string): boolean {
    // This is a simplified check - in a real app you'd want to check against the current route
    return false;
  }

  navigateToResource(resource: string, action: 'list' | 'create') {
    if (action === 'list') {
      this.navigationService.goToList(resource);
    } else {
      this.navigationService.goToCreate(resource);
    }
  }

  navigateToNestedResource(parentResource: string, childResource: string, action: 'list' | 'create') {
    // For nested resources, we'll navigate to the parent list first
    // In a real app, you'd want to handle this more sophisticatedly
    this.navigationService.goToList(parentResource);
  }
}