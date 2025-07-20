import { Component, signal, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MainLayoutComponent } from './shared';
import { ResourceService, RefineRouterService } from './core';
import { PostListComponent, PostShowComponent, PostEditComponent, PostCreateComponent, PostCreateRouteComponent, PostEditRouteComponent } from './features/posts';
import { CommentListComponent, CommentShowComponent, CommentCreateComponent } from './features/comments';
import { UserListComponent, UserShowComponent } from './features/users';

@Component({
  selector: 'app-root',
  imports: [MainLayoutComponent],
  template: '<app-main-layout></app-main-layout>',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private resourceService = inject(ResourceService);
  private routerService = inject(RefineRouterService);
  private router = inject(Router);
  
  protected readonly title = signal('ng-refine');

  ngOnInit() {
    this.initializeResources();
  }

  private initializeResources() {
    this.resourceService.register([
      {
        name: 'posts',
        list: PostListComponent,
        show: PostShowComponent,
        edit: PostEditRouteComponent,
        create: PostCreateRouteComponent,
        meta: { icon: 'file-text', label: 'Posts', createInModal: true, editInModal: true },
        children: [
          {
            name: 'comments',
            list: CommentListComponent,
            show: CommentShowComponent,
            create: CommentCreateComponent,
            meta: { icon: 'message', label: 'Comments' }
          }
        ]
      },
      {
        name: 'users',
        list: UserListComponent,
        show: UserShowComponent,
        meta: { icon: 'user', label: 'Users' }
      }
    ]);

    const generatedRoutes = this.routerService.generateRoutes(this.resourceService.resources());
    
    // Add default route
    const allRoutes = [
      { path: '', redirectTo: '/posts', pathMatch: 'full' as const },
      ...generatedRoutes
    ];

    this.router.resetConfig(allRoutes);
  }
}
