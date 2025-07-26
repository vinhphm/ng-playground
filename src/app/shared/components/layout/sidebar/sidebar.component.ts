import { CommonModule } from '@angular/common'
import {
  Component,
  computed,
  EventEmitter,
  Input,
  inject,
  Output,
} from '@angular/core'
import { NavigationService, ResourceService } from '@core'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzLayoutModule } from 'ng-zorro-antd/layout'
import { NzMenuModule } from 'ng-zorro-antd/menu'

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private resourceService = inject(ResourceService)
  private navigationService = inject(NavigationService)

  @Input() isCollapsed = false
  @Output() collapsedChange = new EventEmitter<boolean>()

  menuItems = computed(() => this.resourceService.resources())

  onCollapsedChange(collapsed: boolean) {
    this.collapsedChange.emit(collapsed)
  }

  isCurrentRoute(_resource: string, _action: string): boolean {
    // This is a simplified check - in a real app you'd want to check against the current route
    return false
  }

  navigateToResource(resource: string, action: 'list' | 'create') {
    if (action === 'list') {
      this.navigationService.goToList(resource)
    } else {
      this.navigationService.goToCreate(resource)
    }
  }

  navigateToNestedResource(
    parentResource: string,
    _childResource: string,
    _action: 'list' | 'create'
  ) {
    // For nested resources, we'll navigate to the parent list first
    // In a real app, you'd want to handle this more sophisticatedly
    this.navigationService.goToList(parentResource)
  }
}
