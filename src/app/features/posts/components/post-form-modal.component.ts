import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

interface ModalData {
  mode: 'create' | 'edit';
  post?: Post;
}

@Component({
  selector: 'app-post-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule
  ],
  template: `
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
            rows="6"
          ></textarea>
        </nz-form-control>
      </nz-form-item>
    </form>
  `,
  styles: [`
    textarea {
      resize: vertical;
    }
  `]
})
export class PostFormModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modal = inject(NzModalRef);
  private message = inject(NzMessageService);
  private modalData = inject(NZ_MODAL_DATA) as ModalData;
  
  submitting = signal(false);
  isEditMode = signal(false);
  
  postForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    author: ['', [Validators.required, Validators.minLength(2)]],
    content: ['', [Validators.required, Validators.minLength(10)]]
  });

  ngOnInit() {
    this.isEditMode.set(this.modalData.mode === 'edit');
    
    if (this.isEditMode() && this.modalData.post) {
      this.postForm.patchValue({
        title: this.modalData.post.title,
        author: this.modalData.post.author,
        content: this.modalData.post.content
      });
    }
  }

  onSubmit() {
    if (this.postForm.valid) {
      this.submitting.set(true);
      
      // Simulate API call
      setTimeout(() => {
        this.submitting.set(false);
        const action = this.isEditMode() ? 'updated' : 'created';
        this.message.success(`Post ${action} successfully!`);
        this.modal.close(this.postForm.value);
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

  onCancel() {
    this.modal.close();
  }

  get submitButtonText(): string {
    return this.isEditMode() ? 'Update Post' : 'Create Post';
  }

  get isFormValid(): boolean {
    return this.postForm.valid;
  }

  get isSubmitting(): boolean {
    return this.submitting();
  }
}