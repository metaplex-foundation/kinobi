import { pascalCase } from '../../utils';
import * as nodes from '../../nodes';
import { Visitor } from '../Visitor';
import { NodeStack } from '../NodeStack';
import { ValidatorBag } from '../ValidatorBag';

export class GetDefaultValidatorBagVisitor implements Visitor<ValidatorBag> {
  protected stack: NodeStack = new NodeStack();

  protected program: nodes.ProgramNode | null = null;

  protected exportedNames: Map<string, NodeStack> = new Map();

  protected definedTypes = new Set<string>();

  visitRoot(root: nodes.RootNode): ValidatorBag {
    this.pushNode(root);

    // Register defined types to make sure links are valid.
    root.allDefinedTypes.forEach((type) => this.definedTypes.add(type.name));

    const bags = root.programs.map((program) => program.accept(this));
    this.popNode();
    return new ValidatorBag().mergeWith(bags);
  }

  visitProgram(program: nodes.ProgramNode): ValidatorBag {
    this.pushNode(program);
    const bag = new ValidatorBag();
    if (!program.metadata.name) {
      bag.error('Program has no name', program, this.stack);
    }
    if (!program.metadata.address) {
      bag.error('Program has no address', program, this.stack);
    }
    if (!program.metadata.version) {
      bag.warn('Program has no version', program, this.stack);
    }
    if (!program.metadata.origin) {
      bag.info('Program has no origin', program, this.stack);
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
      bag.error('Account has no name', account, this.stack);
    }
    bag.mergeWith([
      this.nameConflict(account, account.name),
      account.type.accept(this),
    ]);
    this.popNode();
    return bag;
  }

  visitInstruction(instruction: nodes.InstructionNode): ValidatorBag {
    this.pushNode(instruction);
    const bag = new ValidatorBag();
    if (!instruction.name) {
      bag.error('Instruction has no name', instruction, this.stack);
    }
    bag.mergeWith([
      this.nameConflict(instruction, instruction.name),
      instruction.args.accept(this),
    ]);
    this.popNode();
    return bag;
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): ValidatorBag {
    this.pushNode(definedType);
    const bag = new ValidatorBag();
    if (!definedType.name) {
      bag.error('Defined type has no name', definedType, this.stack);
    }
    bag.mergeWith([
      this.nameConflict(definedType, definedType.name),
      definedType.type.accept(this),
    ]);
    this.popNode();
    return bag;
  }

  visitError(error: nodes.ErrorNode): ValidatorBag {
    this.pushNode(error);
    const bag = new ValidatorBag();
    if (!error.name) {
      bag.error('Error has no name', error, this.stack);
    }
    if (typeof error.code !== 'number') {
      bag.error('Error has no code', error, this.stack);
    }
    if (!error.message) {
      bag.warn('Error has no message', error, this.stack);
    }

    const programPrefix = pascalCase(this.program?.metadata.prefix ?? '');
    const prefixedErrorName = `${programPrefix + pascalCase(error.name)}Error`;
    bag.mergeWith([this.nameConflict(error, prefixedErrorName)]);

    this.popNode();
    return bag;
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): ValidatorBag {
    this.pushNode(typeArray);
    const bag = typeArray.itemType.accept(this);
    this.popNode();
    return bag;
  }

  visitTypeDefinedLink(
    typeDefinedLink: nodes.TypeDefinedLinkNode
  ): ValidatorBag {
    this.pushNode(typeDefinedLink);
    const bag = new ValidatorBag();
    if (!typeDefinedLink.definedType) {
      bag.error(
        'Pointing to a defined type with no name',
        typeDefinedLink,
        this.stack
      );
    } else if (!this.definedTypes.has(typeDefinedLink.definedType)) {
      bag.error(
        `Pointing to a missing defined type named "${typeDefinedLink.definedType}"`,
        typeDefinedLink,
        this.stack
      );
    }
    this.popNode();
    return bag;
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): ValidatorBag {
    this.pushNode(typeEnum);

    const bag = new ValidatorBag();
    if (!typeEnum.name) {
      bag.info('Enum has no name', typeEnum, this.stack);
    }
    if (typeEnum.variants.length === 0) {
      bag.warn('Enum has no variants', typeEnum, this.stack);
    }
    typeEnum.variants.forEach((variant) => {
      if (!variant.name) {
        bag.error('Enum variant has no name', typeEnum, this.stack);
      }
    });

    bag.mergeWith(
      typeEnum.variants.map((variant) => {
        if (variant.kind === 'empty') return new ValidatorBag();
        return variant.type.accept(this);
      })
    );
    this.popNode();
    return bag;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): ValidatorBag {
    return new ValidatorBag();
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): ValidatorBag {
    this.pushNode(typeMap);
    const bag = new ValidatorBag();
    bag.mergeWith([
      typeMap.keyType.accept(this),
      typeMap.valueType.accept(this),
    ]);
    this.popNode();
    return bag;
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): ValidatorBag {
    this.pushNode(typeOption);
    const bag = typeOption.type.accept(this);
    this.popNode();
    return bag;
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): ValidatorBag {
    this.pushNode(typeSet);
    const bag = typeSet.type.accept(this);
    this.popNode();
    return bag;
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): ValidatorBag {
    this.pushNode(typeStruct);
    const bag = new ValidatorBag();
    if (!typeStruct.name) {
      bag.info('Struct has no name', typeStruct, this.stack);
    }
    typeStruct.fields.forEach((field) => {
      if (!field.name) {
        bag.error('Struct field has no name', typeStruct, this.stack);
      }
    });

    bag.mergeWith(typeStruct.fields.map((field) => field.type.accept(this)));
    this.popNode();
    return bag;
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): ValidatorBag {
    this.pushNode(typeTuple);
    const bag = new ValidatorBag();
    if (typeTuple.itemTypes.length === 0) {
      bag.warn('Tuple has no items', typeTuple, this.stack);
    }
    bag.mergeWith(typeTuple.itemTypes.map((node) => node.accept(this)));
    this.popNode();
    return bag;
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): ValidatorBag {
    this.pushNode(typeVec);
    const bag = typeVec.itemType.accept(this);
    this.popNode();
    return bag;
  }

  protected nameConflict(node: nodes.Node, name: string): ValidatorBag {
    if (!name) return new ValidatorBag();
    const hasConflict = this.exportedNames.has(name);
    if (!hasConflict) {
      this.exportedNames.set(name, this.stack.clone());
      return new ValidatorBag();
    }
    const conflictingStack = this.exportedNames.get(name) as NodeStack;
    const message = `Exported name "${name}" conflicts with the following node "${conflictingStack.toString()}"`;
    return new ValidatorBag().error(message, node, this.stack);
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
