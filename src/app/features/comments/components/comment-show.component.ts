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

interface Comment {
  id: number;
  content: string;
  author: string;
  postId: number;
  createdAt: Date;
}

@Component({
  selector: 'app-comment-show',
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
      <h2>Comment Details</h2>
      <nz-space>
        <button *nzSpaceItem nz-button (click)="goBackToComments()">
          <span nz-icon nzType="arrow-left"></span>
          Back to Comments
        </button>
        @if (comment()) {
          <button *nzSpaceItem nz-button (click)="goToPost()">
            <span nz-icon nzType="file-text"></span>
            View Post
          </button>
          <button 
            *nzSpaceItem 
            nz-button 
            nzDanger
            nz-popconfirm
            nzPopconfirmTitle="Are you sure you want to delete this comment?"
            (nzOnConfirm)="deleteComment()"
          >
            <span nz-icon nzType="delete"></span>
            Delete
          </button>
        }
      </nz-space>
    </div>

    @if (comment(); as currentComment) {
      <nz-card nzTitle="Comment">
        <div class="comment-meta">
          <p><strong>Author:</strong> {{ currentComment.author }}</p>
          <p><strong>Posted on:</strong> {{ currentComment.createdAt | date:'full' }}</p>
          <p><strong>Post ID:</strong> {{ currentComment.postId }}</p>
        </div>
        
        <nz-divider></nz-divider>
        
        <div class="comment-content">
          <h4>Comment:</h4>
          <p>{{ currentComment.content }}</p>
        </div>
      </nz-card>
    } @else {
      <nz-card nzTitle="Comment Not Found">
        <p>The requested comment could not be found.</p>
        <button nz-button nzType="primary" (click)="goBackToComments()">
          Back to Comments
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

    .comment-meta p {
      margin: 8px 0;
      color: #666;
    }

    .comment-content {
      line-height: 1.6;
      font-size: 16px;
    }

    .comment-content h4 {
      margin-bottom: 12px;
      color: #333;
    }
  `]
})
export class CommentShowComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private navigationService = inject(NavigationService);
  
  comment = signal<Comment | null>(null);
  parentId = signal<string>('');
  
  private mockComments: Comment[] = [
    {
      id: 1,
      content: 'Great article! Very helpful for beginners. I especially liked the part about components and how they work together to create a cohesive application structure.',
      author: 'Alice Wilson',
      postId: 1,
      createdAt: new Date('2024-01-16')
    },
    {
      id: 2,
      content: 'I agree with the points mentioned. Angular is indeed powerful and provides a lot of built-in functionality that makes development faster and more maintainable.',
      author: 'Bob Smith',
      postId: 1,
      createdAt: new Date('2024-01-17')
    },
    {
      id: 3,
      content: 'Could you provide more examples on this topic? I would love to see some real-world use cases and best practices for implementing these concepts.',
      author: 'Carol Brown',
      postId: 1,
      createdAt: new Date('2024-01-18')
    },
    {
      id: 4,
      content: 'These TypeScript tips are amazing! Thanks for sharing. The advanced features you mentioned will definitely help me write better code.',
      author: 'David Lee',
      postId: 2,
      createdAt: new Date('2024-01-21')
    },
    {
      id: 5,
      content: 'I learned something new today. Keep up the good work! Your explanations are clear and easy to follow.',
      author: 'Eva Martinez',
      postId: 2,
      createdAt: new Date('2024-01-22')
    }
  ];

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const parentId = this.route.snapshot.paramMap.get('parentId');
    
    if (parentId) {
      this.parentId.set(parentId);
    }
    
    const foundComment = this.mockComments.find(comment => comment.id === id);
    this.comment.set(foundComment || null);
  }

  goBackToComments() {
    this.navigationService.goToList('comments', {
      parentResource: 'posts',
      parentId: this.parentId()
    });
  }

  goToPost() {
    const currentComment = this.comment();
    if (currentComment) {
      this.navigationService.goToShow('posts', currentComment.postId.toString());
    }
  }

  deleteComment() {
    this.goBackToComments();
  }
}