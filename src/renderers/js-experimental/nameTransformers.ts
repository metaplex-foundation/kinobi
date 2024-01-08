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
  | 'accountType'
  | 'accountDataType'
  | 'accountDecodeFunction'
  | 'accountFetchFunction'
  | 'accountFetchAllFunction'
  | 'accountSafeFetchFunction'
  | 'accountSafeFetchAllFunction'
  | 'accountFetchFromSeedsFunction'
  | 'accountSafeFetchFromSeedsFunction'
  | 'accountGetSizeFunction'
  | 'scalarEnumVariant'
  | 'dataEnumDiscriminator'
  | 'dataEnumVariant'
  | 'dataEnumFunction'
  | 'isDataEnumFunction'
  | 'instructionAsyncInputType'
  | 'instructionAsyncInputWithSignersType'
  | 'instructionSyncInputType'
  | 'instructionSyncInputWithSignersType'
  | 'instructionType'
  | 'instructionWithSignersType'
  | 'instructionDataType'
  | 'instructionExtraType'
  | 'instructionAsyncFunction'
  | 'instructionSyncFunction'
  | 'instructionRawFunction'
  | 'instructionParsedType'
  | 'instructionParseFunction'
  | 'programType'
  | 'programAddressConstant'
  | 'programCreateFunction'
  | 'programAccountsEnum'
  | 'programAccountsEnumVariant'
  | 'programAccountsIdentifierFunction'
  | 'programInstructionsEnum'
  | 'programInstructionsEnumVariant'
  | 'programInstructionsIdentifierFunction'
  | 'programErrorClass'
  | 'programErrorCodeEnum'
  | 'programErrorCodeMap'
  | 'programGetErrorFromCodeFunction'
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
  accountType: (name) => `${pascalCase(name)}`,
  accountDataType: (name) => `${pascalCase(name)}AccountData`,
  accountDecodeFunction: (name) => `decode${pascalCase(name)}`,
  accountFetchFunction: (name) => `fetch${pascalCase(name)}`,
  accountFetchAllFunction: (name) => `fetchAll${pascalCase(name)}`,
  accountSafeFetchFunction: (name) => `safeFetch${pascalCase(name)}`,
  accountSafeFetchAllFunction: (name) => `safeFetchAll${pascalCase(name)}`,
  accountFetchFromSeedsFunction: (name) => `fetch${pascalCase(name)}FromSeeds`,
  accountSafeFetchFromSeedsFunction: (name) =>
    `safeFetch${pascalCase(name)}FromSeeds`,
  accountGetSizeFunction: (name) => `get${pascalCase(name)}Size`,
  scalarEnumVariant: (name) => `${pascalCase(name)}`,
  dataEnumDiscriminator: () => '__kind',
  dataEnumVariant: (name) => `${pascalCase(name)}`,
  dataEnumFunction: (name) => `${camelCase(name)}`,
  isDataEnumFunction: (name) => `is${pascalCase(name)}`,
  instructionAsyncInputType: (name) => `${pascalCase(name)}AsyncInput`,
  instructionAsyncInputWithSignersType: (name) =>
    `${pascalCase(name)}AsyncInputWithSigners`,
  instructionSyncInputType: (name) => `${pascalCase(name)}Input`,
  instructionSyncInputWithSignersType: (name) =>
    `${pascalCase(name)}InputWithSigners`,
  instructionType: (name) => `${pascalCase(name)}Instruction`,
  instructionWithSignersType: (name) =>
    `${pascalCase(name)}InstructionWithSigners`,
  instructionDataType: (name) => `${pascalCase(name)}InstructionData`,
  instructionExtraType: (name) => `${pascalCase(name)}InstructionExtra`,
  instructionAsyncFunction: (name) => `get${pascalCase(name)}InstructionAsync`,
  instructionSyncFunction: (name) => `get${pascalCase(name)}Instruction`,
  instructionRawFunction: (name) => `get${pascalCase(name)}InstructionRaw`,
  instructionParsedType: (name) => `Parsed${pascalCase(name)}Instruction`,
  instructionParseFunction: (name) => `parse${pascalCase(name)}Instruction`,
  programType: (name) => `${pascalCase(name)}Program`,
  programAddressConstant: (name) =>
    `${snakeCase(name).toUpperCase()}_PROGRAM_ADDRESS`,
  programCreateFunction: (name) => `get${pascalCase(name)}Program`,
  programAccountsEnum: (name) => `${pascalCase(name)}Account`,
  programAccountsEnumVariant: (name) => `${pascalCase(name)}`,
  programAccountsIdentifierFunction: (name) =>
    `identify${pascalCase(name)}Account`,
  programInstructionsEnum: (name) => `${pascalCase(name)}Instruction`,
  programInstructionsEnumVariant: (name) => `${pascalCase(name)}`,
  programInstructionsIdentifierFunction: (name) =>
    `identify${pascalCase(name)}Instruction`,
  programErrorClass: (name) => `${pascalCase(name)}ProgramError`,
  programErrorCodeEnum: (name) => `${pascalCase(name)}ProgramErrorCode`,
  programErrorCodeMap: (name) => `${camelCase(name)}ProgramErrorCodeMap`,
  programGetErrorFromCodeFunction: (name) =>
    `get${pascalCase(name)}ProgramErrorFromCode`,
  resolverFunction: (name) => `${camelCase(name)}`,
};
