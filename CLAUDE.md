# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kinobi is a code generator for Solana programs that generates type-safe client code from IDL (Interface Definition Language) files. It parses Anchor and Shank IDLs and can generate JavaScript (Umi-based), JavaScript (web3.js 2.0-based), and Rust clients.

## Development Commands

### Build
```bash
pnpm build
```
Builds the main package (TypeScript compilation) and copies Nunjucks templates. Compiles both src/ and test/ directories.

### Test Suite
```bash
pnpm test              # Run all tests
ava                    # Run only unit tests (test/**/*.test.ts)
pnpm test:js           # Test JS renderer output (Umi-based)
pnpm test:js-experimental # Test JS renderer output (web3.js 2.0)
pnpm test:rust         # Test Rust renderer output
```

### Linting
```bash
pnpm lint              # Check code style
pnpm lint:fix          # Fix code style issues
```

### Testing Single Files
For ava tests, use the pattern:
```bash
npx ava test/path/to/file.test.ts
```

## Architecture

### Core Concepts

**Node System**: The entire codebase is built around a strongly-typed node tree structure (src/nodes/). Every element of a Solana program (accounts, instructions, types, PDAs, etc.) is represented as a node with a specific `kind` field.

**Visitor Pattern**: All transformations and code generation use the visitor pattern (src/visitors/). Visitors traverse the node tree and either:
- Transform nodes (return modified nodes)
- Extract information (return analysis results)
- Generate code (create render maps)

**IDL Parsing**: IDL files (Anchor or Shank format) are parsed into the internal node tree via `rootNodeFromIdls()` (src/nodes/RootNode.ts).

### Key Directories

- **src/idl/**: IDL type definitions (Anchor/Shank format)
- **src/nodes/**: Node type definitions organized by category:
  - `typeNodes/`: Type system nodes (NumberTypeNode, StructTypeNode, etc.)
  - `contextualValueNodes/`: Values with context (AccountValueNode, ArgumentValueNode)
  - `discriminatorNodes/`: Account/instruction discriminators
  - `linkNodes/`: References between nodes
  - `pdaSeedNodes/`: PDA seed definitions
- **src/visitors/**: Transformation and analysis visitors
- **src/renderers/**: Code generation for different targets:
  - `js/`: Umi-based JavaScript client generator (uses Nunjucks templates)
  - `js-experimental/`: web3.js 2.0 client generator (uses TypeScript fragments)
  - `rust/`: Rust client generator (uses Nunjucks templates)
- **src/shared/**: Utilities (logging, file operations, string helpers)

### Renderer Architecture

Each renderer follows this pattern:
1. **getRenderMapVisitor**: Visits nodes and builds a map of {filepath: content}
2. **getTypeManifestVisitor**: Analyzes types and generates type information
3. **renderValueNodeVisitor**: Converts value nodes to target language syntax
4. **Templates/Fragments**: Nunjucks templates (.njk) or TypeScript fragments generate the final code

**Template Handling**: Nunjucks templates are copied from src/ to dist/ during build via the `build:njk` script. Templates must be available in dist/ for the renderer to work.

### Kinobi Main API

The `Kinobi` interface (src/Kinobi.ts) provides the main API:
- `createFromIdls(idls)`: Create from IDL files
- `createFromRoot(root)`: Create from node tree
- `getRoot()`: Get the root node
- `accept(visitor)`: Run a visitor and return its result
- `update(visitor)`: Transform the tree in-place with a visitor

### Common Workflows

**Adding a new type node**:
1. Create node definition in src/nodes/typeNodes/
2. Register in REGISTERED_TYPE_NODES (src/nodes/typeNodes/TypeNode.ts)
3. Add visitor support in identityVisitor.ts
4. Implement rendering in each renderer's getTypeManifestVisitor

**Creating a transformation visitor**:
- Extend `identityVisitor()` for transformations that return nodes
- Use `bottomUpTransformerVisitor()` or `topDownTransformerVisitor()` for tree traversal
- Return `null` to delete nodes

### Testing Structure

- **test/**: Unit tests for visitors and core functionality
- **test/packages/**: Integration tests that generate and compile full clients
  - Each package tests a renderer by generating code and running build/lint
  - Tests ensure generated code compiles and passes linting

### Important Notes

- All nodes have a `kind` field that ends in `Node` (e.g., `structTypeNode`)
- Visitor functions are named `visit` + PascalCase of kind without `Node` suffix (e.g., `visitStruct`)
- The `defaultVisitor()` applies standard transformations when creating Kinobi instances
- IDLs can be from Anchor or Shank (detected via metadata.origin field)
- The library uses CommonJS module format (module: "commonjs" in tsconfig.json)
