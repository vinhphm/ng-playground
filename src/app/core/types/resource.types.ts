import type { Type } from '@angular/core'

export type ActionType = 'list' | 'show' | 'edit' | 'create'

export interface ResourceMeta {
  icon?: string
  label?: string
  canDelete?: boolean
}

export interface RouteParams {
  resource: string
  action: ActionType
  id?: string
  parentResource?: string
  parentId?: string
}

export interface ResourceConfig {
  name: string
  list?: Type<unknown>
  show?: Type<unknown>
  edit?: Type<unknown>
  create?: Type<unknown>
  children?: ResourceConfig[]
  meta?: ResourceMeta & {
    createInModal?: boolean
    editInModal?: boolean
  }
}
