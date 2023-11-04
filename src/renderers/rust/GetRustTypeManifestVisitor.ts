/* eslint-disable @typescript-eslint/no-unused-vars */
import * as nodes from '../../nodes';
import { pascalCase, snakeCase } from '../../shared';
import { Visitor, visit } from '../../visitors';
import { RustImportMap } from './RustImportMap';

export type RustTypeManifest = {
  type: string;
  imports: RustImportMap;
  nestedStructs: string[];
};

export class GetRustTypeManifestVisitor implements Visitor<RustTypeManifest> {
  public parentName: string | null = null;

  public nestedStruct: boolean = false;

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
    manifest.imports.add(['borsh::BorshSerialize', 'borsh::BorshDeserialize']);
    this.parentName = null;
    return {
      ...manifest,
      type:
        '#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Eq, PartialEq)]\n' +
        '#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]\n' +
        `${manifest.type}`,
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
    manifest.imports.add(['borsh::BorshSerialize', 'borsh::BorshDeserialize']);
    const traits = [
      'BorshSerialize',
      'BorshDeserialize',
      'Clone',
      'Debug',
      'Eq',
      'PartialEq',
    ];
    const isScalarEnum =
      nodes.isEnumTypeNode(definedType.data) &&
      nodes.isScalarEnum(definedType.data);
    if (isScalarEnum) {
      traits.push('PartialOrd', 'Hash');
    }
    return {
      ...manifest,
      type:
        `#[derive(${traits.join(', ')})]\n` +
        '#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]\n' +
        `${manifest.type}`,
      nestedStructs: manifest.nestedStructs.map(
        (struct) =>
          `#[derive(${traits.join(', ')})]\n` +
          '#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]\n' +
          `${struct}`
      ),
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
      arrayType.size.prefix.endian === 'le'
    ) {
      switch (arrayType.size.prefix.format) {
        case 'u32':
          return {
            ...childManifest,
            type: `Vec<${childManifest.type}>`,
          };
        case 'u8':
        case 'u16':
        case 'u64': {
          const prefix = arrayType.size.prefix.format.toUpperCase();
          childManifest.imports.add(`kaigan::types::${prefix}PrefixVec`);
          return {
            ...childManifest,
            type: `${prefix}PrefixVec<${childManifest.type}>`,
          };
        }
      }
    }

    if (arrayType.size.kind === 'remainder') {
      childManifest.imports.add('kaigan::types::RemainderVec');
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
      imports: new RustImportMap().add(
        `${importFrom}::${pascalCaseDefinedType}`
      ),
      type: pascalCaseDefinedType,
      nestedStructs: [],
    };
  }

