/* eslint-disable @typescript-eslint/no-unused-vars */
import * as nodes from '../../nodes';
import { camelCase, pascalCase } from '../../shared';
import { Visitor, visit } from '../../visitors';
import { RustImportMap } from './RustImportMap';

export type RustTypeManifest = {
  type: string;
  imports: RustImportMap;
};

export class GetRustTypeManifestVisitor implements Visitor<RustTypeManifest> {
  private parentName: string | null = null;

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
    const manifest = visit(definedType.data, this);
    this.parentName = null;
    return manifest;
  }

  visitError(): RustTypeManifest {
    throw new Error('Cannot get type manifest for error node.');
  }

  visitArrayType(arrayType: nodes.ArrayTypeNode): RustTypeManifest {
    const childManifest = visit(arrayType.child, this);

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

    // TODO: Add to the Rust validator.
    throw new Error('Array size not supported by Borsh');
  }

  visitLinkType(linkType: nodes.LinkTypeNode): RustTypeManifest {
    return { type: '', imports: new RustImportMap() };
  }

  visitEnumType(enumType: nodes.EnumTypeNode): RustTypeManifest {
    return { type: '', imports: new RustImportMap() };
  }

  visitEnumEmptyVariantType(
    enumEmptyVariantType: nodes.EnumEmptyVariantTypeNode
  ): RustTypeManifest {
    return { type: '', imports: new RustImportMap() };
  }

  visitEnumStructVariantType(
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ): RustTypeManifest {
    return { type: '', imports: new RustImportMap() };
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
    return { type: '', imports: new RustImportMap() };
  }

  visitSetType(setType: nodes.SetTypeNode): RustTypeManifest {
    return { type: '', imports: new RustImportMap() };
  }

  visitStructType(structType: nodes.StructTypeNode): RustTypeManifest {
    return { type: '', imports: new RustImportMap() };
  }

  visitStructFieldType(
    structFieldType: nodes.StructFieldTypeNode
  ): RustTypeManifest {
    return { type: '', imports: new RustImportMap() };
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
    return { type: '', imports: new RustImportMap() };
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
    if (docs.length === 1) return `\n/** ${docs[0]} */\n`;
    const lines = docs.map((doc) => ` * ${doc}`);
    return `\n/**\n${lines.join('\n')}\n */\n`;
  }
}
