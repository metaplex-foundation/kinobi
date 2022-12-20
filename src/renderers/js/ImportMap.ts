const DEFAULT_MODULE_MAP: Record<string, string> = {
  core: '@metaplex-foundation/js-core',
  types: '../types',
};

export class ImportMap {
  protected readonly _imports: Map<string, Set<string>> = new Map();

  add(module: string, dependency: string): ImportMap {
    return this.addAll(module, [dependency]);
  }

  addAll(module: string, dependencies: string[] | Set<string>): ImportMap {
    const currentDependencies = this._imports.get(module) ?? new Set();
    dependencies.forEach((dependency) => currentDependencies.add(dependency));
    this._imports.set(module, currentDependencies);
    return this;
  }

  mergeWith(...others: ImportMap[]): ImportMap {
    others.forEach((other) => {
      other._imports.forEach((dependencies, module) => {
        this.addAll(module, dependencies);
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
      },
    );
    return importStatements.join('\n');
  }
}
