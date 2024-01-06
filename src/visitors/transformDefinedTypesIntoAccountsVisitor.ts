import { accountNode, assertIsNode, programNode } from '../nodes';
import { pipe } from '../shared';
import { extendVisitor } from './extendVisitor';
import { nonNullableIdentityVisitor } from './nonNullableIdentityVisitor';

export function transformDefinedTypesIntoAccountsVisitor(
  definedTypes: string[]
) {
  return pipe(nonNullableIdentityVisitor(['rootNode', 'programNode']), (v) =>
    extendVisitor(v, {
      visitProgram(program) {
        const typesToExtract = program.definedTypes.filter((node) =>
          definedTypes.includes(node.name)
        );

        const newDefinedTypes = program.definedTypes.filter(
          (node) => !definedTypes.includes(node.name)
        );

        const newAccounts = typesToExtract.map((node) => {
          assertIsNode(node.type, 'structTypeNode');
          return accountNode({
            ...node,
            data: node.type,
            size: undefined,
            discriminators: [],
          });
        });

        return programNode({
          ...program,
          accounts: [...program.accounts, ...newAccounts],
          definedTypes: newDefinedTypes,
        });
      },
    })
  );
}
