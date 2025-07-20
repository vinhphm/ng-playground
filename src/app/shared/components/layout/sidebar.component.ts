import { Component, computed, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ResourceService, NavigationService } from '../../../core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NzLayoutModule, NzMenuModule, NzIconModule, NzButtonModule],
  template: `
    <nz-sider 
      nzCollapsible 
      [nzCollapsed]="isCollapsed" 
      [nzWidth]="200"
      [nzCollapsedWidth]="80"
      (nzCollapsedChange)="onCollapsedChange($event)">
      <div class="logo">
        @if (!isCollapsed) {
          <h3>NG Refine</h3>
        } @else {
          <span>NR</span>
        }
      </div>
      <ul nz-menu nzTheme="dark" nzMode="inline" [nzInlineCollapsed]="isCollapsed">
        @for (resource of menuItems(); track resource.name) {
          @if (resource.children && resource.children.length > 0) {
            <li nz-submenu 
                [nzTitle]="resource.meta?.label || resource.name"
                [nzIcon]="resource.meta?.icon || null">
              <ul>
                <li nz-menu-item 
                    (click)="navigateToResource(resource.name, 'list')"
                    [nzSelected]="isCurrentRoute(resource.name, 'list')">
                  <nz-icon nzType="unordered-list"></nz-icon>
                  <span>List</span>
                </li>
                @for (child of resource.children; track child.name) {
                  <li nz-menu-item 
                      (click)="navigateToNestedResource(resource.name, child.name, 'list')"
                      [nzSelected]="isCurrentRoute(child.name, 'list')">
                    @if (child.meta?.icon; as icon) {
                      <nz-icon [nzType]="icon"></nz-icon>
                    }
                    <span>{{ child.meta?.label || child.name }}</span>
                  </li>
                }
              </ul>
            </li>
          } @else {
            <li nz-menu-item 
                (click)="navigateToResource(resource.name, 'list')"
                [nzSelected]="isCurrentRoute(resource.name, 'list')">
              @if (resource.meta?.icon; as icon) {
                <nz-icon [nzType]="icon"></nz-icon>
              }
              <span>{{ resource.meta?.label || resource.name }}</span>
            </li>
          }
        }
      </ul>
    </nz-sider>
  `,
  styles: [`
    .logo {
      height: 32px;
      margin: 16px;
      color: white;
      text-align: center;
      line-height: 32px;
      font-weight: bold;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 6px;
    }
    
    nz-sider {
      overflow: auto;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
    }
    
    [nz-menu] {
      border-right: 0;
    }
    
    :host ::ng-deep .ant-menu-dark {
      background: #001529;
    }
    
    :host ::ng-deep .ant-menu-dark .ant-menu-item,
    :host ::ng-deep .ant-menu-dark .ant-menu-submenu-title {
      color: rgba(255, 255, 255, 0.65);
    }
    
    :host ::ng-deep .ant-menu-dark .ant-menu-item:hover,
    :host ::ng-deep .ant-menu-dark .ant-menu-submenu-title:hover {
      color: #fff;
    }
    
    :host ::ng-deep .ant-menu-dark .ant-menu-item-selected {
      background-color: #1890ff;
      color: #fff;
    }
    
    :host ::ng-deep .ant-menu-dark .ant-menu-submenu-selected > .ant-menu-submenu-title {
      color: #fff;
    }
  `]
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