# Contributing to AdonisJS Cursor Paginator

Thank you for your interest in contributing to AdonisJS Cursor Paginator! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Git

### Getting Started

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/yourusername/adonisjs-cursor-paginator.git
   cd adonisjs-cursor-paginator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## Development Workflow

### Project Structure

```
adonisjs-cursor-paginator/
├── src/                    # Source code
│   ├── cursor_paginator.ts # Main paginator class
│   ├── provider.ts         # AdonisJS provider
│   ├── types.ts           # Type definitions
│   ├── bindings.ts        # Module augmentation
│   └── index.ts           # Main exports
├── tests/                 # Test files
├── build/                 # Compiled output
└── README.md             # Documentation
```

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run build
   npm test
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Adding or updating tests
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `chore:` - Maintenance tasks

Examples:
```
feat: add support for custom cursor encoding
fix: handle edge case in multi-column sorting
docs: update README with new examples
test: add tests for cursor generation
```

## Code Style

### TypeScript Guidelines

- Use TypeScript for all code
- Provide proper type annotations
- Use interfaces for object types
- Export types that consumers might need

### Code Formatting

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multiline objects/arrays
- Use semicolons

### Documentation

- Add JSDoc comments for public methods
- Include parameter and return type descriptions
- Provide usage examples for complex functionality

Example:
```typescript
/**
 * Generate a cursor string from column values
 * @param columns - Column configuration object
 * @param item - Data item to generate cursor from
 * @param pointToNext - Whether cursor points to next page
 * @returns Base64 encoded cursor string
 */
private static genCursor(columns: TColumns, item: any, pointToNext: boolean = false): string {
  // Implementation
}
```

## Testing

### Writing Tests

- Write tests for all new functionality
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies

### Test Structure

```typescript
import { test } from 'node:test'
import assert from 'node:assert'

test('Feature - should do something specific', async () => {
  // Arrange
  const input = { /* test data */ }
  
  // Act
  const result = await someFunction(input)
  
  // Assert
  assert.strictEqual(result.property, expectedValue)
})
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
node --loader=ts-node/esm ./tests/specific.test.ts
```

## Pull Request Process

1. **Ensure your branch is up to date**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Create a pull request**
   - Use a descriptive title
   - Explain what changes you made and why
   - Reference any related issues
   - Include screenshots for UI changes

3. **Pull request template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   - [ ] Tests pass locally
   - [ ] Added tests for new functionality
   
   ## Checklist
   - [ ] Code follows project style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated if needed
   ```

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

- **Environment**: Node.js version, AdonisJS version, package version
- **Steps to reproduce**: Minimal code example
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Error messages**: Full error stack traces

### Feature Requests

When requesting features, please include:

- **Use case**: Why is this feature needed?
- **Proposed solution**: How should it work?
- **Alternatives**: Other ways to achieve the same goal
- **Examples**: Code examples of proposed API

## Release Process

Releases are handled by maintainers:

1. Version bump following [Semantic Versioning](https://semver.org/)
2. Update CHANGELOG.md
3. Create GitHub release
4. Publish to npm

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or deliberately disruptive behavior
- Publishing private information without permission
- Any conduct that would be inappropriate in a professional setting

### Enforcement

Project maintainers are responsible for clarifying standards and will take appropriate action in response to unacceptable behavior.

## Getting Help

- 📖 [Documentation](README.md)
- 🐛 [Issue Tracker](https://github.com/yourusername/adonisjs-cursor-paginator/issues)
- 💬 [Discussions](https://github.com/yourusername/adonisjs-cursor-paginator/discussions)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributors graph

Thank you for contributing to AdonisJS Cursor Paginator! 🎉
