import { DefinedTypeNode, getAllDefinedTypes } from '../nodes';
import { NodeStack, ValidatorBag, mainCase } from '../shared';
import { Visitor, visit } from './Visitor';
import { GetResolvedInstructionInputsVisitor } from './aggregators';
import { MergeVisitorInterceptor, mergeVisitor } from './mergeVisitor';

export function getDefaultValidatorBagVisitor(
  definedTypes: DefinedTypeNode[] = []
): Visitor<ValidatorBag> {
  const definedTypeNames = new Set<string>(
    definedTypes.map((type) => type.name)
  );
  const stack = new NodeStack();
  const intercept: MergeVisitorInterceptor<ValidatorBag> = (fn) => (node) => {
    stack.push(node);
    const newNode = fn(node);
    stack.pop();
    return newNode;
  };
  const visitor = mergeVisitor(
    () => new ValidatorBag(),
    (_, bags) => new ValidatorBag().mergeWith(bags),
    { intercept }
  );

  const baseVisitRoot = visitor.visitRoot;
  visitor.visitRoot = (node) => {
    // Register defined types to make sure links are valid.
    getAllDefinedTypes(node).forEach((type) => definedTypeNames.add(type.name));
    return baseVisitRoot(node);
  };

  const baseVisitProgram = visitor.visitProgram;
  visitor.visitProgram = (node) => {
    stack.push(node);
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
    stack.pop();
    return bag.mergeWith([baseVisitProgram(node)]);
  };

  const baseVisitAccount = visitor.visitAccount;
  visitor.visitAccount = (node) => {
    stack.push(node);
    const bag = new ValidatorBag();
    if (!node.name) {
      bag.error('Account has no name.', node, stack);
    }
    stack.pop();
    return bag.mergeWith([baseVisitAccount(node)]);
  };

  const baseVisitInstruction = visitor.visitInstruction;
  visitor.visitInstruction = (node) => {
    stack.push(node);
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
    const cyclicCheckVisitor = new GetResolvedInstructionInputsVisitor();
    try {
      visit(node, cyclicCheckVisitor);
    } catch (error) {
      bag.error(cyclicCheckVisitor.getError() as string, node, stack);
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

    stack.pop();
    return bag.mergeWith([baseVisitInstruction(node)]);
  };

  const baseVisitDefinedType = visitor.visitDefinedType;
  visitor.visitDefinedType = (node) => {
    stack.push(node);
    const bag = new ValidatorBag();
    if (!node.name) {
      bag.error('Defined type has no name.', node, stack);
    }
    stack.pop();
    return bag.mergeWith([baseVisitDefinedType(node)]);
  };

  visitor.visitError = (node) => {
    stack.push(node);
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
    stack.pop();
    return bag;
  };

  visitor.visitLinkType = (node) => {
    stack.push(node);
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
    stack.pop();
    return bag;
  };

  const baseVisitEnumType = visitor.visitEnumType;
  visitor.visitEnumType = (node) => {
    stack.push(node);
    const bag = new ValidatorBag();
    if (node.variants.length === 0) {
      bag.warn('Enum has no variants.', node, stack);
    }
    node.variants.forEach((variant) => {
      if (!variant.name) {
        bag.error('Enum variant has no name.', node, stack);
      }
    });
    stack.pop();
    return bag.mergeWith([baseVisitEnumType(node)]);
  };

  visitor.visitEnumEmptyVariantType = (node) => {
    stack.push(node);
    const bag = new ValidatorBag();
    if (!node.name) {
      bag.error('Enum variant has no name.', node, stack);
    }
    stack.pop();
    return bag;
  };

  const baseVisitEnumStructVariantType = visitor.visitEnumStructVariantType;
  visitor.visitEnumStructVariantType = (node) => {
    stack.push(node);
    const bag = new ValidatorBag();
    if (!node.name) {
      bag.error('Enum variant has no name.', node, stack);
    }
    stack.pop();
    return bag.mergeWith([baseVisitEnumStructVariantType(node)]);
  };

  const baseVisitEnumTupleVariantType = visitor.visitEnumTupleVariantType;
  visitor.visitEnumTupleVariantType = (node) => {
    stack.push(node);
    const bag = new ValidatorBag();
    if (!node.name) {
      bag.error('Enum variant has no name.', node, stack);
    }
    stack.pop();
    return bag.mergeWith([baseVisitEnumTupleVariantType(node)]);
  };

  const baseVisitStructType = visitor.visitStructType;
  visitor.visitStructType = (node) => {
    stack.push(node);
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

    stack.pop();
    return bag.mergeWith([baseVisitStructType(node)]);
  };

  const baseVisitStructFieldType = visitor.visitStructFieldType;
  visitor.visitStructFieldType = (node) => {
    stack.push(node);
    const bag = new ValidatorBag();
    if (!node.name) {
      bag.error('Struct field has no name.', node, stack);
    }
    stack.pop();
    return bag.mergeWith([baseVisitStructFieldType(node)]);
  };

  const baseVisitTupleType = visitor.visitTupleType;
  visitor.visitTupleType = (node) => {
    stack.push(node);
    const bag = new ValidatorBag();
    if (node.children.length === 0) {
      bag.warn('Tuple has no items.', node, stack);
    }
    stack.pop();
    return bag.mergeWith([baseVisitTupleType(node)]);
  };

  return visitor;
}
