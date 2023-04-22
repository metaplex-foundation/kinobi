import * as nodes from '../../nodes';
import { mainCase } from '../../utils';
import { NodeStack } from '../NodeStack';
import { ValidatorBag } from '../ValidatorBag';
import { Visitor } from '../Visitor';
import { GetResolvedInstructionInputsVisitor } from './GetResolvedInstructionInputsVisitor';

export class GetDefaultValidatorBagVisitor implements Visitor<ValidatorBag> {
  protected stack: NodeStack = new NodeStack();

  protected program: nodes.ProgramNode | null = null;

  protected definedTypes = new Set<string>();

  visitRoot(root: nodes.RootNode): ValidatorBag {
    // Register defined types to make sure links are valid.
    root.allDefinedTypes.forEach((type) => this.definedTypes.add(type.name));

    this.pushNode(root);
    const bags = root.programs.map((program) => program.accept(this));
    this.popNode();
    return new ValidatorBag().mergeWith(bags);
  }

  visitProgram(program: nodes.ProgramNode): ValidatorBag {
    this.pushNode(program);
    const bag = new ValidatorBag();
    if (!program.metadata.name) {
      bag.error('Program has no name.', program, this.stack);
    }
    if (!program.metadata.publicKey) {
      bag.error('Program has no public key.', program, this.stack);
    }
    if (!program.metadata.version) {
      bag.warn('Program has no version.', program, this.stack);
    }
    if (!program.metadata.origin) {
      bag.info('Program has no origin.', program, this.stack);
    }
    bag.mergeWith([
      ...program.accounts.map((node) => node.accept(this)),
      ...program.instructions.map((node) => node.accept(this)),
      ...program.definedTypes.map((node) => node.accept(this)),
      ...program.errors.map((node) => node.accept(this)),
    ]);
    this.popNode();
    return bag;
  }

  visitAccount(account: nodes.AccountNode): ValidatorBag {
    this.pushNode(account);
    const bag = new ValidatorBag();
    if (!account.name) {
      bag.error('Account has no name.', account, this.stack);
    }
    bag.mergeWith([account.type.accept(this)]);
    this.popNode();
    return bag;
  }

  visitInstruction(instruction: nodes.InstructionNode): ValidatorBag {
    this.pushNode(instruction);
    const bag = new ValidatorBag();
    if (!instruction.name) {
      bag.error('Instruction has no name.', instruction, this.stack);
    }

    // Check for duplicate account names.
    const accountNameHistogram = new Map<string, number>();
    instruction.accounts.forEach((account) => {
      if (!account.name) {
        bag.error('Instruction account has no name.', instruction, this.stack);
        return;
      }
      const count = (accountNameHistogram.get(account.name) ?? 0) + 1;
      accountNameHistogram.set(account.name, count);
      // Only throw an error once per duplicated names.
      if (count === 2) {
        bag.error(
          `Account name "${account.name}" is not unique in instruction "${instruction.name}".`,
          instruction,
          this.stack
        );
      }
    });

    // Check for cyclic dependencies in account defaults.
    const cyclicCheckVisitor = new GetResolvedInstructionInputsVisitor();
    try {
      instruction.accept(cyclicCheckVisitor);
    } catch (error) {
      bag.error(
        cyclicCheckVisitor.getError() as string,
        instruction,
        this.stack
      );
    }

    // Check args.
    bag.mergeWith([instruction.args.accept(this)]);

    // Check extra args.
    if (instruction.extraArgs) {
      bag.mergeWith([instruction.extraArgs.accept(this)]);
      if (
        nodes.isStructTypeNode(instruction.args) &&
        nodes.isStructTypeNode(instruction.extraArgs)
      ) {
        const names = [
          ...instruction.args.fields.map(({ name }) => mainCase(name)),
          ...instruction.extraArgs.fields.map(({ name }) => mainCase(name)),
        ];
        const duplicates = names.filter((e, i, a) => a.indexOf(e) !== i);
        const uniqueDuplicates = [...new Set(duplicates)];
        const hasConflictingNames = uniqueDuplicates.length > 0;
        if (hasConflictingNames) {
          bag.error(
            `The names of the following instruction arguments are conflicting: ` +
              `[${uniqueDuplicates.join(', ')}].`,
            instruction,
            this.stack
          );
        }
      }
    }

    // Check arg defaults.
    Object.entries(instruction.metadata.argDefaults).forEach(
      ([name, defaultsTo]) => {
        if (defaultsTo.kind === 'accountBump') {
          const defaultAccount = instruction.accounts.find(
            (account) => account.name === defaultsTo.name
          );
          if (defaultAccount && defaultAccount.isSigner !== false) {
            bag.error(
              `Argument ${name} cannot default to the bump attribute of ` +
                `the [${defaultsTo.name}] account as it may be a Signer.`,
              instruction,
              this.stack
            );
          }
        }
      }
    );

    // Check sub-instructions.
    bag.mergeWith(instruction.subInstructions.map((ix) => ix.accept(this)));

    this.popNode();
    return bag;
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): ValidatorBag {
    this.pushNode(definedType);
    const bag = new ValidatorBag();
    if (!definedType.name) {
      bag.error('Defined type has no name.', definedType, this.stack);
    }
    bag.mergeWith([definedType.type.accept(this)]);
    this.popNode();
    return bag;
  }

