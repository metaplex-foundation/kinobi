import { ConfigureOptions } from 'nunjucks';
import { ImportFrom } from '../../../shared';
import { resolveTemplate } from '../../utils';
import { ImportMap } from '../ImportMap';
import { ContextInterface, ContextMap } from '../ContextMap';

export function fragment(
  render: string,
  imports?: ImportMap,
  interfaces?: ContextMap
): Fragment {
  return new Fragment(render, imports, interfaces);
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
    new ImportMap().mergeWith(...fragments),
    new ContextMap().mergeWith(...fragments)
  );
}

export class Fragment {
  public render: string;

  public imports: ImportMap;

  public interfaces: ContextMap;

  constructor(render: string, imports?: ImportMap, interfaces?: ContextMap) {
    this.render = render;
    this.imports = imports ?? new ImportMap();
    this.interfaces = interfaces ?? new ContextMap();
  }

  setRender(render: string): Fragment {
    this.render = render;
    return this;
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
    this.imports.mergeWith(...others);
    return this;
  }

  addImportAlias(module: ImportFrom, name: string, alias: string): Fragment {
    this.imports.addAlias(module, name, alias);
    return this;
  }

  addInterfaces(
    contextInterface: ContextInterface | ContextInterface[]
  ): Fragment {
    this.interfaces.add(contextInterface);
    return this;
  }

  removeInterfaces(
    contextInterface: ContextInterface | ContextInterface[]
  ): Fragment {
    this.interfaces.remove(contextInterface);
    return this;
  }

  mergeInterfacesWith(...others: (ContextMap | Fragment)[]): Fragment {
    this.interfaces.mergeWith(...others);
    return this;
  }
}
