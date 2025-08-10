import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  inject,
  Output,
} from '@angular/core'
import { Router } from '@angular/router'
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private resourceService = inject(ResourceService)
  private navigationService = inject(NavigationService)
  private router = inject(Router)

  @Input() isCollapsed = false
  @Output() collapsedChange = new EventEmitter<boolean>()

  menuItems = computed(() => this.resourceService.resources())

  onCollapsedChange(collapsed: boolean) {
    this.collapsedChange.emit(collapsed)
  }

  isCurrentRoute(resource: string, _action: string): boolean {
    // Determine deepest activated route and read its data
    let snapshot = this.router.routerState.snapshot.root
    while (snapshot.firstChild) {
      snapshot = snapshot.firstChild
    }

    const currentResource = snapshot.data['resource'] as string | undefined
    const parentResource = snapshot.data['parentResource'] as string | undefined

    if (currentResource) {
      return currentResource === resource || parentResource === resource
    }

    // Fallback: compare URL prefix when no route data is present
    return this.router.url.startsWith(`/${resource}`)
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
