import * as nodes from '../../nodes';
import { BaseNodeOrNullVisitor } from '../BaseNodeOrNullVisitor';
import {
  NodeSelector,
  NodeSelectorFunction,
  toNodeSelectorFunction,
} from '../NodeSelector';
import { NodeStack } from '../NodeStack';

export type NodeTransformer<T extends nodes.Node = nodes.Node> = (
  node: T,
  stack: NodeStack,
  program: nodes.ProgramNode | null
) => T | null;

export type NodeTransform<T extends NodeSelector = NodeSelector> = {
  selector: T;
  transformer: NodeTransformer;
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

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node | null {
    this.stack.push(instruction);
    const visitedInstruction = super.visitInstruction(instruction);
    this.stack.pop();
    return this.applyTransforms(visitedInstruction);
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
    this.stack.push(typeArray);
    const visitedTypeArray = super.visitArrayType(typeArray);
    this.stack.pop();
    return this.applyTransforms(visitedTypeArray);
  }

  visitDefinedLinkType(definedLinkType: nodes.LinkTypeNode): nodes.Node | null {
    this.stack.push(typeDefinedLink);
    const visitedTypeDefinedLink = super.visitDefinedLinkType(typeDefinedLink);
    this.stack.pop();
    return this.applyTransforms(visitedTypeDefinedLink);
  }

  visitEnumType(enumType: nodes.EnumTypeNode): nodes.Node | null {
    this.stack.push(typeEnum);
    const visitedTypeEnum = super.visitEnumType(typeEnum);
    this.stack.pop();
    return this.applyTransforms(visitedTypeEnum);
  }

  visitEnumEmptyVariantType(
    enumEmptyVariantType: nodes.EnumEmptyVariantTypeNode
  ): nodes.Node | null {
    this.stack.push(typeEnumEmptyVariant);
    const visitedTypeEnumEmptyVariant = super.visitEnumEmptyVariantType(
      typeEnumEmptyVariant
    );
    this.stack.pop();
    return this.applyTransforms(visitedTypeEnumEmptyVariant);
  }

  visitEnumStructVariantType(
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ): nodes.Node | null {
    this.stack.push(typeEnumStructVariant);
    const visitedTypeEnumStructVariant = super.visitEnumStructVariantType(
      typeEnumStructVariant
    );
    this.stack.pop();
    return this.applyTransforms(visitedTypeEnumStructVariant);
  }

  visitEnumTupleVariantType(
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ): nodes.Node | null {
    this.stack.push(typeEnumTupleVariant);
    const visitedTypeEnumTupleVariant = super.visitEnumTupleVariantType(
      typeEnumTupleVariant
    );
    this.stack.pop();
    return this.applyTransforms(visitedTypeEnumTupleVariant);
  }

  visitMapType(mapType: nodes.MapTypeNode): nodes.Node | null {
    this.stack.push(typeMap);
    const visitedTypeMap = super.visitMapType(typeMap);
    this.stack.pop();
    return this.applyTransforms(visitedTypeMap);
  }

  visitOptionType(optionType: nodes.OptionTypeNode): nodes.Node | null {
    this.stack.push(typeOption);
    const visitedTypeOption = super.visitOptionType(typeOption);
    this.stack.pop();
    return this.applyTransforms(visitedTypeOption);
  }

  visitSetType(setType: nodes.SetTypeNode): nodes.Node | null {
    this.stack.push(typeSet);
    const visitedTypeSet = super.visitSetType(typeSet);
    this.stack.pop();
    return this.applyTransforms(visitedTypeSet);
  }

  visitStructType(structType: nodes.StructTypeNode): nodes.Node | null {
    this.stack.push(typeStruct);
    const visitedTypeStruct = super.visitStructType(typeStruct);
    this.stack.pop();
    return this.applyTransforms(visitedTypeStruct);
  }

  visitStructFieldType(
    structFieldType: nodes.StructFieldTypeNode
  ): nodes.Node | null {
    this.stack.push(typeStructField);
    const visitedTypeStructField = super.visitStructFieldType(typeStructField);
    this.stack.pop();
    return this.applyTransforms(visitedTypeStructField);
  }

  visitTupleType(tupleType: nodes.TupleTypeNode): nodes.Node | null {
    this.stack.push(typeTuple);
    const visitedTypeTuple = super.visitTupleType(typeTuple);
    this.stack.pop();
    return this.applyTransforms(visitedTypeTuple);
  }

  visitBoolType(boolType: nodes.BoolTypeNode): nodes.Node | null {
    this.stack.push(typeBool);
    const visitedTypeBool = super.visitBoolType(typeBool);
    this.stack.pop();
    return this.applyTransforms(visitedTypeBool);
  }

  visitBytesType(bytesType: nodes.BytesTypeNode): nodes.Node | null {
    this.stack.push(typeBytes);
    const visitedTypeBytes = super.visitBytesType(typeBytes);
    this.stack.pop();
    return this.applyTransforms(visitedTypeBytes);
  }

  visitNumberType(numberType: nodes.NumberTypeNode): nodes.Node | null {
    this.stack.push(typeNumber);
    const visitedTypeNumber = super.visitNumberType(typeNumber);
    this.stack.pop();
    return this.applyTransforms(visitedTypeNumber);
  }

  visitNumberWrapperType(
    numberWrapperType: nodes.NumberWrapperTypeNode
  ): nodes.Node | null {
    this.stack.push(typeNumberWrapper);
    const visitedTypeNumberWrapper = super.visitNumberWrapperType(
      typeNumberWrapper
    );
    this.stack.pop();
    return this.applyTransforms(visitedTypeNumberWrapper);
  }

  visitPublicKeyType(
    publicKeyType: nodes.PublicKeyTypeNode
  ): nodes.Node | null {
    this.stack.push(typePublicKey);
    const visitedTypePublicKey = super.visitPublicKeyType(typePublicKey);
    this.stack.pop();
    return this.applyTransforms(visitedTypePublicKey);
  }

  visitStringType(stringType: nodes.StringTypeNode): nodes.Node | null {
    this.stack.push(typeString);
    const visitedTypeString = super.visitStringType(typeString);
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
