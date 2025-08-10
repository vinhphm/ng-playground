import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnInit,
  signal,
} from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ApiService, NavigationService } from '@core'
import {
  injectMutation,
  injectQuery,
} from '@tanstack/angular-query-experimental'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzCardModule } from 'ng-zorro-antd/card'
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions'
import { NzDividerModule } from 'ng-zorro-antd/divider'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'
import { NzSpaceModule } from 'ng-zorro-antd/space'
import { NzTagModule } from 'ng-zorro-antd/tag'

@Component({
  selector: 'app-user-show',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzCardModule,
    NzDividerModule,
    NzTagModule,
    NzDescriptionsModule,
    NzPopconfirmModule,
  ],
  templateUrl: './user-show.component.html',
  styleUrl: './user-show.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserShowComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private navigationService = inject(NavigationService)
  private apiService = inject(ApiService)

  userId = signal<number>(0)

  userQuery = injectQuery(() => ({
    queryKey: ['user', this.userId()],
    queryFn: () => this.apiService.getUser(this.userId()),
    enabled: this.userId() > 0,
  }))

  deleteMutation = injectMutation(() => ({
    mutationFn: (id: number) => this.apiService.deleteUser(id),
    onSuccess: () => {
      this.goBack()
    },
  }))

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.userId.set(id)
  }

  goBack() {
    this.navigationService.goToList('users')
  }

  deleteUser() {
    const currentUser = this.userQuery.data()
    if (currentUser) {
      this.deleteMutation.mutate(currentUser.id)
    }
  }
}
