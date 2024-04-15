import {
  camelCase,
  capitalize,
  kebabCase,
  pascalCase,
  snakeCase,
  titleCase,
} from '../../shared';

export type NameTransformerHelpers = {
  capitalize: (name: string) => string;
  titleCase: (name: string) => string;
  pascalCase: (name: string) => string;
  camelCase: (name: string) => string;
  kebabCase: (name: string) => string;
  snakeCase: (name: string) => string;
};

export type NameTransformer = (
  name: string,
  helpers: NameTransformerHelpers
) => string;

export type NameTransformerKey =
  | 'dataType'
  | 'dataArgsType'
  | 'encoderFunction'
  | 'decoderFunction'
  | 'codecFunction'
  | 'pdaSeedsType'
  | 'pdaFindFunction'
  | 'accountDecodeFunction'
  | 'accountFetchFunction'
  | 'accountFetchAllFunction'
  | 'accountFetchMaybeFunction'
  | 'accountFetchAllMaybeFunction'
  | 'accountFetchFromSeedsFunction'
  | 'accountFetchMaybeFromSeedsFunction'
  | 'accountGetSizeFunction'
  | 'enumVariant'
  | 'discriminatedUnionDiscriminator'
  | 'discriminatedUnionVariant'
  | 'discriminatedUnionFunction'
  | 'isDiscriminatedUnionFunction'
  | 'instructionAsyncInputType'
  | 'instructionSyncInputType'
  | 'instructionType'
  | 'instructionDataType'
  | 'instructionExtraType'
  | 'instructionAsyncFunction'
  | 'instructionSyncFunction'
  | 'instructionParsedType'
  | 'instructionParseFunction'
  | 'programAddressConstant'
  | 'programAccountsEnum'
  | 'programAccountsEnumVariant'
  | 'programAccountsIdentifierFunction'
  | 'programInstructionsEnum'
  | 'programInstructionsEnumVariant'
  | 'programInstructionsIdentifierFunction'
  | 'programInstructionsParsedUnionType'
  | 'programErrorConstantPrefix'
  | 'programErrorConstant'
  | 'programErrorUnion'
  | 'programErrorMessagesMap'
  | 'programGetErrorMessageFunction'
  | 'resolverFunction';

export type NameTransformers = Record<NameTransformerKey, NameTransformer>;

export type NameApi = Record<NameTransformerKey, (name: string) => string>;

export function getNameApi(transformers: NameTransformers): NameApi {
  const helpers = {
    capitalize,
    titleCase,
    pascalCase,
    camelCase,
    kebabCase,
    snakeCase,
  };
  return Object.fromEntries(
    Object.entries(transformers).map(([key, transformer]) => [
      key,
      (name: string) => transformer(name, helpers),
    ])
  ) as NameApi;
}

export const DEFAULT_NAME_TRANSFORMERS: NameTransformers = {
  dataType: (name) => `${pascalCase(name)}`,
  dataArgsType: (name) => `${pascalCase(name)}Args`,
  encoderFunction: (name) => `get${pascalCase(name)}Encoder`,
  decoderFunction: (name) => `get${pascalCase(name)}Decoder`,
  codecFunction: (name) => `get${pascalCase(name)}Codec`,
  pdaSeedsType: (name) => `${pascalCase(name)}Seeds`,
  pdaFindFunction: (name) => `find${pascalCase(name)}Pda`,
  accountDecodeFunction: (name) => `decode${pascalCase(name)}`,
  accountFetchFunction: (name) => `fetch${pascalCase(name)}`,
  accountFetchAllFunction: (name) => `fetchAll${pascalCase(name)}`,
  accountFetchMaybeFunction: (name) => `fetchMaybe${pascalCase(name)}`,
  accountFetchAllMaybeFunction: (name) => `fetchAllMaybe${pascalCase(name)}`,
  accountFetchFromSeedsFunction: (name) => `fetch${pascalCase(name)}FromSeeds`,
  accountFetchMaybeFromSeedsFunction: (name) =>
    `fetchMaybe${pascalCase(name)}FromSeeds`,
  accountGetSizeFunction: (name) => `get${pascalCase(name)}Size`,
  enumVariant: (name) => `${pascalCase(name)}`,
  discriminatedUnionDiscriminator: () => '__kind',
  discriminatedUnionVariant: (name) => `${pascalCase(name)}`,
  discriminatedUnionFunction: (name) => `${camelCase(name)}`,
  isDiscriminatedUnionFunction: (name) => `is${pascalCase(name)}`,
  instructionAsyncInputType: (name) => `${pascalCase(name)}AsyncInput`,
  instructionSyncInputType: (name) => `${pascalCase(name)}Input`,
  instructionType: (name) => `${pascalCase(name)}Instruction`,
  instructionDataType: (name) => `${pascalCase(name)}InstructionData`,
  instructionExtraType: (name) => `${pascalCase(name)}InstructionExtra`,
  instructionAsyncFunction: (name) => `get${pascalCase(name)}InstructionAsync`,
  instructionSyncFunction: (name) => `get${pascalCase(name)}Instruction`,
  instructionParsedType: (name) => `Parsed${pascalCase(name)}Instruction`,
  instructionParseFunction: (name) => `parse${pascalCase(name)}Instruction`,
  programAddressConstant: (name) =>
    `${snakeCase(name).toUpperCase()}_PROGRAM_ADDRESS`,
  programAccountsEnum: (name) => `${pascalCase(name)}Account`,
  programAccountsEnumVariant: (name) => `${pascalCase(name)}`,
  programAccountsIdentifierFunction: (name) =>
    `identify${pascalCase(name)}Account`,
  programInstructionsEnum: (name) => `${pascalCase(name)}Instruction`,
  programInstructionsEnumVariant: (name) => `${pascalCase(name)}`,
  programInstructionsIdentifierFunction: (name) =>
    `identify${pascalCase(name)}Instruction`,
  programInstructionsParsedUnionType: (name) =>
    `Parsed${pascalCase(name)}Instruction`,
  programErrorConstantPrefix: (name) =>
    `${snakeCase(name)}_ERROR__`.toUpperCase(),
  programErrorConstant: (name) => snakeCase(name).toUpperCase(),
  programErrorUnion: (name) => `${pascalCase(name)}Error`,
  programErrorMessagesMap: (name) => `${camelCase(name)}ErrorMessages`,
  programGetErrorMessageFunction: (name) =>
    `get${pascalCase(name)}ErrorMessage`,
  resolverFunction: (name) => `${camelCase(name)}`,
};
