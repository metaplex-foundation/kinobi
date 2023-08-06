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
    this.parentName = pascalCase(account.name);
    const manifest = visit(account.data, this);
    manifest.imports.add('borsh', ['BorshSerialize', 'BorshDeserialize']);
    this.parentName = null;
    return {
      ...manifest,
      type: `#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq)]\n${manifest.type}`,
    };
  }

  visitAccountData(accountData: nodes.AccountDataNode): RustTypeManifest {
    return visit(accountData.struct, this);
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
    const manifest = visit(instructionDataArgs.struct, this);
    this.parentName = null;
    return manifest;
  }

  visitInstructionExtraArgs(
    instructionExtraArgs: nodes.InstructionExtraArgsNode
  ): RustTypeManifest {
    this.parentName = pascalCase(instructionExtraArgs.name);
    const manifest = visit(instructionExtraArgs.struct, this);
    this.parentName = null;
    return manifest;
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): RustTypeManifest {
    this.parentName = pascalCase(definedType.name);
    const manifest = visit(definedType.data, this);
    this.parentName = null;
    manifest.imports.add('borsh', ['BorshSerialize', 'BorshDeserialize']);
    return {
      ...manifest,
      type: `#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq)]\n${manifest.type}`,
    };
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

    if (arrayType.size.kind === 'remainder') {
      childManifest.imports.add('crate::types::helper', 'RemainderVec');
      return {
        ...childManifest,
        type: `RemainderVec<${childManifest.type}>`,
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
    const key = visit(mapType.key, this);
    const value = visit(mapType.value, this);
    const mergedManifest = this.mergeManifests([key, value]);
    mergedManifest.imports.add('std::collections', 'HashMap');
    return {
      ...mergedManifest,
      type: `HashMap<${key.type}, ${value.type}>`,
    };
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
    const childManifest = visit(setType.child, this);
    childManifest.imports.add('std::collections', 'HashSet');
    return {
      ...childManifest,
      type: `HashSet<${childManifest.type}>`,
    };
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
    const fieldChild = visit(structFieldType.child, this);
    const docblock = this.createDocblock(structFieldType.docs);

    return {
      ...fieldChild,
      type: this.inlineStruct
        ? `${docblock}${name}: ${fieldChild.type},`
        : `${docblock}pub ${name}: ${fieldChild.type},`,
    };
  }

  visitTupleType(tupleType: nodes.TupleTypeNode): RustTypeManifest {
    const children = tupleType.children.map((item) => visit(item, this));
    const mergedManifest = this.mergeManifests(children);

    return {
      ...mergedManifest,
      type: `(${children.map((item) => item.type).join(', ')})`,
    };
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
