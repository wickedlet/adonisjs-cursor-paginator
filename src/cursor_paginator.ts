import { DatabaseQueryBuilder } from '@adonisjs/lucid/database'
import { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import type { TColumns, TCursor, OrderByClause, CursorPaginationResult } from './types.js'

type TQueryBuilder = DatabaseQueryBuilder | ModelQueryBuilder

/**
 * Cursor Paginator class for AdonisJS Lucid ORM
 * Provides cursor-based pagination functionality
 */
export class CursorPaginator<T = any> implements CursorPaginationResult<T> {
  public items: T[]
  public nextCursor: string | undefined
  public prevCursor: string | undefined

  constructor(items: T[], nextCursor?: string, prevCursor?: string) {
    this.items = items
    this.nextCursor = nextCursor
    this.prevCursor = prevCursor
  }

  /**
   * Generate a cursor string from column values
   */
  private static genCursor(columns: TColumns, item: any, pointToNext: boolean = false): string {
    const cursor: TCursor = {
      data: Object.keys(columns).map((column) => item[column]),
      point_to_next: pointToNext,
    }
    return Buffer.from(JSON.stringify(cursor)).toString('base64')
  }

  /**
   * Extract order by clauses from query builder
   */
  private static extractOrderByClauses(query: TQueryBuilder): OrderByClause[] {
    const knexQuery = (query as any).knexQuery
    if (!knexQuery) return []

    const orderBy =
      knexQuery._statements
        ?.filter(
          (statement: any) => statement.grouping === 'order' && statement.type === 'orderByBasic'
        )
        .map((statement: any) => ({
          column: statement.value,
          direction: statement.direction.toLowerCase(),
        })) || []
    return orderBy
  }

  /**
   * Convert order by clauses to columns configuration
   */
  private static convertOrderByToColumns(orderByClauses: OrderByClause[]): TColumns {
    return orderByClauses.reduce((acc: TColumns, clause) => {
      acc[clause.column] = clause.direction as 'asc' | 'desc'
      return acc
    }, {})
  }

  /**
   * Apply cursor conditions to query
   */
  private static applyCursorConditions(
    query: TQueryBuilder,
    columns: TColumns,
    cursor: TCursor
  ): void {
    query.where((query: any) => {
      const column = Object.keys(columns)[0]
      const direction = Object.values(columns)[0]
      const value = cursor.data.shift()

      if (cursor.point_to_next) {
        query.where(column, direction === 'asc' ? '>' : '<', value)
      } else {
        query.where(column, direction === 'asc' ? '<' : '>', value)
      }

      delete columns[column]
      if (cursor.data.length > 0) {
        query.orWhere(column, '=', value)
        CursorPaginator.applyCursorConditions(query, columns, cursor)
      }
    })
  }

  /**
   * Clear existing order by statements from query
   */
  private static clearOrderByStatements(query: TQueryBuilder): void {
    ;(query as any).knexQuery._statements = (query as any).knexQuery._statements.filter(
      (statement: any) => statement.grouping !== 'order'
    )
  }

  /**
   * Apply order by clauses to query
   */
  private static applyOrderBy(
    query: TQueryBuilder,
    orderByClauses: OrderByClause[],
    reverse: boolean = false
  ): void {
    orderByClauses.forEach((clause) => {
      const direction = reverse 
        ? (clause.direction === 'asc' ? 'desc' : 'asc')
        : clause.direction
      query.orderBy(clause.column, direction)
    })
  }

  /**
   * Create cursor pagination function
   */
  public static createPaginateFunction() {
    return async function <T>(
      this: TQueryBuilder,
      limit: number,
      cursor?: string | null
    ): Promise<CursorPaginator<T>> {
      // Extract order by clauses from query builder
      const orderByClauses = CursorPaginator.extractOrderByClauses(this)

      // If no order by clauses, default to id desc
      if (orderByClauses.length === 0) {
        this.orderBy('id', 'desc')
        orderByClauses.push({ column: 'id', direction: 'desc' })
      }

      const columns = CursorPaginator.convertOrderByToColumns(orderByClauses)
      const cursorData = cursor 
        ? JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8')) as TCursor
        : null
      const cloneCursorData = cursorData ? { ...cursorData } : null
      const clonedColumns = { ...columns }

      // Apply cursor conditions if cursor exists
      if (cursor && cursorData) {
        CursorPaginator.applyCursorConditions(this, columns, cursorData)
      }

      // Clear existing order by statements and apply new ones
      CursorPaginator.clearOrderByStatements(this)

      // Apply order by clauses with correct direction
      const shouldReverse = !!(cursor && cloneCursorData && !cloneCursorData.point_to_next)
      CursorPaginator.applyOrderBy(this, orderByClauses, shouldReverse)

      // Execute query with limit + 1 to check if there are more items
      const items = (await Promise.resolve(this.limit(limit + 1))) as T[]

      if (!items.length) {
        return new CursorPaginator<T>([])
      }

      // Handle different pagination scenarios
      if (items.length <= limit) {
        if (!cursor) {
          return new CursorPaginator<T>(items)
        } else if (cursor && cloneCursorData?.point_to_next) {
          return new CursorPaginator<T>(
            items,
            undefined,
            CursorPaginator.genCursor(clonedColumns, items[0], false)
          )
        } else if (cursor && cloneCursorData && !cloneCursorData.point_to_next) {
          items.reverse()
          return new CursorPaginator<T>(
            items,
            CursorPaginator.genCursor(clonedColumns, items[items.length - 1], true)
          )
        }
      } else {
        // Remove the extra item
        items.pop()
        
        // Reverse items if we were going backwards
        if (cursor && cloneCursorData && !cloneCursorData.point_to_next) {
          items.reverse()
        }

        const nextCursorStr = CursorPaginator.genCursor(
          clonedColumns,
          items[items.length - 1],
          true
        )

        if (!cursor) {
          return new CursorPaginator<T>(items, nextCursorStr)
        } else {
          return new CursorPaginator<T>(
            items,
            nextCursorStr,
            CursorPaginator.genCursor(clonedColumns, items[0], false)
          )
        }
      }

      return new CursorPaginator<T>(items)
    }
  }

  /**
   * Register cursor pagination with Lucid query builders
   */
  public static boot(ModelQueryBuilderClass?: any, DatabaseQueryBuilderClass?: any): void {
    const paginateFunc = CursorPaginator.createPaginateFunction()
    
    // Use provided classes or default imports
    const MQB = ModelQueryBuilderClass || ModelQueryBuilder
    const DQB = DatabaseQueryBuilderClass || DatabaseQueryBuilder
    
    // Add macro to both ModelQueryBuilder and DatabaseQueryBuilder
    MQB.macro('cursorPaginate', paginateFunc)
    DQB.macro('cursorPaginate', paginateFunc)
  }
}
