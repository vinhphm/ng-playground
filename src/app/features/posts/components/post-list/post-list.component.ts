import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import type { Post } from '@core'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'
import { NzSpaceModule } from 'ng-zorro-antd/space'
import { NzTableModule } from 'ng-zorro-antd/table'

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzPageHeaderModule,
    NzSpaceModule,
    NzPopconfirmModule,
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent {
  @Input() posts: Post[] = []
  @Input() loading = false
  @Input() searchText = ''

  @Output() searchTextChange = new EventEmitter<string>()
  @Output() viewPost = new EventEmitter<number>()
  @Output() editPost = new EventEmitter<number>()
  @Output() createPost = new EventEmitter<void>()
  @Output() deletePost = new EventEmitter<number>()

  onSearchChange() {
    this.searchTextChange.emit(this.searchText)
  }

  onViewPost(id: number) {
    this.viewPost.emit(id)
  }

  onEditPost(id: number) {
    this.editPost.emit(id)
  }

  onCreatePost() {
    this.createPost.emit()
  }

  onDeletePost(id: number) {
    this.deletePost.emit(id)
  }
}
