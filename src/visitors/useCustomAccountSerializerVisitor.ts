import {
  accountDataNode,
  accountNode,
  assertIsNodeFilter,
  definedTypeNode,
  linkTypeNode,
  programNode,
} from '../nodes';
import { mainCase, pipe } from '../shared';
import { ImportFrom } from '../shared/ImportFrom';
import { extendVisitor } from './extendVisitor';
import { identityVisitor } from './identityVisitor';
import { visit } from './visitor';

export type CustomAccountSerializerOptions = {
  name: string;
  importFrom: ImportFrom;
  extract: boolean;
  extractAs: string;
  extractedTypeShouldBeInternal: boolean;
};

export function useCustomAccountSerializerVisitor(
  map: Record<string, true | Partial<CustomAccountSerializerOptions>>
) {
  const parsedMap = Object.entries(map).reduce(
    (acc, [selector, options]) => ({
      ...acc,
      [mainCase(selector)]: parseLink(selector, options),
    }),
    {} as Record<string, CustomAccountSerializerOptions>
  );

  return pipe(
    identityVisitor(['rootNode', 'programNode', 'accountNode']),
    (v) =>
      extendVisitor(v, {
        visitProgram(program, { self }) {
          const newDefinedTypes = program.definedTypes;

          program.accounts.forEach((account) => {
            const options: CustomAccountSerializerOptions | null =
              parsedMap[account.name] ?? null;
            if (!options || !options.extract) return;
            const newType = definedTypeNode({
              name: options.extractAs,
              data: account.data.struct,
              idlName: account.idlName,
              docs: account.docs,
              internal: options.extractedTypeShouldBeInternal,
            });
            newDefinedTypes.push(newType);
          });

          return programNode({
            ...program,
            definedTypes: newDefinedTypes,
            accounts: program.accounts
              .map((account) => visit(account, self))
              .filter(assertIsNodeFilter('accountNode')),
          });
        },

        visitAccount(account) {
          const options: CustomAccountSerializerOptions | null =
            parsedMap[account.name] ?? null;
          if (!options) return account;
          return accountNode({
            ...account,
            data: accountDataNode({
              ...account.data,
              link: linkTypeNode(options.name, {
                importFrom: options.importFrom,
              }),
            }),
          });
        },
      })
  );
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
    importFrom: mainCase(options.importFrom),
  };
}
