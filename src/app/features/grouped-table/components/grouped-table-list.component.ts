import { CommonModule } from '@angular/common'
import { Component, Input, signal, computed, ChangeDetectionStrategy, effect } from '@angular/core'
import { FormsModule } from '@angular/forms'
import type { SampleData } from '@core'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzTagModule } from 'ng-zorro-antd/tag'
import { NzCardModule } from 'ng-zorro-antd/card'
import { NzDividerModule } from 'ng-zorro-antd/divider'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzSpaceModule } from 'ng-zorro-antd/space'
import { DragDropModule, CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'

import {
  createAngularTable,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type GroupingState,
  type Updater,
  FlexRenderDirective,
} from '@tanstack/angular-table'

@Component({
  selector: 'app-grouped-table-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzCardModule,
    NzDividerModule,
    NzTableModule,
    NzSpaceModule,
    FlexRenderDirective,
    DragDropModule,
  ],
  templateUrl: './grouped-table-list.component.html',
  styleUrl: './grouped-table-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedTableListComponent {
  @Input() set data(value: SampleData[]) {
    this._data.set(value)
  }
  get data(): SampleData[] {
    return this._data()
  }

  @Input() loading = false

  private _data = signal<SampleData[]>([])
  grouping = signal<GroupingState>([])

  stringifiedGrouping = computed(() => JSON.stringify(this.grouping(), null, 2))

  columns = signal<ColumnDef<SampleData>[]>([
    {
      accessorKey: 'name',
      header: 'Name',
      enableGrouping: true,
      cell: (info) => info.getValue() as string,
    },
    {
      accessorKey: 'department',
      header: 'Department',
      enableGrouping: true,
      cell: (info) => info.getValue() as string,
    },
    {
      accessorKey: 'position',
      header: 'Position',
      enableGrouping: true,
      cell: (info) => info.getValue() as string,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      enableGrouping: true,
      cell: (info) => info.getValue() as string,
    },
    {
      accessorKey: 'salary',
      header: 'Salary',
      enableGrouping: false,
      cell: (info) => `$${(info.getValue() as number).toLocaleString()}`,
      aggregationFn: 'mean',
      aggregatedCell: (info) => `Avg: $${Math.round(info.getValue() as number).toLocaleString()}`,
    },
    {
      accessorKey: 'age',
      header: 'Age',
      enableGrouping: false,
      cell: (info) => info.getValue() as number,
      aggregationFn: 'mean',
      aggregatedCell: (info) => `Avg: ${Math.round(info.getValue() as number)}`,
    },
    {
      accessorKey: 'city',
      header: 'City',
      enableGrouping: true,
      cell: (info) => info.getValue() as string,
    },
    {
      accessorKey: 'country',
      header: 'Country',
      enableGrouping: true,
      cell: (info) => info.getValue() as string,
    },
    {
      accessorKey: 'experience',
      header: 'Experience (Years)',
      enableGrouping: false,
      cell: (info) => `${info.getValue()} years`,
      aggregationFn: 'mean',
      aggregatedCell: (info) => `Avg: ${Math.round(info.getValue() as number)} years`,
    },
  ])

  tableOptions = computed(() => ({
    data: this._data(),
    columns: this.columns(),
    state: {
      grouping: this.grouping(),
    },
    onGroupingChange: (updaterOrValue: Updater<GroupingState>) => {
      const groupingState =
        typeof updaterOrValue === 'function'
          ? updaterOrValue([...this.grouping()])
          : updaterOrValue
      this.grouping.set(groupingState)
    },
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
  }))

  table = createAngularTable(this.tableOptions)

  getStatusTagColor(status: string): string {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'default'
      case 'pending': return 'warning'
      default: return 'default'
    }
  }

  getStatusColor(cell: any): string {
    return this.getStatusTagColor(cell.getValue() as string)
  }

  globalFilter = ''

  clearAllGrouping() {
    this.grouping.set([])
  }

  onSort(column: any, sortOrder: string | null) {
    if (sortOrder === 'ascend') {
      column.toggleSorting(false)
    } else if (sortOrder === 'descend') {
      column.toggleSorting(true)
    } else {
      column.clearSorting()
    }
  }

  // Angular CDK Drag and Drop for group reordering
  dropGrouping(event: CdkDragDrop<string[]>) {
    if (event.previousIndex !== event.currentIndex) {
      const newGrouping = [...this.grouping()]
      moveItemInArray(newGrouping, event.previousIndex, event.currentIndex)
      this.grouping.set(newGrouping)
    }
  }

  // Column header drag and drop for adding new groups
  onColumnDragStart(event: DragEvent, columnId: string) {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', columnId)
    }
  }

  onDropZoneDragOver(event: DragEvent) {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }

  onDropZoneDrop(event: DragEvent) {
    event.preventDefault()
    const columnId = event.dataTransfer?.getData('text/plain')
    if (columnId && !this.grouping().includes(columnId)) {
      const newGrouping = [...this.grouping(), columnId]
      this.grouping.set(newGrouping)
    }
  }

  removeGrouping(columnId: string) {
    const newGrouping = this.grouping().filter(id => id !== columnId)
    this.grouping.set(newGrouping)
  }

  getColumnHeader(columnId: string): string {
    const column = this.columns().find(col => (col as any).accessorKey === columnId)
    return (column as any)?.header as string || columnId
  }
}
