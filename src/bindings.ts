import type { CursorPaginator } from './cursor_paginator.js'

// This ensures the file is not empty after compilation
export const CURSOR_PAGINATOR_LOADED = true

declare module '@adonisjs/lucid/orm' {
  interface ModelQueryBuilder {
    /**
     * Perform cursor-based pagination on the query
     * @param limit - Number of items per page
     * @param cursor - Base64 encoded cursor for pagination
     * @returns Promise resolving to CursorPaginator instance
     */
    cursorPaginate<T>(limit: number, cursor?: string | null): Promise<CursorPaginator<T>>
  }
}

declare module '@adonisjs/lucid/database' {
  interface DatabaseQueryBuilder {
    /**
     * Perform cursor-based pagination on the query
     * @param limit - Number of items per page
     * @param cursor - Base64 encoded cursor for pagination
     * @returns Promise resolving to CursorPaginator instance
     */
    cursorPaginate<T>(limit: number, cursor?: string | null): Promise<CursorPaginator<T>>
  }
}

declare module '@adonisjs/lucid/types/model' {
  interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>> {
    /**
     * Perform cursor-based pagination on the query
     * @param limit - Number of items per page
     * @param cursor - Base64 encoded cursor for pagination
     * @returns Promise resolving to CursorPaginator instance
     */
    cursorPaginate<T = Result>(limit: number, cursor?: string | null): Promise<CursorPaginator<T>>
  }
}
