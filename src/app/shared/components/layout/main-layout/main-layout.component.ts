import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { SidebarComponent } from '@shared/components/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    NzLayoutModule, 
    SidebarComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
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