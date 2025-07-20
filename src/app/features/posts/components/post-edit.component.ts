import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NavigationService } from '../../../core';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzCardModule
  ],
  template: `
    <div class="page-header">
      <h2>Edit Post</h2>
      <nz-space>
        <button *nzSpaceItem nz-button (click)="goBack()">
          <span nz-icon nzType="arrow-left"></span>
          Cancel
        </button>
      </nz-space>
    </div>

    <nz-card *ngIf="post(); else notFound">
      <form nz-form [formGroup]="postForm" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="title">Title</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Please input the post title!">
            <input nz-input formControlName="title" placeholder="Enter post title" id="title" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="author">Author</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Please input the author name!">
            <input nz-input formControlName="author" placeholder="Enter author name" id="author" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="content">Content</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="Please input the post content!">
            <textarea 
              nz-input 
              formControlName="content" 
              placeholder="Enter post content" 
              id="content"
              rows="8"
            ></textarea>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item nz-row class="form-actions">
          <nz-form-control [nzSpan]="14" [nzOffset]="6">
            <nz-space>
              <button *nzSpaceItem nz-button nzType="primary" [nzLoading]="submitting()" [disabled]="!postForm.valid">
                <span nz-icon nzType="save"></span>
                Update Post
              </button>
              <button *nzSpaceItem nz-button type="button" (click)="goBack()">
                Cancel
              </button>
            </nz-space>
          </nz-form-control>
        </nz-form-item>
      </form>
    </nz-card>

    <ng-template #notFound>
      <nz-card nzTitle="Post Not Found">
        <p>The requested post could not be found.</p>
        <button nz-button nzType="primary" (click)="goBack()">
          Back to Posts
        </button>
      </nz-card>
    </ng-template>
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

    .form-actions {
      margin-top: 24px;
    }

    textarea {
      resize: vertical;
    }
  `]
})
export class PostEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private navigationService = inject(NavigationService);
  private message = inject(NzMessageService);
  
  post = signal<Post | null>(null);
  submitting = signal(false);
  
  postForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    author: ['', [Validators.required, Validators.minLength(2)]],
    content: ['', [Validators.required, Validators.minLength(10)]]
  });
  
  private mockPosts: Post[] = [
    {
      id: 1,
      title: 'Getting Started with Angular',
      content: 'Angular is a powerful framework for building dynamic web applications...',
      author: 'John Doe',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 2,
      title: 'Advanced TypeScript Tips',
      content: 'TypeScript brings static typing to JavaScript...',
      author: 'Jane Smith',
      createdAt: new Date('2024-01-20')
    },
    {
      id: 3,
      title: 'Building Reactive Forms',
      content: 'Reactive forms in Angular provide a model-driven approach...',
      author: 'Bob Johnson',
      createdAt: new Date('2024-01-25')
    }
  ];

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const foundPost = this.mockPosts.find(post => post.id === id);
    
    if (foundPost) {
      this.post.set(foundPost);
      this.postForm.patchValue({
        title: foundPost.title,
        author: foundPost.author,
        content: foundPost.content
      });
    } else {
      this.post.set(null);
    }
  }

  onSubmit() {
    if (this.postForm.valid && this.post()) {
      this.submitting.set(true);
      
      // Simulate API call
      setTimeout(() => {
        this.submitting.set(false);
        this.message.success('Post updated successfully!');
        this.goBack();
      }, 1000);
    } else {
      Object.values(this.postForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  goBack() {
    const currentPost = this.post();
    if (currentPost) {
      this.navigationService.goToShow('posts', currentPost.id.toString());
    } else {
      this.navigationService.goToList('posts');
    }
  }
}