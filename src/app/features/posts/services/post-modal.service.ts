import { Injectable, inject } from '@angular/core'
import { Router } from '@angular/router'
import { PostFormModalComponent } from '@features/posts/components/post-form-modal.component'
import { type NzModalRef, NzModalService } from 'ng-zorro-antd/modal'

interface Post {
  id: number
  title: string
  content: string
  author: string
  createdAt: Date
}

@Injectable({
  providedIn: 'root',
})
export class PostModalService {
  private modalService = inject(NzModalService)
  private router = inject(Router)

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
          onClick: () => modal.close(),
        },
        {
          label: 'Create Post',
          type: 'primary',
          loading: (): boolean => modal.getContentComponent()?.isSubmitting,
          disabled: (): boolean => !modal.getContentComponent()?.isFormValid,
          onClick: () => modal.getContentComponent()?.onSubmit(),
        },
      ],
    })

    modal.afterClose.subscribe((result: unknown) => {
      if (result) {
        // Handle successful creation result
      }
      // Navigate back to list without modal route
      this.router.navigate(['/posts'])
    })

    return modal
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
          onClick: () => modal.close(),
        },
        {
          label: 'Update Post',
          type: 'primary',
          loading: (): boolean => modal.getContentComponent()?.isSubmitting,
          disabled: (): boolean => !modal.getContentComponent()?.isFormValid,
          onClick: () => modal.getContentComponent()?.onSubmit(),
        },
      ],
    })

    modal.afterClose.subscribe((result: unknown) => {
      if (result) {
        // Handle successful edit result
      }
      // Navigate back to list without modal route
      this.router.navigate(['/posts'])
    })

    return modal
  }
}
