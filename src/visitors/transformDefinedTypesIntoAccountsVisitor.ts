import {
  accountDataNode,
  accountNode,
  assertIsNode,
  programNode,
} from '../nodes';
import { pipe } from '../shared';
import { extendVisitor } from './extendVisitor';
import { identityVisitor } from './identityVisitor';

export function transformDefinedTypesIntoAccountsVisitor(
  definedTypes: string[]
) {
  return pipe(identityVisitor(['rootNode', 'programNode']), (v) =>
    extendVisitor(v, {
      visitProgram(program) {
        const typesToExtract = program.definedTypes.filter((node) =>
          definedTypes.includes(node.name)
        );

        const newDefinedTypes = program.definedTypes.filter(
          (node) => !definedTypes.includes(node.name)
        );

        const newAccounts = typesToExtract.map((node) => {
          assertIsNode(node.data, 'structTypeNode');
          return accountNode({
            ...node,
            data: accountDataNode({
              name: `${node.name}AccountData`,
              struct: node.data,
            }),
            size: undefined,
            discriminator: undefined,
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
