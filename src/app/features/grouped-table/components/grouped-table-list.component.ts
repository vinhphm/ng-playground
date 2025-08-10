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
  draggedColumn: string | null = null
  dropZoneActive = signal(false)

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

  // Drag and Drop functionality
  onDragStart(event: DragEvent, columnId: string) {
    this.draggedColumn = columnId
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', columnId)
    }
  }

  onDragEnd() {
    this.draggedColumn = null
    this.dropZoneActive.set(false)
  }

  onDropZoneDragOver(event: DragEvent) {
    event.preventDefault()
    this.dropZoneActive.set(true)
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }

  onDropZoneDragLeave() {
    this.dropZoneActive.set(false)
  }

  onDropZoneDrop(event: DragEvent) {
    event.preventDefault()
    this.dropZoneActive.set(false)
    
    const columnId = event.dataTransfer?.getData('text/plain')
    if (columnId && !this.grouping().includes(columnId)) {
      const newGrouping = [...this.grouping(), columnId]
      this.grouping.set(newGrouping)
    }
  }

  onGroupTagDragStart(event: DragEvent, columnId: string, index: number) {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', columnId)
      event.dataTransfer.setData('text/index', index.toString())
    }
  }

  onGroupTagDrop(event: DragEvent, targetIndex: number) {
    event.preventDefault()
    const draggedColumnId = event.dataTransfer?.getData('text/plain')
    const draggedIndex = parseInt(event.dataTransfer?.getData('text/index') || '-1')
    
    if (draggedColumnId && draggedIndex !== -1 && draggedIndex !== targetIndex) {
      const newGrouping = [...this.grouping()]
      const [removed] = newGrouping.splice(draggedIndex, 1)
      newGrouping.splice(targetIndex, 0, removed)
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
