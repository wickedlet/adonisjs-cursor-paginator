# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- Initial release of AdonisJS Cursor Paginator
- Cursor-based pagination for Lucid ORM models
- Support for both ModelQueryBuilder and DatabaseQueryBuilder
- Bi-directional pagination (next/previous)
- Multi-column sorting support
- TypeScript definitions and type safety
- AdonisJS provider for seamless integration
- Comprehensive documentation and examples
- Unit tests for core functionality

### Features
- **High Performance**: Cursor-based pagination scales better than offset-based pagination
- **Bi-directional**: Support for both forward and backward pagination
- **Multi-column Sorting**: Support for complex sorting with multiple columns
- **Type Safe**: Full TypeScript support with proper type definitions
- **Easy Integration**: Seamless integration with AdonisJS Lucid ORM
- **Real-time Friendly**: Consistent results even when data changes

### API
- `cursorPaginate(limit: number, cursor?: string | null): Promise<CursorPaginator<T>>`
- Returns object with `items`, `nextCursor`, and `prevCursor` properties

### Usage
```typescript
const paginator = await User.query()
  .where('active', true)
  .orderBy('created_at', 'desc')
  .orderBy('id', 'desc')
  .cursorPaginate(10, cursor)
```
