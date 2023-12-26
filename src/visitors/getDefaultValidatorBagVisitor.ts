import { DefinedTypeNode, getAllDefinedTypes } from '../nodes';
import { NodeStack, ValidatorBag } from '../shared';
import { Visitor } from './Visitor';
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

  // visitAccount(account: nodes.AccountNode): ValidatorBag {
  //   this.pushNode(account);
  //   const bag = new ValidatorBag();
  //   if (!account.name) {
  //     bag.error('Account has no name.', account, stack);
  //   }
  //   bag.mergeWith([visit(account.data, this)]);
  //   this.popNode();
  //   return bag;
  // }

  // visitAccountData(accountData: nodes.AccountDataNode): ValidatorBag {
  //   this.pushNode(accountData);
  //   const bag = new ValidatorBag();
  //   bag.mergeWith([visit(accountData.struct, this)]);
  //   if (accountData.link) bag.mergeWith([visit(accountData.link, this)]);
  //   this.popNode();
  //   return bag;
  // }

  // visitInstruction(instruction: nodes.InstructionNode): ValidatorBag {
  //   this.pushNode(instruction);
  //   const bag = new ValidatorBag();
  //   if (!instruction.name) {
  //     bag.error('Instruction has no name.', instruction, stack);
  //   }

  //   // Check for duplicate account names.
  //   const accountNameHistogram = new Map<string, number>();
  //   instruction.accounts.forEach((account) => {
  //     if (!account.name) {
  //       bag.error('Instruction account has no name.', instruction, stack);
  //       return;
  //     }
  //     const count = (accountNameHistogram.get(account.name) ?? 0) + 1;
  //     accountNameHistogram.set(account.name, count);
  //     // Only throw an error once per duplicated names.
  //     if (count === 2) {
  //       bag.error(
  //         `Account name "${account.name}" is not unique in instruction "${instruction.name}".`,
  //         instruction,
  //         stack
  //       );
  //     }
  //   });

  //   // Check for cyclic dependencies in account defaults.
  //   const cyclicCheckVisitor = new GetResolvedInstructionInputsVisitor();
  //   try {
  //     visit(instruction, cyclicCheckVisitor);
  //   } catch (error) {
  //     bag.error(
  //       cyclicCheckVisitor.getError() as string,
  //       instruction,
  //       stack
  //     );
  //   }

  //   // Check args.
  //   bag.mergeWith([visit(instruction.dataArgs, this)]);

  //   // Check extra args.
  //   bag.mergeWith([visit(instruction.extraArgs, this)]);
  //   const names = [
  //     ...instruction.dataArgs.struct.fields.map(({ name }) => mainCase(name)),
  //     ...instruction.extraArgs.struct.fields.map(({ name }) => mainCase(name)),
  //   ];
  //   const duplicates = names.filter((e, i, a) => a.indexOf(e) !== i);
  //   const uniqueDuplicates = [...new Set(duplicates)];
  //   const hasConflictingNames = uniqueDuplicates.length > 0;
  //   if (hasConflictingNames) {
  //     bag.error(
  //       `The names of the following instruction arguments are conflicting: ` +
  //         `[${uniqueDuplicates.join(', ')}].`,
  //       instruction,
  //       stack
  //     );
  //   }

  //   // Check arg defaults.
  //   Object.entries(instruction.argDefaults).forEach(([name, defaultsTo]) => {
  //     if (defaultsTo.kind === 'accountBump') {
  //       const defaultAccount = instruction.accounts.find(
  //         (account) => account.name === defaultsTo.name
  //       );
  //       if (defaultAccount && defaultAccount.isSigner !== false) {
  //         bag.error(
  //           `Argument ${name} cannot default to the bump attribute of ` +
  //             `the [${defaultsTo.name}] account as it may be a Signer.`,
  //           instruction,
  //           stack
  //         );
  //       }
  //     }
  //   });

  //   // Check sub-instructions.
  //   bag.mergeWith(instruction.subInstructions.map((ix) => visit(ix, this)));

  //   this.popNode();
  //   return bag;
  // }

  // visitInstructionAccount(
  //   instructionAccount: nodes.InstructionAccountNode
  // ): ValidatorBag {
  //   this.pushNode(instructionAccount);
  //   const bag = new ValidatorBag();
  //   this.popNode();
  //   return bag;
  // }

  // visitInstructionDataArgs(
  //   instructionDataArgs: nodes.InstructionDataArgsNode
  // ): ValidatorBag {
  //   this.pushNode(instructionDataArgs);
  //   const bag = new ValidatorBag();
  //   bag.mergeWith([visit(instructionDataArgs.struct, this)]);
  //   if (instructionDataArgs.link)
  //     bag.mergeWith([visit(instructionDataArgs.link, this)]);
  //   this.popNode();
  //   return bag;
  // }

  // visitInstructionExtraArgs(
  //   instructionExtraArgs: nodes.InstructionExtraArgsNode
  // ): ValidatorBag {
  //   this.pushNode(instructionExtraArgs);
  //   const bag = new ValidatorBag();
  //   bag.mergeWith([visit(instructionExtraArgs.struct, this)]);
  //   if (instructionExtraArgs.link)
  //     bag.mergeWith([visit(instructionExtraArgs.link, this)]);
  //   this.popNode();
  //   return bag;
  // }

  // visitDefinedType(definedType: nodes.DefinedTypeNode): ValidatorBag {
  //   this.pushNode(definedType);
  //   const bag = new ValidatorBag();
  //   if (!definedType.name) {
  //     bag.error('Defined type has no name.', definedType, stack);
  //   }
  //   bag.mergeWith([visit(definedType.data, this)]);
  //   this.popNode();
  //   return bag;
  // }

  // visitError(error: nodes.ErrorNode): ValidatorBag {
  //   this.pushNode(error);
  //   const bag = new ValidatorBag();
  //   if (!error.name) {
  //     bag.error('Error has no name.', error, stack);
  //   }
  //   if (typeof error.code !== 'number') {
  //     bag.error('Error has no code.', error, stack);
  //   }
  //   if (!error.message) {
  //     bag.warn('Error has no message.', error, stack);
  //   }
  //   this.popNode();
  //   return bag;
  // }

  // visitLinkType(linkType: nodes.LinkTypeNode): ValidatorBag {
  //   this.pushNode(linkType);
  //   const bag = new ValidatorBag();
  //   if (!linkType.name) {
  //     bag.error(
  //       'Pointing to a defined type with no name.',
  //       linkType,
  //       stack
  //     );
  //   } else if (
  //     linkType.importFrom === 'generated' &&
  //     !definedTypeNames.has(linkType.name)
  //   ) {
  //     bag.error(
  //       `Pointing to a missing defined type named "${linkType.name}"`,
  //       linkType,
  //       stack
  //     );
  //   }
  //   this.popNode();
  //   return bag;
  // }

  // visitEnumType(enumType: nodes.EnumTypeNode): ValidatorBag {
  //   this.pushNode(enumType);
  //   const bag = new ValidatorBag();
  //   if (enumType.variants.length === 0) {
  //     bag.warn('Enum has no variants.', enumType, stack);
  //   }
  //   enumType.variants.forEach((variant) => {
  //     if (!variant.name) {
  //       bag.error('Enum variant has no name.', enumType, stack);
  //     }
  //   });
  //   bag.mergeWith(enumType.variants.map((variant) => visit(variant, this)));
  //   this.popNode();
  //   return bag;
  // }

  // visitEnumEmptyVariantType(
  //   enumEmptyVariantType: nodes.EnumEmptyVariantTypeNode
  // ): ValidatorBag {
  //   this.pushNode(enumEmptyVariantType);
  //   const bag = new ValidatorBag();
  //   if (!enumEmptyVariantType.name) {
  //     bag.error('Enum variant has no name.', enumEmptyVariantType, stack);
  //   }
  //   this.popNode();
  //   return bag;
  // }

  // visitEnumStructVariantType(
  //   enumStructVariantType: nodes.EnumStructVariantTypeNode
  // ): ValidatorBag {
  //   this.pushNode(enumStructVariantType);
  //   const bag = new ValidatorBag();
  //   if (!enumStructVariantType.name) {
  //     bag.error('Enum variant has no name.', enumStructVariantType, stack);
  //   }
  //   bag.mergeWith([visit(enumStructVariantType.struct, this)]);
  //   this.popNode();
  //   return bag;
  // }

  // visitEnumTupleVariantType(
  //   enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  // ): ValidatorBag {
  //   this.pushNode(enumTupleVariantType);
  //   const bag = new ValidatorBag();
  //   if (!enumTupleVariantType.name) {
  //     bag.error('Enum variant has no name.', enumTupleVariantType, stack);
  //   }
  //   bag.mergeWith([visit(enumTupleVariantType.tuple, this)]);
  //   this.popNode();
  //   return bag;
  // }

  // visitStructType(structType: nodes.StructTypeNode): ValidatorBag {
  //   this.pushNode(structType);
  //   const bag = new ValidatorBag();

  //   // Check for duplicate field names.
  //   const fieldNameHistogram = new Map<string, number>();
  //   structType.fields.forEach((field) => {
  //     if (!field.name) return; // Handled by TypeStructField
  //     const count = (fieldNameHistogram.get(field.name) ?? 0) + 1;
  //     fieldNameHistogram.set(field.name, count);
  //     // Only throw an error once per duplicated names.
  //     if (count === 2) {
  //       bag.error(
  //         `Struct field name "${field.name}" is not unique.`,
  //         field,
  //         stack
  //       );
  //     }
  //   });

  //   bag.mergeWith(structType.fields.map((field) => visit(field, this)));
  //   this.popNode();
  //   return bag;
  // }

  // visitStructFieldType(
  //   structFieldType: nodes.StructFieldTypeNode
  // ): ValidatorBag {
  //   this.pushNode(structFieldType);
  //   const bag = new ValidatorBag();
  //   if (!structFieldType.name) {
  //     bag.error('Struct field has no name.', structFieldType, stack);
  //   }
  //   bag.mergeWith([visit(structFieldType.child, this)]);
  //   this.popNode();
  //   return bag;
  // }

  // visitTupleType(tupleType: nodes.TupleTypeNode): ValidatorBag {
  //   this.pushNode(tupleType);
  //   const bag = new ValidatorBag();
  //   if (tupleType.children.length === 0) {
  //     bag.warn('Tuple has no items.', tupleType, stack);
  //   }
  //   bag.mergeWith(tupleType.children.map((node) => visit(node, this)));
  //   this.popNode();
  //   return bag;
  // }

  return visitor;
}
