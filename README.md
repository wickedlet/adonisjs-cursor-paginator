# AdonisJS Cursor Paginator

[![npm version](https://badge.fury.io/js/adonisjs-cursor-paginator.svg)](https://badge.fury.io/js/adonisjs-cursor-paginator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Cursor-based pagination package for AdonisJS Lucid ORM. Provides efficient pagination for large datasets without the performance issues of offset-based pagination.

## Features

- 🚀 **High Performance**: Cursor-based pagination scales better than offset-based pagination
- 🔄 **Bi-directional**: Support for both forward and backward pagination
- 📊 **Multi-column Sorting**: Support for complex sorting with multiple columns
- 🎯 **Type Safe**: Full TypeScript support with proper type definitions
- 🔧 **Easy Integration**: Seamless integration with AdonisJS Lucid ORM
- 📱 **Real-time Friendly**: Consistent results even when data changes

## Installation

```bash
npm install adonisjs-cursor-paginator
```

## Quick Setup (Recommended)

After installation, run the setup command to automatically configure everything:

```bash
npx adonisjs-cursor-paginator setup
```

This will:
- ✅ Create `types/cursor.d.ts` with type definitions
- ✅ Create `providers/cursor_paginator_provider.ts` 
- ✅ Update `adonisrc.ts` to register the provider
- 🎉 Ready to use!

## Manual Setup (Alternative)

### 1. Register the Provider

Add the provider to your `adonisrc.ts` file:

```typescript
// adonisrc.ts
export default defineConfig({
  // ... other config
  providers: [
    // ... other providers
    () => import('#providers/cursor_paginator_provider')
  ]
})
```

### 2. Create Provider File

Create `providers/cursor_paginator_provider.ts`:

```typescript
import type { ApplicationService } from '@adonisjs/core/types'

export default class CursorPaginatorProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    const { CursorPaginator } = await import('adonisjs-cursor-paginator')
    const { ModelQueryBuilder } = await import('@adonisjs/lucid/orm')
    const { DatabaseQueryBuilder } = await import('@adonisjs/lucid/database')
    
    CursorPaginator.boot(ModelQueryBuilder, DatabaseQueryBuilder)
  }
}
```

### 3. Configure TypeScript

Create `types/cursor.d.ts`:

```typescript
import type { CursorPaginator } from 'adonisjs-cursor-paginator'
import type { LucidModel } from '@adonisjs/lucid/types/model'

declare module '@adonisjs/lucid/types/model' {
  interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>> {
    cursorPaginate<T = Result>(limit: number, cursor?: string | null): Promise<CursorPaginator<T>>
  }
}
```

## Usage

### Basic Usage

```typescript
import User from '#models/user'

// First page - no cursor needed
const firstPage = await User.query()
  .where('active', true)
  .orderBy('created_at', 'desc')
  .orderBy('id', 'desc') // Always include a unique column for consistent results
  .cursorPaginate(10)

console.log(firstPage.items) // Array of User models
console.log(firstPage.nextCursor) // Cursor for next page
console.log(firstPage.prevCursor) // undefined (first page)

// Next page
if (firstPage.nextCursor) {
  const nextPage = await User.query()
    .where('active', true)
    .orderBy('created_at', 'desc')
    .orderBy('id', 'desc')
    .cursorPaginate(10, firstPage.nextCursor)
}

// Previous page
if (nextPage.prevCursor) {
  const prevPage = await User.query()
    .where('active', true)
    .orderBy('created_at', 'desc')
    .orderBy('id', 'desc')
    .cursorPaginate(10, nextPage.prevCursor)
}
```

### Advanced Usage

#### With Complex Queries

```typescript
import Product from '#models/product'

const products = await Product.query()
  .where('status', 'published')
  .where('price', '>', 0)
  .whereHas('categories', (query) => {
    query.where('name', 'electronics')
  })
  .orderBy('popularity_score', 'desc')
  .orderBy('created_at', 'desc')
  .orderBy('id', 'desc')
  .cursorPaginate(20, cursor)
```

#### With Database Query Builder

```typescript
import db from '@adonisjs/lucid/services/db'

const results = await db.from('users')
  .where('active', true)
  .orderBy('created_at', 'desc')
  .orderBy('id', 'desc')
  .cursorPaginate(10, cursor)
```

### API Response Format

```typescript
interface CursorPaginationResult<T> {
  items: T[]           // Array of results
  nextCursor?: string  // Cursor for next page (undefined if no more items)
  prevCursor?: string  // Cursor for previous page (undefined if first page)
}
```

### Frontend Integration

#### React Example

```typescript
import { useState, useEffect } from 'react'

function UserList() {
  const [users, setUsers] = useState([])
  const [nextCursor, setNextCursor] = useState(null)
  const [prevCursor, setPrevCursor] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchUsers = async (cursor = null) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/users?cursor=${cursor || ''}`)
      const data = await response.json()
      
      setUsers(data.items)
      setNextCursor(data.nextCursor)
      setPrevCursor(data.prevCursor)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div>
      <div className="users">
        {users.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
      
      <div className="pagination">
        <button 
          onClick={() => fetchUsers(prevCursor)}
          disabled={!prevCursor || loading}
        >
          Previous
        </button>
        
        <button 
          onClick={() => fetchUsers(nextCursor)}
          disabled={!nextCursor || loading}
        >
          Next
        </button>
      </div>
    </div>
  )
}
```

#### Controller Example

```typescript
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  async index({ request, response }: HttpContext) {
    const cursor = request.input('cursor')
    const limit = request.input('limit', 10)

    const paginator = await User.query()
      .where('active', true)
      .orderBy('created_at', 'desc')
      .orderBy('id', 'desc')
      .cursorPaginate(limit, cursor)

    return response.json({
      items: paginator.items,
      nextCursor: paginator.nextCursor,
      prevCursor: paginator.prevCursor
    })
  }
}
```

## Best Practices

### 1. Always Include a Unique Column

Always include a unique column (like `id`) in your `orderBy` clause to ensure consistent results:

```typescript
// ✅ Good - includes unique id column
.orderBy('created_at', 'desc')
.orderBy('id', 'desc')

