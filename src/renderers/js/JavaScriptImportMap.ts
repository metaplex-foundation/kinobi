const DEFAULT_MODULE_MAP: Record<string, string> = {
  // core: '@metaplex-foundation/js-core',
  core: '@lorisleiva/js-core',
  types: '../types',
  errors: '../errors',
};

export class JavaScriptImportMap {
  protected readonly _imports: Map<string, Set<string>> = new Map();

  add(
    module: string,
    dependencies: string | string[] | Set<string>
  ): JavaScriptImportMap {
    const currentDependencies = this._imports.get(module) ?? new Set();
    const newDependencies =
      typeof dependencies === 'string' ? [dependencies] : dependencies;
    newDependencies.forEach((dependency) =>
      currentDependencies.add(dependency)
    );
    this._imports.set(module, currentDependencies);
    return this;
  }

  remove(
    module: string,
    dependencies: string | string[] | Set<string>
  ): JavaScriptImportMap {
    const currentDependencies = this._imports.get(module) ?? new Set();
    const dependenciesToRemove =
      typeof dependencies === 'string' ? [dependencies] : dependencies;
    dependenciesToRemove.forEach((dependency) =>
      currentDependencies.delete(dependency)
    );
    if (currentDependencies.size === 0) {
      this._imports.delete(module);
    } else {
      this._imports.set(module, currentDependencies);
    }
    return this;
  }

  mergeWith(...others: JavaScriptImportMap[]): JavaScriptImportMap {
    others.forEach((other) => {
      other._imports.forEach((dependencies, module) => {
        this.add(module, dependencies);
      });
    });
    return this;
  }

  isEmpty(): boolean {
    return this._imports.size === 0;
  }

  toString(modules: Record<string, string> = {}): string {
    const moduleMap = { ...DEFAULT_MODULE_MAP, ...modules };
    const importStatements = Array.from(
      this._imports.entries(),
      ([module, dependencies]) => {
        const joinedDeps = Array.from(dependencies).sort().join(', ');
        const mappedModule: string = moduleMap[module] ?? module;
        return `import { ${joinedDeps} } from '${mappedModule}';`;
      }
    );
    return importStatements.join('\n');
  }
}
