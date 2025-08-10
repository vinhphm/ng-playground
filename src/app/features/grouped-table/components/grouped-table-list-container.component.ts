import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { GroupedTableListComponent } from './grouped-table-list.component'
import { ApiService } from '@core'
import {
  injectQuery,
} from '@tanstack/angular-query-experimental'

@Component({
  selector: 'app-grouped-table-list-container',
  standalone: true,
  imports: [CommonModule, GroupedTableListComponent],
  template: `
    <app-grouped-table-list
      [data]="sampleDataQuery.data() || []"
      [loading]="sampleDataQuery.isPending()"
    />
  `,
})
export class GroupedTableListContainerComponent {
  private apiService = inject(ApiService)

  sampleDataQuery = injectQuery(() => ({
    queryKey: ['sample-data'],
    queryFn: () => this.apiService.getSampleData(),
  }))
}
