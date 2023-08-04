/* eslint-disable @typescript-eslint/no-unused-vars */
import * as nodes from '../../nodes';
import { camelCase, pascalCase, snakeCase } from '../../shared';
import { Visitor, visit } from '../../visitors';
import { RustImportMap } from './RustImportMap';

export type RustTypeManifest = {
  type: string;
  imports: RustImportMap;
};

export class GetRustTypeManifestVisitor implements Visitor<RustTypeManifest> {
  private parentName: string | null = null;
  private inlineStruct: boolean = false;
  private stack: string[] = [];

  visitRoot(): RustTypeManifest {
    throw new Error(
      'Cannot get type manifest for root node. Please select a child node.'
    );
  }

  visitProgram(): RustTypeManifest {
    throw new Error(
      'Cannot get type manifest for program node. Please select a child node.'
    );
  }

  visitAccount(account: nodes.AccountNode): RustTypeManifest {
    return visit(account.data, this);
  }

  visitAccountData(accountData: nodes.AccountDataNode): RustTypeManifest {
    this.parentName = pascalCase(accountData.name);
    const manifest = accountData.link
      ? visit(accountData.link, this)
      : visit(accountData.struct, this);
    this.parentName = null;
    return manifest;
  }

  visitInstruction(instruction: nodes.InstructionNode): RustTypeManifest {
    return visit(instruction.dataArgs, this);
  }

  visitInstructionAccount(): RustTypeManifest {
    throw new Error(
      'Cannot get type manifest for instruction account node. Please select a another node.'
    );
  }

  visitInstructionDataArgs(
    instructionDataArgs: nodes.InstructionDataArgsNode
  ): RustTypeManifest {
    this.parentName = pascalCase(instructionDataArgs.name);
    const manifest = instructionDataArgs.link
      ? visit(instructionDataArgs.link, this)
      : visit(instructionDataArgs.struct, this);
    this.parentName = null;
    return manifest;
  }

  visitInstructionExtraArgs(
    instructionExtraArgs: nodes.InstructionExtraArgsNode
  ): RustTypeManifest {
    this.parentName = pascalCase(instructionExtraArgs.name);
    const manifest = instructionExtraArgs.link
      ? visit(instructionExtraArgs.link, this)
      : visit(instructionExtraArgs.struct, this);
    this.parentName = null;
    return manifest;
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): RustTypeManifest {
    this.parentName = pascalCase(definedType.name);
    this.stack.push(this.parentName);
    const manifest = visit(definedType.data, this);
    this.stack.pop();
    this.parentName = null;
    return manifest;
  }

  visitError(): RustTypeManifest {
    throw new Error('Cannot get type manifest for error node.');
  }

  visitArrayType(arrayType: nodes.ArrayTypeNode): RustTypeManifest {
    const childManifest = visit(arrayType.child, this);

    const parent = this.stack.slice(-1);

    if (parent[0] === 'seeds') {
      console.log('---open seeds +++');
      console.log(childManifest);
      console.log(arrayType);
      console.log('---close seeds +++');
    }

    if (arrayType.size.kind === 'fixed') {
      return {
        ...childManifest,
        type: `[${childManifest.type}; ${arrayType.size.value}]`,
      };
    }

    if (
      arrayType.size.kind === 'prefixed' &&
      arrayType.size.prefix.format === 'u32' &&
      arrayType.size.prefix.endian === 'le'
    ) {
      return {
        ...childManifest,
        type: `Vec<${childManifest.type}>`,
      };
    }

    if (arrayType.size.kind === 'remainder') {
      return {
        ...childManifest,
        type: `RemainderArray<${childManifest.type}>`,
      };
    }

    // TODO: Add to the Rust validator.
    throw new Error('Array size not supported by Borsh');
  }

  visitLinkType(linkType: nodes.LinkTypeNode): RustTypeManifest {
    const pascalCaseDefinedType = pascalCase(linkType.name);
    const importFrom =
      linkType.importFrom === 'generated'
        ? 'generatedTypes'
        : linkType.importFrom;
    return {
      imports: new RustImportMap().add(importFrom, pascalCaseDefinedType),
      type: pascalCaseDefinedType,
    };
  }

  visitEnumType(enumType: nodes.EnumTypeNode): RustTypeManifest {
    const { parentName } = this;
    this.parentName = null;

    if (!parentName) {
      // TODO: Add to the Rust validator.
      throw new Error('Enum type must have a parent name.');
    }

    const variants = enumType.variants.map((variant) => visit(variant, this));
    const variantNames = variants.map((variant) => variant.type).join('\n');
    const mergedManifest = this.mergeManifests(variants);

    return {
      ...mergedManifest,
      type: `pub enum ${pascalCase(parentName)} {\n${variantNames}\n}`,
    };
  }

  visitEnumEmptyVariantType(
    enumEmptyVariantType: nodes.EnumEmptyVariantTypeNode
  ): RustTypeManifest {
    const name = pascalCase(enumEmptyVariantType.name);
    return {
      type: `${name},`,
      imports: new RustImportMap(),
    };
  }