  visitError(error: nodes.ErrorNode): ValidatorBag {
    this.pushNode(error);
    const bag = new ValidatorBag();
    if (!error.name) {
      bag.error('Error has no name.', error, this.stack);
    }
    if (typeof error.code !== 'number') {
      bag.error('Error has no code.', error, this.stack);
    }
    if (!error.message) {
      bag.warn('Error has no message.', error, this.stack);
    }
    this.popNode();
    return bag;
  }

  visitTypeArray(typeArray: nodes.ArrayTypeNode): ValidatorBag {
    this.pushNode(typeArray);
    const bag = typeArray.item.accept(this);
    this.popNode();
    return bag;
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.LinkTypeNode): ValidatorBag {
    this.pushNode(typeDefinedLink);
    const bag = new ValidatorBag();
    if (!typeDefinedLink.name) {
      bag.error(
        'Pointing to a defined type with no name.',
        typeDefinedLink,
        this.stack
      );
    } else if (
      typeDefinedLink.importFrom === 'generated' &&
      !this.definedTypes.has(typeDefinedLink.name)
    ) {
      bag.error(
        `Pointing to a missing defined type named "${typeDefinedLink.name}"`,
        typeDefinedLink,
        this.stack
      );
    }
    this.popNode();
    return bag;
  }

  visitTypeEnum(typeEnum: nodes.EnumTypeNode): ValidatorBag {
    this.pushNode(typeEnum);
    const bag = new ValidatorBag();
    if (!typeEnum.name) {
      bag.info('Enum has no name.', typeEnum, this.stack);
    }
    if (typeEnum.variants.length === 0) {
      bag.warn('Enum has no variants.', typeEnum, this.stack);
    }
    typeEnum.variants.forEach((variant) => {
      if (!variant.name) {
        bag.error('Enum variant has no name.', typeEnum, this.stack);
      }
    });
    bag.mergeWith(typeEnum.variants.map((variant) => variant.accept(this)));
    this.popNode();
    return bag;
  }

  visitTypeEnumEmptyVariant(
    typeEnumEmptyVariant: nodes.EnumEmptyVariantTypeNode
  ): ValidatorBag {
    this.pushNode(typeEnumEmptyVariant);
    const bag = new ValidatorBag();
    if (!typeEnumEmptyVariant.name) {
      bag.error('Enum variant has no name.', typeEnumEmptyVariant, this.stack);
    }
    this.popNode();
    return bag;
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.EnumStructVariantTypeNode
  ): ValidatorBag {
    this.pushNode(typeEnumStructVariant);
    const bag = new ValidatorBag();
    if (!typeEnumStructVariant.name) {
      bag.error('Enum variant has no name.', typeEnumStructVariant, this.stack);
    }
    bag.mergeWith([typeEnumStructVariant.struct.accept(this)]);
    this.popNode();
    return bag;
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.EnumTupleVariantTypeNode
  ): ValidatorBag {
    this.pushNode(typeEnumTupleVariant);
    const bag = new ValidatorBag();
    if (!typeEnumTupleVariant.name) {
      bag.error('Enum variant has no name.', typeEnumTupleVariant, this.stack);
    }
    bag.mergeWith([typeEnumTupleVariant.tuple.accept(this)]);
    this.popNode();
    return bag;
  }

