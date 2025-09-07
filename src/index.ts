/**
 * AdonisJS Cursor Paginator
 * 
 * A cursor-based pagination package for AdonisJS Lucid ORM
 * that provides efficient pagination for large datasets.
 */

// Export main classes and types
export { CursorPaginator } from './cursor_paginator.js'
export { default as CursorPaginatorProvider } from './provider.js'

// Export commands
export { default as SetupCommand } from './commands/setup.js'

// Export types
export type { 
  TColumns, 
  TCursor, 
  OrderByClause, 
  CursorPaginationResult 
} from './types.js'

// IMPORTANT: Import and re-export bindings to automatically extend Lucid interfaces
// This makes cursorPaginate method available on all query builders
import './bindings.js'
export * from './bindings.js'
