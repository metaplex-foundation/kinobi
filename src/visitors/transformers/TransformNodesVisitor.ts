import * as nodes from '../../nodes';
import { BaseNodeOrNullVisitor } from '../BaseNodeOrNullVisitor';
import {
  NodeSelector,
  NodeSelectorFunction,
  toNodeSelectorFunction,
} from '../NodeSelector';
import { NodeStack } from '../NodeStack';

export type NodeTransform<T extends NodeSelector = NodeSelector> = {
  selector: T;
  transformer: (
    node: nodes.Node,
    stack: NodeStack,
    program: nodes.ProgramNode | null
  ) => nodes.Node | null;
};

export class TransformNodesVisitor extends BaseNodeOrNullVisitor {
  readonly transforms: NodeTransform<NodeSelectorFunction>[];

  readonly stack: NodeStack = new NodeStack();

  protected program: nodes.ProgramNode | null = null;

  constructor(transforms: NodeTransform[]) {
    super();
    this.transforms = transforms.map((transform) => ({
      ...transform,
      selector: toNodeSelectorFunction(transform.selector),
    }));
  }

  visitRoot(root: nodes.RootNode): nodes.Node | null {
    this.stack.push(root);
    const visitedRoot = super.visitRoot(root);
    this.stack.pop();
    return this.applyTransforms(visitedRoot);
  }

  visitProgram(program: nodes.ProgramNode): nodes.Node | null {
    this.stack.push(program);
    this.program = program;
    const visitedProgram = super.visitProgram(program);
    this.program = null;
    this.stack.pop();
    return this.applyTransforms(visitedProgram);
  }

  visitAccount(account: nodes.AccountNode): nodes.Node | null {
    this.stack.push(account);
    const visitedAccount = super.visitAccount(account);
    this.stack.pop();
    return this.applyTransforms(visitedAccount);
  }

