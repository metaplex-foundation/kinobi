# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kinobi is a TypeScript library that generates powerful clients for Solana programs. It takes IDL (Interface Definition Language) files as input and generates client code for JavaScript/TypeScript and Rust.

## Key Commands

### Building and Testing
- `pnpm build` - Build the project (TypeScript compilation + copy Nunjucks templates)
- `pnpm test` - Run full test suite (unit tests + integration tests for JS/Rust clients)
- `pnpm test:js` - Test JavaScript client generation only
- `pnpm test:js-experimental` - Test experimental JavaScript client generation
- `pnpm test:rust` - Test Rust client generation only

### Code Quality
- `pnpm lint` - Run linting (prettier + eslint)
- `pnpm lint:fix` - Fix linting issues automatically

### Single Test Execution
- `pnpm ava test/path/to/file.test.ts` - Run specific test file
- `pnpm ava test/path/to/file.test.ts -m "test name"` - Run specific test

### Documentation
- `pnpm build:docs` - Generate TypeDoc documentation

### Publishing
- `pnpm package:change` - Create changeset for version bump
- `pnpm package:version` - Update version based on changesets
- `pnpm package:publish` - Publish to npm (includes lint + build)

## Architecture

### Core Concepts

**Node System**: Kinobi uses a node-based architecture where everything is represented as nodes in a tree structure:
- **Root Node**: Contains all programs
- **Program Node**: Represents a Solana program with accounts, instructions, types, errors, and PDAs
- **Type Nodes**: Represent data types (structs, enums, arrays, etc.)
- **Instruction Nodes**: Represent program instructions with arguments and accounts
- **Account Nodes**: Represent program accounts
- **Value Nodes**: Represent concrete values and defaults

**Visitor Pattern**: The core processing mechanism uses the visitor pattern extensively:
- All transformations are implemented as visitors
- Visitors traverse the node tree and can read/transform nodes
- Key visitor types: transformers, mappers, static visitors, void visitors

### Key Directories

- `src/nodes/` - All node type definitions and factory functions
- `src/visitors/` - Node transformation and processing logic
- `src/renderers/` - Code generation for different targets (JS, Rust)
- `src/idl/` - IDL parsing and type definitions
- `src/shared/` - Utility functions and shared types

### Code Generation Flow

1. **Parse IDL** → Create node tree from IDL files
2. **Transform** → Apply visitors to modify/enhance the tree
3. **Render** → Generate target code using Nunjucks templates

### Template System

Uses Nunjucks templates for code generation:
- Templates are in `src/renderers/{target}/templates/`
- Templates are copied to `dist/` during build
- Each renderer (js, js-experimental, rust) has its own template set

## Development Notes

### Node Creation
- Use factory functions (e.g., `accountNode()`, `instructionNode()`) to create nodes
- Nodes are immutable - use visitors to create modified versions

### Visitor Development
- Extend base visitor classes like `bottomUpTransformerVisitor` or `topDownTransformerVisitor`
- Use `visit()` function to apply visitors to nodes
- Visitors can be chained using `pipe()` utility

### Testing
- Unit tests use AVA testing framework
- Integration tests generate actual client code in `test/packages/`
- Test files follow pattern `*.test.ts`

### Code Style
- Uses ESLint with Airbnb TypeScript config
- Prettier for code formatting
- Disabled rules: cycle imports, use-before-define, underscore dangle

### Type Safety
- Heavily uses TypeScript's type system
- Node types are strictly typed with discriminated unions
- Visitor functions are type-safe based on node kinds