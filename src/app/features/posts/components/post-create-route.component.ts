import { Component, inject, type OnInit } from '@angular/core'
import { PostModalService } from '@features/posts/services/post-modal.service'

@Component({
  selector: 'app-post-create-route',
  standalone: true,
  template: '',
})
export class PostCreateRouteComponent implements OnInit {
  private postModalService = inject(PostModalService)

  ngOnInit() {
    // Open the create modal when this route is activated
    this.postModalService.openCreateModal()
  }
}
