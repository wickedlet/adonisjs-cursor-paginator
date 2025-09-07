import type { ApplicationService } from '@adonisjs/core/types'
import { CursorPaginator } from './cursor_paginator.js'
// Import bindings to ensure types are available
import './bindings.js'

/**
 * AdonisJS Provider for Cursor Pagination
 * Registers the cursor pagination functionality with Lucid ORM
 */
export default class CursorPaginatorProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register the cursor pagination functionality
   */
  async register(): Promise<void> {
    // Register is called during the boot phase
    // We don't need to do anything here as the boot method handles registration
  }

  /**
   * Boot the cursor pagination functionality
   * This is where we extend the Lucid query builders
   */
  async boot(): Promise<void> {
    // Import Lucid classes dynamically to ensure they're available
    const { ModelQueryBuilder } = await import('@adonisjs/lucid/orm')
    const { DatabaseQueryBuilder } = await import('@adonisjs/lucid/database')
    
    // Register cursor pagination with Lucid query builders
    CursorPaginator.boot(ModelQueryBuilder, DatabaseQueryBuilder)
  }

  /**
   * Gracefully close connections during shutdown
   */
  async shutdown(): Promise<void> {
    // Nothing to cleanup for cursor pagination
  }
}
