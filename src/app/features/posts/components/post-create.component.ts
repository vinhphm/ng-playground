import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NavigationService } from '@core/services';

@Component({
  selector: 'app-post-create',
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
      <h2>Create New Post</h2>
      <nz-space>
        <button *nzSpaceItem nz-button (click)="goBack()">
          <span nz-icon nzType="arrow-left"></span>
          Cancel
        </button>
      </nz-space>
    </div>

    <nz-card>
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
                Create Post
              </button>
              <button *nzSpaceItem nz-button type="button" (click)="resetForm()">
                <span nz-icon nzType="reload"></span>
                Reset
              </button>
              <button *nzSpaceItem nz-button type="button" (click)="goBack()">
                Cancel
              </button>
            </nz-space>
          </nz-form-control>
        </nz-form-item>
      </form>
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

    .form-actions {
      margin-top: 24px;
    }

    textarea {
      resize: vertical;
    }
  `]
})
export class PostCreateComponent {
  private fb = inject(FormBuilder);
  private navigationService = inject(NavigationService);
  private message = inject(NzMessageService);

  submitting = signal(false);

  postForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    author: ['', [Validators.required, Validators.minLength(2)]],
    content: ['', [Validators.required, Validators.minLength(10)]]
  });

  onSubmit() {
    if (this.postForm.valid) {
      this.submitting.set(true);

      // Simulate API call
      setTimeout(() => {
        this.submitting.set(false);
        this.message.success('Post created successfully!');
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

  resetForm() {
    this.postForm.reset();
  }

  goBack() {
    this.navigationService.goToList('posts');
  }
}
