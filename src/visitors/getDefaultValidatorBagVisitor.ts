import { getAllInstructionArguments, isNode } from '../nodes';
import {
  LinkableDictionary,
  NodeStack,
  ValidatorBag,
  mainCase,
  pipe,
} from '../shared';
import { extendVisitor } from './extendVisitor';
import { getResolvedInstructionInputsVisitor } from './getResolvedInstructionInputsVisitor';
import { mergeVisitor } from './mergeVisitor';
import { recordLinkablesVisitor } from './recordLinkablesVisitor';
import { recordNodeStackVisitor } from './recordNodeStackVisitor';
import { Visitor, visit } from './visitor';

export function getDefaultValidatorBagVisitor(): Visitor<ValidatorBag> {
  const linkables = new LinkableDictionary();
  const stack = new NodeStack();

  return pipe(
    mergeVisitor(
      () => new ValidatorBag(),
      (_, bags) => new ValidatorBag().mergeWith(bags)
    ),
    (v) => recordLinkablesVisitor(v, linkables),
    (v) => recordNodeStackVisitor(v, stack),
    (v) =>
      extendVisitor(v, {
        visitProgram(node, { next }) {
          const bag = new ValidatorBag();
          if (!node.name) {
            bag.error('Program has no name.', node, stack);
          }
          if (!node.publicKey) {
            bag.error('Program has no public key.', node, stack);
          }
          if (!node.version) {
            bag.warn('Program has no version.', node, stack);
          }
          if (!node.origin) {
            bag.info('Program has no origin.', node, stack);
          }
          return bag.mergeWith([next(node)]);
        },

        visitAccount(node, { next }) {
          const bag = new ValidatorBag();
          if (!node.name) {
            bag.error('Account has no name.', node, stack);
          }
          return bag.mergeWith([next(node)]);
        },

        visitInstruction(node, { next }) {
          const bag = new ValidatorBag();
          if (!node.name) {
            bag.error('Instruction has no name.', node, stack);
          }

          // Check for duplicate account names.
          const accountNameHistogram = new Map<string, number>();
          node.accounts.forEach((account) => {
            if (!account.name) {
              bag.error('Instruction account has no name.', node, stack);
              return;
            }
            const count = (accountNameHistogram.get(account.name) ?? 0) + 1;
            accountNameHistogram.set(account.name, count);
            // Only throw an error once per duplicated names.
            if (count === 2) {
              bag.error(
                `Account name "${account.name}" is not unique in instruction "${node.name}".`,
                node,
                stack
              );
            }
          });

          // Check for cyclic dependencies in account defaults.
          const cyclicCheckVisitor = getResolvedInstructionInputsVisitor();
          try {
            visit(node, cyclicCheckVisitor);
          } catch (error) {
            bag.error((error as Error).message, node, stack);
          }

          // Check args.
          const names = [
            ...node.arguments.map(({ name }) => mainCase(name)),
            ...(node.extraArguments ?? []).map(({ name }) => mainCase(name)),
          ];
          const duplicates = names.filter((e, i, a) => a.indexOf(e) !== i);
          const uniqueDuplicates = [...new Set(duplicates)];
          const hasConflictingNames = uniqueDuplicates.length > 0;
          if (hasConflictingNames) {
            bag.error(
              `The names of the following instruction arguments are conflicting: ` +
                `[${uniqueDuplicates.join(', ')}].`,
              node,
              stack
            );
          }

          // Check arg defaults.
          getAllInstructionArguments(node).forEach((argument) => {
            const { defaultValue } = argument;
            if (isNode(defaultValue, 'accountBumpValueNode')) {
              const defaultAccount = node.accounts.find(
                (account) => account.name === defaultValue.name
              );
              if (defaultAccount && defaultAccount.isSigner !== false) {
                bag.error(
                  `Argument ${argument.name} cannot default to the bump attribute of ` +
                    `the [${defaultValue.name}] account as it may be a Signer.`,
                  node,
                  stack
                );
              }
            }
          });

          return bag.mergeWith([next(node)]);
        },

        visitDefinedType(node, { next }) {
          const bag = new ValidatorBag();
          if (!node.name) {
            bag.error('Defined type has no name.', node, stack);
          }
          return bag.mergeWith([next(node)]);
        },

        visitError(node, { next }) {
          const bag = new ValidatorBag();
          if (!node.name) {
            bag.error('Error has no name.', node, stack);
          }
          if (typeof node.code !== 'number') {
            bag.error('Error has no code.', node, stack);
          }
          if (!node.message) {
            bag.warn('Error has no message.', node, stack);
          }
          return bag.mergeWith([next(node)]);
        },

        visitDefinedTypeLink(node, { next }) {
          const bag = new ValidatorBag();
          if (!node.name) {
            bag.error('Pointing to a defined type with no name.', node, stack);
          } else if (!node.importFrom && !linkables.has(node)) {
            bag.error(
              `Pointing to a missing defined type named "${node.name}"`,
              node,
              stack
            );
          }
          return bag.mergeWith([next(node)]);
        },

        visitEnumType(node, { next }) {
          const bag = new ValidatorBag();
          if (node.variants.length === 0) {
            bag.warn('Enum has no variants.', node, stack);
          }
          node.variants.forEach((variant) => {
            if (!variant.name) {
              bag.error('Enum variant has no name.', node, stack);
            }
          });
          return bag.mergeWith([next(node)]);
        },

        visitEnumEmptyVariantType(node, { next }) {
          const bag = new ValidatorBag();
          if (!node.name) {
            bag.error('Enum variant has no name.', node, stack);
          }
          return bag.mergeWith([next(node)]);
        },

        visitEnumStructVariantType(node, { next }) {
          const bag = new ValidatorBag();
          if (!node.name) {
            bag.error('Enum variant has no name.', node, stack);
          }
          return bag.mergeWith([next(node)]);
        },

        visitEnumTupleVariantType(node, { next }) {
          const bag = new ValidatorBag();
          if (!node.name) {
            bag.error('Enum variant has no name.', node, stack);
          }
          return bag.mergeWith([next(node)]);
        },

        visitStructType(node, { next }) {
          const bag = new ValidatorBag();

          // Check for duplicate field names.
          const fieldNameHistogram = new Map<string, number>();
          node.fields.forEach((field) => {
            if (!field.name) return; // Handled by TypeStructField
            const count = (fieldNameHistogram.get(field.name) ?? 0) + 1;
            fieldNameHistogram.set(field.name, count);
            // Only throw an error once per duplicated names.
            if (count === 2) {
              bag.error(
                `Struct field name "${field.name}" is not unique.`,
                field,
                stack
              );
            }
          });
          return bag.mergeWith([next(node)]);
        },

        visitStructFieldType(node, { next }) {
          const bag = new ValidatorBag();
          if (!node.name) {
            bag.error('Struct field has no name.', node, stack);
          }
          return bag.mergeWith([next(node)]);
        },

        visitTupleType(node, { next }) {
          const bag = new ValidatorBag();
          if (node.items.length === 0) {
            bag.warn('Tuple has no items.', node, stack);
          }
          return bag.mergeWith([next(node)]);
        },
      })
  );
}
