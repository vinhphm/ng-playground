import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NavigationService } from '../../../core';

interface Comment {
  id: number;
  content: string;
  author: string;
  postId: number;
  createdAt: Date;
}

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzCardModule,
    NzPopconfirmModule
  ],
  template: `
    <div class="page-header">
      <h2>Comments for Post {{ parentId() }}</h2>
      <nz-space>
        <button *nzSpaceItem nz-button (click)="goBackToPost()">
          <span nz-icon nzType="arrow-left"></span>
          Back to Post
        </button>
        <button *nzSpaceItem nz-button nzType="primary" (click)="createComment()">
          <span nz-icon nzType="plus"></span>
          Add Comment
        </button>
      </nz-space>
    </div>

    <nz-card>
      <nz-table 
        #basicTable 
        [nzData]="filteredComments()" 
        [nzPageSize]="10"
        [nzShowPagination]="true"
        [nzLoading]="loading()"
        [nzSize]="'small'"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Author</th>
            <th>Content</th>
            <th>Created At</th>
            <th nzWidth="150px">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (comment of basicTable.data; track comment.id) {
            <tr>
              <td>{{ comment.id }}</td>
              <td>{{ comment.author }}</td>
              <td>
                <div class="comment-content">
                  {{ comment.content | slice:0:100 }}
                  @if (comment.content.length > 100) {
                    <span>...</span>
                  }
                </div>
              </td>
              <td>{{ comment.createdAt | date:'short' }}</td>
              <td>
                <nz-space nzSize="small">
                  <button *nzSpaceItem nz-button nzSize="small" (click)="viewComment(comment.id)">
                    <span nz-icon nzType="eye"></span>
                    View
                  </button>
                  <button 
                    *nzSpaceItem 
                    nz-button 
                    nzSize="small" 
                    nzDanger
                    nz-popconfirm
                    nzPopconfirmTitle="Are you sure you want to delete this comment?"
                    (nzOnConfirm)="deleteComment(comment.id)"
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
    </nz-card>
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

    .comment-content {
      max-width: 300px;
      word-wrap: break-word;
    }
  `]
})
export class CommentListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private navigationService = inject(NavigationService);
  
  loading = signal(false);
  parentId = signal<string>('');
  
  comments = signal<Comment[]>([
    {
      id: 1,
      content: 'Great article! Very helpful for beginners.',
      author: 'Alice Wilson',
      postId: 1,
      createdAt: new Date('2024-01-16')
    },
    {
      id: 2,
      content: 'I agree with the points mentioned. Angular is indeed powerful.',
      author: 'Bob Smith',
      postId: 1,
      createdAt: new Date('2024-01-17')
    },
    {
      id: 3,
      content: 'Could you provide more examples on this topic?',
      author: 'Carol Brown',
      postId: 1,
      createdAt: new Date('2024-01-18')
    },
    {
      id: 4,
      content: 'These TypeScript tips are amazing! Thanks for sharing.',
      author: 'David Lee',
      postId: 2,
      createdAt: new Date('2024-01-21')
    },
    {
      id: 5,
      content: 'I learned something new today. Keep up the good work!',
      author: 'Eva Martinez',
      postId: 2,
      createdAt: new Date('2024-01-22')
    }
  ]);

  filteredComments = signal<Comment[]>([]);

  ngOnInit() {
    const postId = this.route.snapshot.paramMap.get('parentId');
    if (postId) {
      this.parentId.set(postId);
      const filtered = this.comments().filter(comment => comment.postId === Number(postId));
      this.filteredComments.set(filtered);
    }
  }

  viewComment(id: number) {
    this.navigationService.goToShow('comments', id.toString(), {
      parentResource: 'posts',
      parentId: this.parentId()
    });
  }

  createComment() {
    this.navigationService.goToCreate('comments', {
      parentResource: 'posts',
      parentId: this.parentId()
    });
  }

  deleteComment(id: number) {
    const currentComments = this.filteredComments();
    const updatedComments = currentComments.filter(comment => comment.id !== id);
    this.filteredComments.set(updatedComments);
  }

  goBackToPost() {
    this.navigationService.goToShow('posts', this.parentId());
  }
}