// ❌ Bad - may have inconsistent results with duplicate created_at values
.orderBy('created_at', 'desc')
```

### 2. Consistent Ordering

Use the same `orderBy` clauses for all pagination requests:

```typescript
// ✅ Good - consistent ordering
const baseQuery = () => User.query()
  .where('active', true)
  .orderBy('created_at', 'desc')
  .orderBy('id', 'desc')

const firstPage = await baseQuery().cursorPaginate(10)
const nextPage = await baseQuery().cursorPaginate(10, firstPage.nextCursor)

// ❌ Bad - different ordering
const firstPage = await User.query().orderBy('name').cursorPaginate(10)
const nextPage = await User.query().orderBy('created_at').cursorPaginate(10, firstPage.nextCursor)
```

### 3. Reasonable Page Sizes

Use reasonable page sizes to balance performance and user experience:

```typescript
// ✅ Good - reasonable page sizes
.cursorPaginate(10)   // Small lists
.cursorPaginate(25)   // Medium lists
.cursorPaginate(50)   // Large lists

// ❌ Avoid - too large
.cursorPaginate(1000) // May cause performance issues
```

### 4. Error Handling

Always handle pagination errors gracefully:

```typescript
try {
  const paginator = await User.query()
    .orderBy('created_at', 'desc')
    .orderBy('id', 'desc')
    .cursorPaginate(10, cursor)
    
  return response.json(paginator)
} catch (error) {
  if (error.message.includes('Invalid cursor')) {
    // Handle invalid cursor - maybe redirect to first page
    return response.redirect('/users')
  }
  throw error
}
```

## How It Works

Cursor pagination works by using the values of the ordered columns as a "cursor" to determine where to start the next page. Instead of using `OFFSET`, it uses `WHERE` conditions to find records after/before the cursor position.

### Example

For a query ordered by `created_at DESC, id DESC`:

```sql
-- First page
SELECT * FROM users 
WHERE active = true 
ORDER BY created_at DESC, id DESC 
LIMIT 10

-- Next page (cursor contains last item's created_at and id)
SELECT * FROM users 
WHERE active = true 
  AND (
    created_at < '2023-01-15 10:30:00' 
    OR (created_at = '2023-01-15 10:30:00' AND id < 123)
  )
ORDER BY created_at DESC, id DESC 
LIMIT 10
```

This approach:
- ✅ Maintains consistent performance regardless of page depth
- ✅ Handles real-time data changes gracefully
- ✅ Prevents duplicate or missing items during pagination

## Performance Comparison

| Method | First Page | Page 1000 | Page 10000 |
|--------|------------|-----------|-------------|
| Offset | ~1ms | ~100ms | ~1000ms |
| Cursor | ~1ms | ~1ms | ~1ms |

## Limitations

1. **Requires Ordering**: Cursor pagination requires at least one `orderBy` clause
2. **No Random Access**: You can't jump to arbitrary pages (page 5, page 10, etc.)
3. **Cursor Dependency**: Cursors are tied to the specific query and ordering
4. **No Total Count**: Unlike offset pagination, cursor pagination doesn't provide total count

## Migration from Offset Pagination

If you're migrating from offset-based pagination:

### Before (Offset)
```typescript
const page = request.input('page', 1)
const limit = 10

const users = await User.query()
  .where('active', true)
  .orderBy('created_at', 'desc')
  .paginate(page, limit)

// Response: { data: [...], meta: { total: 1000, page: 1, perPage: 10 } }
```

### After (Cursor)
```typescript
const cursor = request.input('cursor')
const limit = 10

const users = await User.query()
  .where('active', true)
  .orderBy('created_at', 'desc')
  .orderBy('id', 'desc') // Add unique column
  .cursorPaginate(limit, cursor)

// Response: { items: [...], nextCursor: "...", prevCursor: "..." }
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/yourusername/adonisjs-cursor-paginator#readme)
- 🐛 [Issue Tracker](https://github.com/yourusername/adonisjs-cursor-paginator/issues)
- 💬 [Discussions](https://github.com/yourusername/adonisjs-cursor-paginator/discussions)