  visitEnumType(enumType: nodes.EnumTypeNode): RustTypeManifest {
    const { parentName } = this;

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
      nestedStructs: [],
    };
  }

  visitEnumStructVariantType(
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ): RustTypeManifest {
    const name = pascalCase(enumStructVariantType.name);
    const originalParentName = this.parentName;

    if (!originalParentName) {
      throw new Error('Enum struct variant type must have a parent name.');
    }

    this.inlineStruct = true;
    this.parentName = pascalCase(originalParentName) + name;
    const typeManifest = visit(enumStructVariantType.struct, this);
    this.inlineStruct = false;
    this.parentName = originalParentName;

    return {
      ...typeManifest,
      type: `${name} ${typeManifest.type},`,
    };
  }

  visitEnumTupleVariantType(
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ): RustTypeManifest {
    const name = pascalCase(enumTupleVariantType.name);
    const originalParentName = this.parentName;

    if (!originalParentName) {
      throw new Error('Enum struct variant type must have a parent name.');
    }

    this.parentName = pascalCase(originalParentName) + name;
    const childManifest = visit(enumTupleVariantType.tuple, this);
    this.parentName = originalParentName;

    return {
      ...childManifest,
      type: `${name}${childManifest.type},`,
    };
  }

  visitMapType(mapType: nodes.MapTypeNode): RustTypeManifest {
    const key = visit(mapType.key, this);
    const value = visit(mapType.value, this);
    const mergedManifest = this.mergeManifests([key, value]);
    mergedManifest.imports.add('std::collections::HashMap');
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
    childManifest.imports.add('std::collections::HashSet');
    return {
      ...childManifest,
      type: `HashSet<${childManifest.type}>`,
    };
  }

  visitStructType(structType: nodes.StructTypeNode): RustTypeManifest {
    const { parentName } = this;

    if (!parentName) {
      // TODO: Add to the Rust validator.
      throw new Error('Struct type must have a parent name.');
    }

    const fields = structType.fields.map((field) => visit(field, this));
    const fieldTypes = fields.map((field) => field.type).join('\n');
    const mergedManifest = this.mergeManifests(fields);

    if (this.nestedStruct) {
      return {
        ...mergedManifest,
        type: pascalCase(parentName),
        nestedStructs: [
          ...mergedManifest.nestedStructs,
          `pub struct ${pascalCase(parentName)} {\n${fieldTypes}\n}`,
        ],
      };
    }

    if (this.inlineStruct) {
      return { ...mergedManifest, type: `{\n${fieldTypes}\n}` };
    }

    return {
      ...mergedManifest,
      type: `pub struct ${pascalCase(parentName)} {\n${fieldTypes}\n}`,
    };
  }

  visitStructFieldType(
    structFieldType: nodes.StructFieldTypeNode
  ): RustTypeManifest {
    const originalParentName = this.parentName;
    const originalInlineStruct = this.inlineStruct;
    const originalNestedStruct = this.nestedStruct;

    if (!originalParentName) {
      throw new Error('Struct field type must have a parent name.');
    }

    this.parentName =
      pascalCase(originalParentName) + pascalCase(structFieldType.name);
    this.nestedStruct = true;
    this.inlineStruct = false;

    const fieldManifest = visit(structFieldType.child, this);

    this.parentName = originalParentName;
    this.inlineStruct = originalInlineStruct;
    this.nestedStruct = originalNestedStruct;

    const fieldName = snakeCase(structFieldType.name);
    const docblock = this.createDocblock(structFieldType.docs);

    let derive = '';
    if (fieldManifest.type === 'Pubkey') {
      derive =
        '#[cfg_attr(feature = "serde", serde(with = "serde_with::As::<serde_with::DisplayFromStr>"))]\n';
    }

    return {
      ...fieldManifest,
      type: this.inlineStruct
        ? `${docblock}${derive}${fieldName}: ${fieldManifest.type},`
        : `${docblock}${derive}pub ${fieldName}: ${fieldManifest.type},`,
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
      return { type: 'bool', imports: new RustImportMap(), nestedStructs: [] };
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
      return {
        type: numberType.format,
        imports: new RustImportMap(),
        nestedStructs: [],
      };
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
      imports: new RustImportMap().add('solana_program::pubkey::Pubkey'),
      nestedStructs: [],
    };
  }

  visitStringType(stringType: nodes.StringTypeNode): RustTypeManifest {
    if (
      stringType.size.kind === 'prefixed' &&
      stringType.size.prefix.format === 'u32' &&
      stringType.size.prefix.endian === 'le'
    ) {
      return {
        type: 'String',
        imports: new RustImportMap(),
        nestedStructs: [],
      };
    }

    if (stringType.size.kind === 'fixed') {
      return {
        type: `[u8; ${stringType.size.value}]`,
        imports: new RustImportMap(),
        nestedStructs: [],
      };
    }

    if (stringType.size.kind === 'remainder') {
      return {
        type: `&str`,
        imports: new RustImportMap(),
        nestedStructs: [],
      };
    }

    // TODO: Add to the Rust validator.
    throw new Error('String size not supported by Borsh');
  }

  protected mergeManifests(
    manifests: RustTypeManifest[]
  ): Pick<RustTypeManifest, 'imports' | 'nestedStructs'> {
    return {
      imports: new RustImportMap().mergeWith(
        ...manifests.map((td) => td.imports)
      ),
      nestedStructs: manifests.flatMap((m) => m.nestedStructs),
    };
  }

  protected createDocblock(docs: string[]): string {
    if (docs.length <= 0) return '';
    const lines = docs.map((doc) => `/// ${doc}`);
    return `${lines.join('\n')}\n`;
  }
}
