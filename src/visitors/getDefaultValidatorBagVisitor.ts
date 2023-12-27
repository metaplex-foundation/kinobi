import { DefinedTypeNode, getAllDefinedTypes } from '../nodes';
import { NodeStack, ValidatorBag, mainCase } from '../shared';
import { getResolvedInstructionInputsVisitor } from './getResolvedInstructionInputsVisitor';
import { VisitorInterceptor, interceptVisitor } from './interceptVisitor';
import { mergeVisitor } from './mergeVisitor';
import { Visitor, visit } from './visitor';

export function getDefaultValidatorBagVisitor(
  definedTypes: DefinedTypeNode[] = []
): Visitor<ValidatorBag> {
  const definedTypeNames = new Set<string>(
    definedTypes.map((type) => type.name)
  );
  const stack = new NodeStack();
  const interceptor: VisitorInterceptor<ValidatorBag> = (fn) => (node) => {
    stack.push(node);
    const newNode = fn(node);
    stack.pop();
    return newNode;
  };
  const visitor = interceptVisitor(
    mergeVisitor(
      () => new ValidatorBag(),
      (_, bags) => new ValidatorBag().mergeWith(bags)
    ),
    interceptor
  );
  const baseVisitor = { ...visitor };

  visitor.visitRoot = (node) => {
    // Register defined types to make sure links are valid.
    getAllDefinedTypes(node).forEach((type) => definedTypeNames.add(type.name));
    return baseVisitor.visitRoot.bind(visitor)(node);
  };

  visitor.visitProgram = (node) => {
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
    return bag.mergeWith([baseVisitor.visitProgram.bind(visitor)(node)]);
  };

  visitor.visitAccount = (node) => {
    const bag = new ValidatorBag();
    if (!node.name) {
      bag.error('Account has no name.', node, stack);
    }
    return bag.mergeWith([baseVisitor.visitAccount.bind(visitor)(node)]);
  };

  visitor.visitInstruction = (node) => {
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
      ...node.dataArgs.struct.fields.map(({ name }) => mainCase(name)),
      ...node.extraArgs.struct.fields.map(({ name }) => mainCase(name)),
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
    Object.entries(node.argDefaults).forEach(([name, defaultsTo]) => {
      if (defaultsTo.kind === 'accountBump') {
        const defaultAccount = node.accounts.find(
          (account) => account.name === defaultsTo.name
        );
        if (defaultAccount && defaultAccount.isSigner !== false) {
          bag.error(
            `Argument ${name} cannot default to the bump attribute of ` +
              `the [${defaultsTo.name}] account as it may be a Signer.`,
            node,
            stack
          );
        }
      }
    });

    return bag.mergeWith([baseVisitor.visitInstruction.bind(visitor)(node)]);
  };

  visitor.visitDefinedType = (node) => {
    const bag = new ValidatorBag();
    if (!node.name) {
      bag.error('Defined type has no name.', node, stack);
    }
    return bag.mergeWith([baseVisitor.visitDefinedType.bind(visitor)(node)]);
  };

  visitor.visitError = (node) => {
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
    return bag.mergeWith([baseVisitor.visitError.bind(visitor)(node)]);
  };

  visitor.visitLinkType = (node) => {
    const bag = new ValidatorBag();
    if (!node.name) {
      bag.error('Pointing to a defined type with no name.', node, stack);
    } else if (
      node.importFrom === 'generated' &&
      !definedTypeNames.has(node.name)
    ) {
      bag.error(
        `Pointing to a missing defined type named "${node.name}"`,
        node,
        stack
      );
    }
    return bag.mergeWith([baseVisitor.visitLinkType.bind(visitor)(node)]);
  };

  visitor.visitEnumType = (node) => {
    const bag = new ValidatorBag();
    if (node.variants.length === 0) {
      bag.warn('Enum has no variants.', node, stack);
    }
    node.variants.forEach((variant) => {
      if (!variant.name) {
        bag.error('Enum variant has no name.', node, stack);
      }
    });
    return bag.mergeWith([baseVisitor.visitEnumType.bind(visitor)(node)]);
  };

  visitor.visitEnumEmptyVariantType = (node) => {
    const bag = new ValidatorBag();
    if (!node.name) {
      bag.error('Enum variant has no name.', node, stack);
    }
    return bag.mergeWith([
      baseVisitor.visitEnumEmptyVariantType.bind(visitor)(node),
    ]);
  };

  visitor.visitEnumStructVariantType = (node) => {
    const bag = new ValidatorBag();
    if (!node.name) {
      bag.error('Enum variant has no name.', node, stack);
    }
    return bag.mergeWith([
      baseVisitor.visitEnumStructVariantType.bind(visitor)(node),
    ]);
  };

  visitor.visitEnumTupleVariantType = (node) => {
    const bag = new ValidatorBag();
    if (!node.name) {
      bag.error('Enum variant has no name.', node, stack);
    }
    return bag.mergeWith([
      baseVisitor.visitEnumTupleVariantType.bind(visitor)(node),
    ]);
  };

  visitor.visitStructType = (node) => {
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
    return bag.mergeWith([baseVisitor.visitStructType.bind(visitor)(node)]);
  };

  visitor.visitStructFieldType = (node) => {
    const bag = new ValidatorBag();
    if (!node.name) {
      bag.error('Struct field has no name.', node, stack);
    }
    return bag.mergeWith([
      baseVisitor.visitStructFieldType.bind(visitor)(node),
    ]);
  };

  visitor.visitTupleType = (node) => {
    const bag = new ValidatorBag();
    if (node.children.length === 0) {
      bag.warn('Tuple has no items.', node, stack);
    }
    return bag.mergeWith([baseVisitor.visitTupleType.bind(visitor)(node)]);
  };

  return visitor;
}
