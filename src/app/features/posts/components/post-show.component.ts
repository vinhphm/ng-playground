import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NavigationService } from '../../../core';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

@Component({
  selector: 'app-post-show',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzCardModule,
    NzDividerModule,
    NzPopconfirmModule
  ],
  template: `
    <div class="page-header">
      <h2>Post Details</h2>
      <nz-space>
        <button *nzSpaceItem nz-button (click)="goBack()">
          <span nz-icon nzType="arrow-left"></span>
          Back to Posts
        </button>
        @if (post()) {
          <button *nzSpaceItem nz-button nzType="primary" (click)="editPost()">
            <span nz-icon nzType="edit"></span>
            Edit
          </button>
          <button 
            *nzSpaceItem 
            nz-button 
            nzDanger
            nz-popconfirm
            nzPopconfirmTitle="Are you sure you want to delete this post?"
            (nzOnConfirm)="deletePost()"
          >
            <span nz-icon nzType="delete"></span>
            Delete
          </button>
        }
      </nz-space>
    </div>

    @if (post(); as currentPost) {
      <nz-card [nzTitle]="currentPost.title">
        <div class="post-meta">
          <p><strong>Author:</strong> {{ currentPost.author }}</p>
          <p><strong>Created:</strong> {{ currentPost.createdAt | date:'full' }}</p>
        </div>
        
        <nz-divider></nz-divider>
        
        <div class="post-content">
          <p>{{ currentPost.content }}</p>
        </div>

        <nz-divider></nz-divider>

        <div class="post-actions">
          <h3>Comments</h3>
          <button nz-button nzType="default" (click)="viewComments()">
            <span nz-icon nzType="message"></span>
            View Comments
          </button>
        </div>
      </nz-card>
    } @else {
      <nz-card nzTitle="Post Not Found">
        <p>The requested post could not be found.</p>
        <button nz-button nzType="primary" (click)="goBack()">
          Back to Posts
        </button>
      </nz-card>
    }
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .page-header h2 {
      margin: 0;
    }

    .post-meta p {
      margin: 8px 0;
      color: #666;
    }

    .post-content {
      line-height: 1.6;
      font-size: 16px;
    }

    .post-actions {
      margin-top: 16px;
    }

    .post-actions h3 {
      margin-bottom: 12px;
    }
  `]
})
export class PostShowComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private navigationService = inject(NavigationService);
  
  post = signal<Post | null>(null);
  
  private mockPosts: Post[] = [
    {
      id: 1,
      title: 'Getting Started with Angular',
      content: 'Angular is a powerful framework for building dynamic web applications. It provides a comprehensive set of tools and features that make development efficient and enjoyable. In this post, we\'ll explore the fundamentals of Angular and how to get started with your first application.',
      author: 'John Doe',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 2,
      title: 'Advanced TypeScript Tips',
      content: 'TypeScript brings static typing to JavaScript, making your code more reliable and maintainable. Here are some advanced tips and tricks that will help you write better TypeScript code and leverage its full potential in your Angular applications.',
      author: 'Jane Smith',
      createdAt: new Date('2024-01-20')
    },
    {
      id: 3,
      title: 'Building Reactive Forms',
      content: 'Reactive forms in Angular provide a model-driven approach to handling form inputs. They offer more control over validation, dynamic form controls, and complex form scenarios. Learn how to master reactive forms in this comprehensive guide.',
      author: 'Bob Johnson',
      createdAt: new Date('2024-01-25')
    }
  ];

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const foundPost = this.mockPosts.find(post => post.id === id);
    this.post.set(foundPost || null);
  }

  goBack() {
    this.navigationService.goToList('posts');
  }

  editPost() {
    const currentPost = this.post();
    if (currentPost) {
      this.navigationService.goToEdit('posts', currentPost.id.toString());
    }
  }

  deletePost() {
    this.goBack();
  }

  viewComments() {
    const currentPost = this.post();
    if (currentPost) {
      this.navigationService.goToList('comments', {
        parentResource: 'posts',
        parentId: currentPost.id.toString()
      });
    }
  }
}