  visitTypeMap(typeMap: nodes.MapTypeNode): ValidatorBag {
    this.pushNode(typeMap);
    const bag = new ValidatorBag();
    bag.mergeWith([typeMap.key.accept(this), typeMap.value.accept(this)]);
    this.popNode();
    return bag;
  }

  visitTypeOption(typeOption: nodes.OptionTypeNode): ValidatorBag {
    this.pushNode(typeOption);
    const bag = typeOption.item.accept(this);
    this.popNode();
    return bag;
  }

  visitTypeSet(typeSet: nodes.SetTypeNode): ValidatorBag {
    this.pushNode(typeSet);
    const bag = typeSet.item.accept(this);
    this.popNode();
    return bag;
  }

  visitTypeStruct(typeStruct: nodes.StructTypeNode): ValidatorBag {
    this.pushNode(typeStruct);
    const bag = new ValidatorBag();
    if (!typeStruct.name) {
      bag.info('Struct has no name.', typeStruct, this.stack);
    }

    // Check for duplicate field names.
    const fieldNameHistogram = new Map<string, number>();
    typeStruct.fields.forEach((field) => {
      if (!field.name) return; // Handled by TypeStructField
      const count = (fieldNameHistogram.get(field.name) ?? 0) + 1;
      fieldNameHistogram.set(field.name, count);
      // Only throw an error once per duplicated names.
      if (count === 2) {
        bag.error(
          `Struct field name "${field.name}" is not unique.`,
          field,
          this.stack
        );
      }
    });

    bag.mergeWith(typeStruct.fields.map((field) => field.accept(this)));
    this.popNode();
    return bag;
  }

  visitTypeStructField(
    typeStructField: nodes.StructFieldTypeNode
  ): ValidatorBag {
    this.pushNode(typeStructField);
    const bag = new ValidatorBag();
    if (!typeStructField.name) {
      bag.error('Struct field has no name.', typeStructField, this.stack);
    }
    bag.mergeWith([typeStructField.type.accept(this)]);
    this.popNode();
    return bag;
  }

  visitTypeTuple(typeTuple: nodes.TupleTypeNode): ValidatorBag {
    this.pushNode(typeTuple);
    const bag = new ValidatorBag();
    if (typeTuple.items.length === 0) {
      bag.warn('Tuple has no items.', typeTuple, this.stack);
    }
    bag.mergeWith(typeTuple.items.map((node) => node.accept(this)));
    this.popNode();
    return bag;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypeBool(typeBool: nodes.BoolTypeNode): ValidatorBag {
    return new ValidatorBag();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypeBytes(typeBytes: nodes.BytesTypeNode): ValidatorBag {
    return new ValidatorBag();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypeNumber(typeNumber: nodes.NumberTypeNode): ValidatorBag {
    return new ValidatorBag();
  }

  visitTypeNumberWrapper(
    typeNumberWrapper: nodes.NumberWrapperTypeNode
  ): ValidatorBag {
    this.pushNode(typeNumberWrapper);
    const bag = typeNumberWrapper.item.accept(this);
    this.popNode();
    return bag;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypePublicKey(typePublicKey: nodes.PublicKeyTypeNode): ValidatorBag {
    return new ValidatorBag();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypeString(typeString: nodes.StringTypeNode): ValidatorBag {
    return new ValidatorBag();
  }

  protected pushNode(node: nodes.Node): void {
    this.stack.push(node);
    if (nodes.isProgramNode(node)) {
      this.program = node;
    }
  }

  protected popNode(): nodes.Node | undefined {
    const node = this.stack.pop();
    if (node && nodes.isProgramNode(node)) {
      this.program = null;
    }
    return node;
  }
}
