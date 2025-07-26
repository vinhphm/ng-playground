import { CommonModule } from '@angular/common'
import { Component, inject, type OnInit, signal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ApiService, NavigationService } from '@core'
import {
  injectMutation,
  injectQuery,
} from '@tanstack/angular-query-experimental'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzCardModule } from 'ng-zorro-antd/card'
import { NzDividerModule } from 'ng-zorro-antd/divider'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'
import { NzSpaceModule } from 'ng-zorro-antd/space'

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
    NzPopconfirmModule,
  ],
  templateUrl: './post-show.component.html',
  styleUrl: './post-show.component.css',
})
export class PostShowComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private navigationService = inject(NavigationService)
  private apiService = inject(ApiService)

  postId = signal<number>(0)

  postQuery = injectQuery(() => ({
    queryKey: ['post', this.postId()],
    queryFn: () => this.apiService.getPost(this.postId()),
    enabled: this.postId() > 0,
  }))

  deleteMutation = injectMutation(() => ({
    mutationFn: (id: number) => this.apiService.deletePost(id),
    onSuccess: () => {
      this.goBack()
    },
  }))

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.postId.set(id)
  }

  goBack() {
    this.navigationService.goToList('posts')
  }

  editPost() {
    const currentPost = this.postQuery.data()
    if (currentPost) {
      this.navigationService.goToEdit('posts', currentPost.id.toString())
    }
  }

  deletePost() {
    const currentPost = this.postQuery.data()
    if (currentPost) {
      this.deleteMutation.mutate(currentPost.id)
    }
  }
}
