import { ConfigureOptions } from 'nunjucks';
import { ImportFrom } from '../../../shared';
import { resolveTemplate } from '../../utils';
import { ImportMap } from '../ImportMap';
import { ContextMap } from '../ContextMap';

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

export function fragmentWithContextMap(
  render: string,
  imports?: ImportMap
): Fragment & { interfaces: ContextMap } {
  const f = fragment(render, imports) as Fragment & { interfaces: ContextMap };
  f.interfaces = new ContextMap();
  return f;
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

  setRender(render: string): this {
    this.render = render;
    return this;
  }

  mapRender(fn: (render: string) => string): this {
    this.render = fn(this.render);
    return this;
  }

  addImports(
    module: ImportFrom,
    imports: string | string[] | Set<string>
  ): this {
    this.imports.add(module, imports);
    return this;
  }

  removeImports(
    module: ImportFrom,
    imports: string | string[] | Set<string>
  ): this {
    this.imports.remove(module, imports);
    return this;
  }

  mergeImportsWith(...others: (ImportMap | Fragment)[]): this {
    this.imports.mergeWith(...others);
    return this;
  }

  addImportAlias(module: ImportFrom, name: string, alias: string): this {
    this.imports.addAlias(module, name, alias);
    return this;
  }

  toString(): string {
    return this.render;
  }
}