  visitEnumStructVariantType(
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ): RustTypeManifest {
    const name = pascalCase(enumStructVariantType.name);
    this.inlineStruct = true;
    const typeManifest = visit(enumStructVariantType.struct, this);
    this.inlineStruct = false;

    return {
      ...typeManifest,
      type: `${name} ${typeManifest.type}`,
    };
  }

  visitEnumTupleVariantType(
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ): RustTypeManifest {
    return { type: '', imports: new RustImportMap() };
  }

  visitMapType(mapType: nodes.MapTypeNode): RustTypeManifest {
    return { type: '', imports: new RustImportMap() };
  }

  visitOptionType(optionType: nodes.OptionTypeNode): RustTypeManifest {
    const childManifest = visit(optionType.child, this);

    if (
      optionType.prefix.format === 'u8' &&
      optionType.prefix.endian === 'le'
    ) {
      return {
        ...childManifest,
        type: `Option<${childManifest.type}>`,
      };
    }

    // TODO: Add to the Rust validator.
    throw new Error('Option size not supported by Borsh');
  }

  visitSetType(setType: nodes.SetTypeNode): RustTypeManifest {
    return { type: '', imports: new RustImportMap() };
  }

  visitStructType(structType: nodes.StructTypeNode): RustTypeManifest {
    const { parentName } = this;
    this.parentName = null;

    if (!this.inlineStruct && !parentName) {
      // TODO: Add to the Rust validator.
      throw new Error('Struct type must have a parent name.');
    }

    const fields = structType.fields.map((field) => visit(field, this));
    const fieldTypes = fields.map((field) => field.type).join('\n');
    const mergedManifest = this.mergeManifests(fields);

    return {
      ...mergedManifest,
      type:
        this.inlineStruct || !parentName
          ? `{\n${fieldTypes}\n}`
          : `pub struct ${pascalCase(parentName)} {\n${fieldTypes}\n}`,
    };
  }

  visitStructFieldType(
    structFieldType: nodes.StructFieldTypeNode
  ): RustTypeManifest {
    const name = snakeCase(structFieldType.name);
    this.stack.push(name);
    const fieldChild = visit(structFieldType.child, this);
    const docblock = this.createDocblock(structFieldType.docs);
    this.stack.pop();

    
    return {
      ...fieldChild,
      type: this.inlineStruct
        ? `${docblock}${name}: ${fieldChild.type},`
        : `${docblock}pub ${name}: ${fieldChild.type},`,
    };
  }

  visitTupleType(tupleType: nodes.TupleTypeNode): RustTypeManifest {
    return { type: '', imports: new RustImportMap() };
  }

  visitBoolType(boolType: nodes.BoolTypeNode): RustTypeManifest {
    if (boolType.size.format === 'u8' && boolType.size.endian === 'le') {
      return { type: 'bool', imports: new RustImportMap() };
    }

    // TODO: Add to the Rust validator.
    throw new Error('Bool size not supported by Borsh');
  }

  visitBytesType(bytesType: nodes.BytesTypeNode): RustTypeManifest {

    const arrayType = nodes.arrayTypeNode(nodes.numberTypeNode('u8'), {
      size: bytesType.size,
    });

    return visit(arrayType, this);
  }

  visitNumberType(numberType: nodes.NumberTypeNode): RustTypeManifest {
    if (numberType.endian === 'le') {
      return { type: numberType.format, imports: new RustImportMap() };
    }

    // TODO: Add to the Rust validator.
    throw new Error('Number endianness not supported by Borsh');
  }

  visitNumberWrapperType(
    numberWrapperType: nodes.NumberWrapperTypeNode
  ): RustTypeManifest {
    return visit(numberWrapperType.number, this);
  }

  visitPublicKeyType(): RustTypeManifest {
    return {
      type: 'Pubkey',
      imports: new RustImportMap().add('solana_program', 'pubkey::Pubkey'),
    };
  }

  visitStringType(stringType: nodes.StringTypeNode): RustTypeManifest {
    if (
      stringType.size.kind === 'prefixed' &&
      stringType.size.prefix.format === 'u32' &&
      stringType.size.prefix.endian === 'le'
    ) {
      return { type: 'String', imports: new RustImportMap() };
    }

    if (stringType.size.kind === 'fixed') {
      return {
        type: `[u8; ${stringType.size.value}]`,
        imports: new RustImportMap(),
      };
    }

    // TODO: Add to the Rust validator.
    throw new Error('String size not supported by Borsh');
  }

  protected mergeManifests(
    manifests: RustTypeManifest[]
  ): Pick<RustTypeManifest, 'imports'> {
    return {
      imports: new RustImportMap().mergeWith(
        ...manifests.map((td) => td.imports)
      ),
    };
  }

  protected createDocblock(docs: string[]): string {
    if (docs.length <= 0) return '';
    const lines = docs.map((doc) => `/// ${doc}`);
    return `${lines.join('\n')}\n`;
  }
}
