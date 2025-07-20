import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { PostFormModalComponent } from '@features/posts/components/post-form-modal/post-form-modal.component';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PostModalService {
  private modalService = inject(NzModalService);
  private router = inject(Router);

  openCreateModal(): NzModalRef {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Create New Post',
      nzContent: PostFormModalComponent,
      nzData: { mode: 'create' },
      nzWidth: 600,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.close()
        },
        {
          label: 'Create Post',
          type: 'primary',
          loading: (): boolean => modal.getContentComponent()?.isSubmitting || false,
          disabled: (): boolean => !modal.getContentComponent()?.isFormValid,
          onClick: () => modal.getContentComponent()?.onSubmit()
        }
      ]
    });

    modal.afterClose.subscribe((result: any) => {
      if (result) {
        // Handle successful creation
        console.log('Post created:', result);
      }
      // Navigate back to list without modal route
      this.router.navigate(['/posts']);
    });

    return modal;
  }

  openEditModal(post: Post): NzModalRef {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: `Edit Post: ${post.title}`,
      nzContent: PostFormModalComponent,
      nzData: { mode: 'edit', post },
      nzWidth: 600,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => modal.close()
        },
        {
          label: 'Update Post',
          type: 'primary',
          loading: (): boolean => modal.getContentComponent()?.isSubmitting || false,
          disabled: (): boolean => !modal.getContentComponent()?.isFormValid,
          onClick: () => modal.getContentComponent()?.onSubmit()
        }
      ]
    });

    modal.afterClose.subscribe((result: any) => {
      if (result) {
        // Handle successful update
        console.log('Post updated:', result);
      }
      // Navigate back to list without modal route
      this.router.navigate(['/posts']);
    });

    return modal;
  }
}
