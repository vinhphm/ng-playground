import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    NzLayoutModule, 
    NzPageHeaderModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    NzMenuModule,
    NzAvatarModule,
    SidebarComponent
  ],
  template: `
    <nz-layout class="app-layout">
      <app-sidebar [isCollapsed]="isCollapsed()" (collapsedChange)="onCollapsedChange($event)"></app-sidebar>
      <nz-layout [class.layout-collapsed]="isCollapsed()" class="main-layout">
        <nz-header class="app-header">
          <div class="header-content">
            <button nz-button nzType="text" nzSize="large" class="trigger" (click)="toggleCollapsed()">
              <nz-icon [nzType]="isCollapsed() ? 'menu-unfold' : 'menu-fold'"></nz-icon>
            </button>
            <div class="header-extras">
              <nz-avatar nzIcon="user" nzSize="small"></nz-avatar>
              <a nz-dropdown [nzDropdownMenu]="menu" nzTrigger="click" class="user-dropdown">
                <span>Admin User</span>
                <nz-icon nzType="down"></nz-icon>
              </a>
              <nz-dropdown-menu #menu="nzDropdownMenu">
                <ul nz-menu>
                  <li nz-menu-item>
                    <nz-icon nzType="user"></nz-icon>
                    Profile
                  </li>
                  <li nz-menu-item>
                    <nz-icon nzType="setting"></nz-icon>
                    Settings
                  </li>
                  <li nz-menu-divider></li>
                  <li nz-menu-item>
                    <nz-icon nzType="logout"></nz-icon>
                    Logout
                  </li>
                </ul>
              </nz-dropdown-menu>
            </div>
          </div>
        </nz-header>
        <nz-content class="app-content">
          <div class="content-wrapper">
            <router-outlet></router-outlet>
          </div>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
    }
    
    .main-layout {
      margin-left: 200px;
      transition: margin-left 0.2s;
    }
    
    .main-layout.layout-collapsed {
      margin-left: 80px;
    }
    
    .app-header {
      background: #fff;
      padding: 0;
      box-shadow: 0 1px 4px rgba(0,21,41,.08);
      position: relative;
      z-index: 10;
      line-height: 64px;
    }
    
    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      height: 64px;
    }
    
    .trigger {
      font-size: 18px;
      cursor: pointer;
      transition: color 0.3s;
      padding: 0 24px;
    }
    
    .trigger:hover {
      color: #1890ff;
    }
    
    .header-extras {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .user-dropdown {
      color: rgba(0, 0, 0, 0.65);
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: color 0.3s;
    }
    
    .user-dropdown:hover {
      color: #1890ff;
    }
    
    .app-content {
      background: #f0f2f5;
      padding: 24px;
      min-height: calc(100vh - 64px);
    }
    
    .content-wrapper {
      background: #fff;
      padding: 24px;
      border-radius: 6px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
      min-height: calc(100vh - 112px);
    }
  `]
})
export class MainLayoutComponent {
  isCollapsed = signal(false);

  toggleCollapsed() {
    this.isCollapsed.set(!this.isCollapsed());
  }

  onCollapsedChange(collapsed: boolean) {
    this.isCollapsed.set(collapsed);
  }
}