  visitAccountData(accountData: nodes.AccountDataNode): nodes.Node | null {
    this.stack.push(accountData);
    const visitedAccountData = super.visitAccountData(accountData);
    this.stack.pop();
    return this.applyTransforms(visitedAccountData);
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node | null {
    this.stack.push(instruction);
    const visitedInstruction = super.visitInstruction(instruction);
    this.stack.pop();
    return this.applyTransforms(visitedInstruction);
  }

  visitInstructionAccount(
    instructionAccount: nodes.InstructionAccountNode
  ): nodes.Node | null {
    this.stack.push(instructionAccount);
    const visitedInstructionAccount = super.visitInstructionAccount(
      instructionAccount
    );
    this.stack.pop();
    return this.applyTransforms(visitedInstructionAccount);
  }

  visitInstructionDataArgs(
    instructionDataArgs: nodes.InstructionDataArgsNode
  ): nodes.Node | null {
    this.stack.push(instructionDataArgs);
    const visitedInstructionDataArgs = super.visitInstructionDataArgs(
      instructionDataArgs
    );
    this.stack.pop();
    return this.applyTransforms(visitedInstructionDataArgs);
  }

  visitInstructionExtraArgs(
    instructionExtraArgs: nodes.InstructionExtraArgsNode
  ): nodes.Node | null {
    this.stack.push(instructionExtraArgs);
    const visitedInstructionExtraArgs = super.visitInstructionExtraArgs(
      instructionExtraArgs
    );
    this.stack.pop();
    return this.applyTransforms(visitedInstructionExtraArgs);
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): nodes.Node | null {
    this.stack.push(definedType);
    const visitedDefinedType = super.visitDefinedType(definedType);
    this.stack.pop();
    return this.applyTransforms(visitedDefinedType);
  }

  visitError(error: nodes.ErrorNode): nodes.Node | null {
    this.stack.push(error);
    const visitedError = super.visitError(error);
    this.stack.pop();
    return this.applyTransforms(visitedError);
  }

  visitArrayType(arrayType: nodes.ArrayTypeNode): nodes.Node | null {
    this.stack.push(arrayType);
    const visitedTypeArray = super.visitArrayType(arrayType);
    this.stack.pop();
    return this.applyTransforms(visitedTypeArray);
  }

  visitLinkType(linkType: nodes.LinkTypeNode): nodes.Node | null {
    this.stack.push(linkType);
    const visitedTypeDefinedLink = super.visitLinkType(linkType);
    this.stack.pop();
    return this.applyTransforms(visitedTypeDefinedLink);
  }

  visitEnumType(enumType: nodes.EnumTypeNode): nodes.Node | null {
    this.stack.push(enumType);
    const visitedTypeEnum = super.visitEnumType(enumType);
    this.stack.pop();
    return this.applyTransforms(visitedTypeEnum);
  }

  visitEnumEmptyVariantType(
    enumEmptyVariantType: nodes.EnumEmptyVariantTypeNode
  ): nodes.Node | null {
    this.stack.push(enumEmptyVariantType);
    const visitedTypeEnumEmptyVariant = super.visitEnumEmptyVariantType(
      enumEmptyVariantType
    );
    this.stack.pop();
    return this.applyTransforms(visitedTypeEnumEmptyVariant);
  }

  visitEnumStructVariantType(
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ): nodes.Node | null {
    this.stack.push(enumStructVariantType);
    const visitedTypeEnumStructVariant = super.visitEnumStructVariantType(
      enumStructVariantType
    );
    this.stack.pop();
    return this.applyTransforms(visitedTypeEnumStructVariant);
  }

  visitEnumTupleVariantType(
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ): nodes.Node | null {
    this.stack.push(enumTupleVariantType);
    const visitedTypeEnumTupleVariant = super.visitEnumTupleVariantType(
      enumTupleVariantType
    );
    this.stack.pop();
    return this.applyTransforms(visitedTypeEnumTupleVariant);
  }

  visitMapType(mapType: nodes.MapTypeNode): nodes.Node | null {
    this.stack.push(mapType);
    const visitedTypeMap = super.visitMapType(mapType);
    this.stack.pop();
    return this.applyTransforms(visitedTypeMap);
  }

  visitOptionType(optionType: nodes.OptionTypeNode): nodes.Node | null {
    this.stack.push(optionType);
    const visitedTypeOption = super.visitOptionType(optionType);
    this.stack.pop();
    return this.applyTransforms(visitedTypeOption);
  }

  visitSetType(setType: nodes.SetTypeNode): nodes.Node | null {
    this.stack.push(setType);
    const visitedTypeSet = super.visitSetType(setType);
    this.stack.pop();
    return this.applyTransforms(visitedTypeSet);
  }

  visitStructType(structType: nodes.StructTypeNode): nodes.Node | null {
    this.stack.push(structType);
    const visitedTypeStruct = super.visitStructType(structType);
    this.stack.pop();
    return this.applyTransforms(visitedTypeStruct);
  }

  visitStructFieldType(
    structFieldType: nodes.StructFieldTypeNode
  ): nodes.Node | null {
    this.stack.push(structFieldType);
    const visitedTypeStructField = super.visitStructFieldType(structFieldType);
    this.stack.pop();
    return this.applyTransforms(visitedTypeStructField);
  }

  visitTupleType(tupleType: nodes.TupleTypeNode): nodes.Node | null {
    this.stack.push(tupleType);
    const visitedTypeTuple = super.visitTupleType(tupleType);
    this.stack.pop();
    return this.applyTransforms(visitedTypeTuple);
  }

  visitBoolType(boolType: nodes.BoolTypeNode): nodes.Node | null {
    this.stack.push(boolType);
    const visitedTypeBool = super.visitBoolType(boolType);
    this.stack.pop();
    return this.applyTransforms(visitedTypeBool);
  }

  visitBytesType(bytesType: nodes.BytesTypeNode): nodes.Node | null {
    this.stack.push(bytesType);
    const visitedTypeBytes = super.visitBytesType(bytesType);
    this.stack.pop();
    return this.applyTransforms(visitedTypeBytes);
  }

  visitNumberType(numberType: nodes.NumberTypeNode): nodes.Node | null {
    this.stack.push(numberType);
    const visitedTypeNumber = super.visitNumberType(numberType);
    this.stack.pop();
    return this.applyTransforms(visitedTypeNumber);
  }

  visitAmountType(amountType: nodes.AmountTypeNode): nodes.Node | null {
    this.stack.push(amountType);
    const visitedTypeAmount = super.visitAmountType(amountType);
    this.stack.pop();
    return this.applyTransforms(visitedTypeAmount);
  }

  visitDateTimeType(dateTimeType: nodes.DateTimeTypeNode): nodes.Node | null {
    this.stack.push(dateTimeType);
    const visitedTypeDate = super.visitDateTimeType(dateTimeType);
    this.stack.pop();
    return this.applyTransforms(visitedTypeDate);
  }

  visitSolAmountType(
    solAmountType: nodes.SolAmountTypeNode
  ): nodes.Node | null {
    this.stack.push(solAmountType);
    const visitedTypeAmount = super.visitSolAmountType(solAmountType);
    this.stack.pop();
    return this.applyTransforms(visitedTypeAmount);
  }

  visitPublicKeyType(
    publicKeyType: nodes.PublicKeyTypeNode
  ): nodes.Node | null {
    this.stack.push(publicKeyType);
    const visitedTypePublicKey = super.visitPublicKeyType(publicKeyType);
    this.stack.pop();
    return this.applyTransforms(visitedTypePublicKey);
  }

  visitStringType(stringType: nodes.StringTypeNode): nodes.Node | null {
    this.stack.push(stringType);
    const visitedTypeString = super.visitStringType(stringType);
    this.stack.pop();
    return this.applyTransforms(visitedTypeString);
  }

  protected applyTransforms(node: nodes.Node | null): nodes.Node | null {
    if (node === null) return null;
    const stack = this.stack.clone();
    const { program } = this;
    return this.transforms
      .filter(({ selector }) => selector(node, stack, program))
      .reduce(
        (acc, { transformer }) =>
          acc === null ? null : transformer(acc, stack, program),
        node as nodes.Node | null
      );
  }
}
