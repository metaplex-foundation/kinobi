import { ConfigureOptions } from 'nunjucks';
import { ImportFrom } from '../../../shared';
import { resolveTemplate } from '../../utils';
import { ImportMap } from '../ImportMap';

export function fragment(render: string, imports?: ImportMap): Fragment {
  return new Fragment(render, imports);
}

export function fragmentFromTemplate(
  fragmentFile: string,
  context?: object,
  options?: ConfigureOptions
): Fragment {
  return fragment(
    resolveTemplate(
      `${__dirname}/..`,
      `fragments/${fragmentFile}`,
      context,
      options
    )
  );
}

export function mergeFragments(
  fragments: Fragment[],
  mergeRenders: (renders: string[]) => string
): Fragment {
  return new Fragment(
    mergeRenders(fragments.map((f) => f.render)),
    new ImportMap().mergeWith(...fragments)
  );
}

export class Fragment {
  public render: string;

  public imports: ImportMap;

  constructor(render: string, imports?: ImportMap) {
    this.render = render;
    this.imports = imports ?? new ImportMap();
  }

  mapRender(fn: (render: string) => string): Fragment {
    this.render = fn(this.render);
    return this;
  }

  addImports(
    module: ImportFrom,
    imports: string | string[] | Set<string>
  ): Fragment {
    this.imports.add(module, imports);
    return this;
  }

  removeImports(
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

  addImportAlias(module: ImportFrom, name: string, alias: string): Fragment {
    this.imports.addAlias(module, name, alias);
    return this;
  }
}
