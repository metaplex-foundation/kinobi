import { ImportFrom } from '../../shared';
import { ImportMap } from './ImportMap';

export function fragment(render: string, imports?: ImportMap): Fragment {
  return new Fragment(render, imports);
}

export class Fragment {
  public render: string;

  public imports: ImportMap;

  constructor(render: string, imports?: ImportMap) {
    this.render = render;
    this.imports = imports ?? new ImportMap();
  }

  add(module: ImportFrom, imports: string | string[] | Set<string>): Fragment {
    this.imports.add(module, imports);
    return this;
  }

  remove(
    module: ImportFrom,
    imports: string | string[] | Set<string>
  ): Fragment {
    this.imports.remove(module, imports);
    return this;
  }

  mergeImportsWith(...others: (ImportMap | Fragment)[]): Fragment {
    this.imports.mergeWith(
      ...others.map((other) => ('imports' in other ? other.imports : other))
    );
    return this;
  }

  addAlias(module: ImportFrom, name: string, alias: string): Fragment {
    this.imports.addAlias(module, name, alias);
    return this;
  }
}
