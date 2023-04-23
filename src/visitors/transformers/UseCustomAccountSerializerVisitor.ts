import * as nodes from '../../nodes';
import { mainCase } from '../../shared';
import { ImportFrom } from '../../shared/ImportFrom';
import { BaseNodeVisitor } from '../BaseNodeVisitor';
import { visit } from '../Visitor';

export type CustomAccountSerializerOptions = {
  name: string;
  importFrom: ImportFrom;
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
      const newType = nodes.definedTypeNode({
        name: options.extractAs,
        data: account.data.struct,
        idlName: account.idlName,
        docs: account.docs,
        internal: options.extractedTypeShouldBeInternal,
      });
      newDefinedTypes.push(newType);
    });

    return nodes.programNode({
      ...program,
      definedTypes: newDefinedTypes,
      accounts: program.accounts
        .map((account) => visit(account, this))
        .filter(nodes.assertNodeFilter(nodes.assertAccountNode)),
    });
  }

  visitAccount(account: nodes.AccountNode): nodes.Node {
    const options: CustomAccountSerializerOptions | null =
      this.map[account.name] ?? null;
    if (!options) return account;
    return nodes.accountNode({
      ...account,
      data: nodes.accountDataNode(
        account.data.struct,
        nodes.linkTypeNode(options.name, {
          importFrom: options.importFrom,
        })
      ),
    });
  }
}

function parseLink(
  name: string,
  link: true | Partial<CustomAccountSerializerOptions>
): CustomAccountSerializerOptions {
  const defaultOptions = {
    name: `${name}AccountData`,
    importFrom: 'hooked',
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
