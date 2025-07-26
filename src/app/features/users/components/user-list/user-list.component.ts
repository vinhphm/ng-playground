import { CommonModule } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ApiService, NavigationService } from '@core'
import {
  injectMutation,
  injectQuery,
} from '@tanstack/angular-query-experimental'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'
import { NzSpaceModule } from 'ng-zorro-antd/space'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzTagModule } from 'ng-zorro-antd/tag'

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSpaceModule,
    NzTagModule,
    NzPopconfirmModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  private navigationService = inject(NavigationService)
  private apiService = inject(ApiService)

  searchText = ''

  usersQuery = injectQuery(() => ({
    queryKey: ['users'],
    queryFn: () => this.apiService.getUsers(),
  }))

  deleteMutation = injectMutation(() => ({
    mutationFn: (id: number) => this.apiService.deleteUser(id),
    onSuccess: () => {
      this.usersQuery.refetch()
    },
  }))

  filteredUsers = computed(() => {
    const users = this.usersQuery.data() || []
    if (!this.searchText) {
      return users
    }

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.username.toLowerCase().includes(this.searchText.toLowerCase())
    )
  })

  loading = computed(
    () => this.usersQuery.isPending() || this.deleteMutation.isPending()
  )

  onSearch() {
    // Filtering is now handled by the computed signal
  }

  viewUser(id: number) {
    this.navigationService.goToShow('users', id.toString())
  }

  deleteUser(id: number) {
    this.deleteMutation.mutate(id)
  }
}
