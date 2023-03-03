import * as nodes from '../../nodes';
import { mainCase } from '../../utils';
import { BaseNodeVisitor } from '../BaseNodeVisitor';
import { Dependency } from '../Dependency';

export type CustomAccountSerializerOptions = {
  name: string;
  dependency: Dependency;
  extract: boolean;
  extractAs: string;
  extractedTypeShouldBeInternal: boolean;
};

export class UseCustomAccountSerializerVisitor extends BaseNodeVisitor {
  readonly map: Record<string, CustomAccountSerializerOptions>;

  constructor(
    map: Record<string, true | Partial<CustomAccountSerializerOptions>>
  ) {
    super();
    this.map = Object.entries(map).reduce(
      (acc, [selector, options]) => ({
        ...acc,
        [mainCase(selector)]: parseLink(selector, options),
      }),
      {} as Record<string, CustomAccountSerializerOptions>
    );
  }

  visitProgram(program: nodes.ProgramNode): nodes.Node {
    const newDefinedTypes = program.definedTypes;

    program.accounts.forEach((account) => {
      const options: CustomAccountSerializerOptions | null =
        this.map[account.name] ?? null;
      if (!options || !options.extract) return;
      if (nodes.isTypeDefinedLinkNode(account.type)) return;
      const newType = new nodes.DefinedTypeNode(
        {
          name: options.extractAs,
          idlName: account.metadata.idlName,
          docs: account.metadata.docs,
          internal: options.extractedTypeShouldBeInternal,
        },
        account.type
      );
      newDefinedTypes.push(newType);
    });

    return new nodes.ProgramNode(
      program.metadata,
      program.accounts
        .map((account) => account.accept(this))
        .filter(nodes.assertNodeFilter(nodes.assertAccountNode)),
      program.instructions,
      newDefinedTypes,
      program.errors
    );
  }

  visitAccount(account: nodes.AccountNode): nodes.Node {
    const options: CustomAccountSerializerOptions | null =
      this.map[account.name] ?? null;
    if (!options) return account;
    return new nodes.AccountNode(
      account.metadata,
      new nodes.TypeDefinedLinkNode(options.name, {
        dependency: options.dependency,
      })
    );
  }
}

function parseLink(
  name: string,
  link: true | Partial<CustomAccountSerializerOptions>
): CustomAccountSerializerOptions {
  const defaultOptions = {
    name: `${name}AccountData`,
    dependency: 'hooked',
    extract: false,
    extractAs: `${name}AccountData`,
    extractedTypeShouldBeInternal: true,
  };
  const options =
    typeof link === 'boolean' ? defaultOptions : { ...defaultOptions, ...link };

  return {
    ...options,
    name: mainCase(options.name),
    extractAs: mainCase(options.extractAs),
  };
}
