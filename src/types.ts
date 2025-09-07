import type { LucidModel, ModelAttributes } from '@adonisjs/lucid/types/model'

/**
 * Column configuration for cursor pagination
 */
export type TColumns<M extends InstanceType<LucidModel> = any> = {
  [key in keyof ModelAttributes<M>]?: 'asc' | 'desc'
}

/**
 * Cursor data structure
 */
export type TCursor = {
  data: string[]
  point_to_next: boolean
}

/**
 * Order by clause structure
 */
export type OrderByClause = {
  column: string
  direction: 'asc' | 'desc'
}

/**
 * Cursor pagination result
 */
export interface CursorPaginationResult<T> {
  items: T[]
  nextCursor?: string
  prevCursor?: string
}
