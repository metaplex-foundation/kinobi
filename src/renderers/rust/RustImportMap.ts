import type { ImportFrom } from '../../shared';
import { RustTypeManifest } from './getTypeManifestVisitor';

const DEFAULT_MODULE_MAP: Record<string, string> = {
  generated: 'crate::generated',
  generatedAccounts: 'crate::generated::accounts',
  generatedTypes: 'crate::generated::types',
  generatedErrors: 'crate::generated::errors',
  hooked: 'crate::hooked',
  mplEssentials: 'mpl_toolbox',
  mplToolbox: 'mpl_toolbox',
};

export class RustImportMap {
  protected readonly _imports: Set<string> = new Set();

  protected readonly _aliases: Map<string, string> = new Map();

  get imports(): Set<string> {
    return this._imports;
  }

  get aliases(): Map<string, string> {
    return this._aliases;
  }

  add(imports: string | string[] | Set<string>): RustImportMap {
    const newImports = typeof imports === 'string' ? [imports] : imports;
    newImports.forEach((i) => this._imports.add(i));
    return this;
  }

  remove(imports: string | string[] | Set<string>): RustImportMap {
    const importsToRemove = typeof imports === 'string' ? [imports] : imports;
    importsToRemove.forEach((i) => this._imports.delete(i));
    return this;
  }

  mergeWith(...others: RustImportMap[]): RustImportMap {
    others.forEach((other) => {
      this.add(other._imports);
      other._aliases.forEach((alias, importName) =>
        this.addAlias(importName, alias)
      );
    });
    return this;
  }

  mergeWithManifest(manifest: RustTypeManifest): RustImportMap {
    return this.mergeWith(manifest.imports);
  }

  addAlias(importName: string, alias: string): RustImportMap {
    this._aliases.set(importName, alias);
    return this;
  }

  isEmpty(): boolean {
    return this._imports.size === 0;
  }

  resolveDependencyMap(
    dependencies: Record<ImportFrom, string>
  ): RustImportMap {
    const dependencyMap = { ...DEFAULT_MODULE_MAP, ...dependencies };
    const newImportMap = new RustImportMap();
    const resolveDependency = (i: string): string => {
      const dependencyKey = Object.keys(dependencyMap).find((key) =>
        i.startsWith(`${key}::`)
      );
      if (!dependencyKey) return i;
      const dependencyValue = dependencyMap[dependencyKey];
      return dependencyValue + i.slice(dependencyKey.length);
    };
    this._imports.forEach((i) => newImportMap.add(resolveDependency(i)));
    this._aliases.forEach((alias, i) =>
      newImportMap.addAlias(resolveDependency(i), alias)
    );
    return newImportMap;
  }

  toString(dependencies: Record<ImportFrom, string>): string {
    const resolvedMap = this.resolveDependencyMap(dependencies);
    const importStatements = [...resolvedMap.imports].map((i) => {
      const alias = resolvedMap.aliases.get(i);
      if (alias) return `use ${i} as ${alias};`;
      return `use ${i};`;
    });
    return importStatements.join('\n');
  }
}
