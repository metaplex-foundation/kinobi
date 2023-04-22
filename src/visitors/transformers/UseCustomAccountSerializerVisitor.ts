import * as nodes from '../../nodes';
import { mainCase } from '../../shared';
import { BaseNodeVisitor } from '../BaseNodeVisitor';
import { ImportFrom } from '../../shared/ImportFrom';

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
      if (nodes.isLinkTypeNode(account.type)) return;
      const newType = nodes.definedTypeNode(
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

    return nodes.programNode(
      program.metadata,
      program.accounts
        .map((account) => visit(account, this))
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
    if (nodes.isLinkTypeNode(account.type)) return account;

    let newMetadata = account.metadata;

    // Ensure the discriminator value is not lost.
    if (
      account.metadata.discriminator?.kind === 'field' &&
      account.metadata.discriminator.value === null
    ) {
      const fieldName = account.metadata.discriminator.name;
      const discriminatorField =
        account.type.fields.find((field) => field.name === fieldName) ?? null;
      const discriminatorValue = discriminatorField?.metadata.defaultsTo?.value;
      newMetadata = {
        ...account.metadata,
        discriminator: {
          ...account.metadata.discriminator,
          value: discriminatorValue ?? null,
        },
      };
    }

    return nodes.accountNode(
      newMetadata,
      nodes.linkTypeNode(options.name, {
        importFrom: options.importFrom,
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
