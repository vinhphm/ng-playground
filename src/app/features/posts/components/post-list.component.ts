import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';
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
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSpaceModule,
    NzPopconfirmModule
  ],
  template: `
    <div class="page-header">
      <h2>Posts</h2>
      <nz-space>
        <nz-input-group nzSearch nzSize="large" *nzSpaceItem>
          <input 
            type="text" 
            nz-input 
            placeholder="Search posts..." 
            [(ngModel)]="searchText"
            (ngModelChange)="onSearch()"
          />
        </nz-input-group>
        <button *nzSpaceItem nz-button nzType="primary" (click)="createPost()">
          <span nz-icon nzType="plus"></span>
          Create Post
        </button>
      </nz-space>
    </div>

    <nz-table 
      #basicTable 
      [nzData]="filteredPosts()" 
      [nzPageSize]="10"
      [nzShowPagination]="true"
      [nzLoading]="loading()"
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Author</th>
          <th>Created At</th>
          <th nzWidth="200px">Actions</th>
        </tr>
      </thead>
      <tbody>
        @for (post of basicTable.data; track post.id) {
          <tr>
            <td>{{ post.id }}</td>
            <td>{{ post.title }}</td>
            <td>{{ post.author }}</td>
            <td>{{ post.createdAt | date:'short' }}</td>
            <td>
              <nz-space>
                <button *nzSpaceItem nz-button nzSize="small" (click)="viewPost(post.id)">
                  <span nz-icon nzType="eye"></span>
                  View
                </button>
                <button *nzSpaceItem nz-button nzSize="small" (click)="editPost(post.id)">
                  <span nz-icon nzType="edit"></span>
                  Edit
                </button>
                <button *nzSpaceItem nz-button nzSize="small" (click)="viewComments(post.id)">
                  <span nz-icon nzType="message"></span>
                  Comments
                </button>
                <button 
                  *nzSpaceItem 
                  nz-button 
                  nzSize="small" 
                  nzDanger
                  nz-popconfirm
                  nzPopconfirmTitle="Are you sure you want to delete this post?"
                  (nzOnConfirm)="deletePost(post.id)"
                >
                  <span nz-icon nzType="delete"></span>
                  Delete
                </button>
              </nz-space>
            </td>
          </tr>
        }
      </tbody>
    </nz-table>

    <!-- Modal outlet for create/edit forms -->
    <router-outlet></router-outlet>
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
  `]
})
export class PostListComponent {
  private navigationService = inject(NavigationService);
  
  loading = signal(false);
  searchText = '';
  
  posts = signal<Post[]>([
    {
      id: 1,
      title: 'Getting Started with Angular',
      content: 'Learn the basics of Angular framework...',
      author: 'John Doe',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 2,
      title: 'Advanced TypeScript Tips',
      content: 'Discover advanced TypeScript features...',
      author: 'Jane Smith',
      createdAt: new Date('2024-01-20')
    },
    {
      id: 3,
      title: 'Building Reactive Forms',
      content: 'Master Angular reactive forms...',
      author: 'Bob Johnson',
      createdAt: new Date('2024-01-25')
    }
  ]);

  filteredPosts = signal<Post[]>(this.posts());

  onSearch() {
    const filtered = this.posts().filter(post =>
      post.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      post.author.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.filteredPosts.set(filtered);
  }

  viewPost(id: number) {
    this.navigationService.goToShow('posts', id.toString());
  }

  editPost(id: number) {
    this.navigationService.goToEdit('posts', id.toString());
  }

  createPost() {
    this.navigationService.goToCreate('posts');
  }

  viewComments(postId: number) {
    this.navigationService.goToList('comments', {
      parentResource: 'posts',
      parentId: postId.toString()
    });
  }

  deletePost(id: number) {
    const currentPosts = this.posts();
    const updatedPosts = currentPosts.filter(post => post.id !== id);
    this.posts.set(updatedPosts);
    this.onSearch();
  }
}