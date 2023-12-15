import {
  capitalize,
  titleCase,
  pascalCase,
  camelCase,
  kebabCase,
  snakeCase,
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
  | 'accountType'
  | 'accountSeedsType'
  // | 'accountData'
  | 'accountDecodeFunction'
  | 'accountFetchFunction'
  | 'accountFetchAllFunction'
  | 'accountSafeFetchFunction'
  | 'accountSafeFetchAllFunction'
  | 'accountFindPdaFunction'
  | 'accountFetchFromSeedsFunction'
  | 'accountSafeFetchFromSeedsFunction'
  | 'accountGetSizeFunction'
  | 'dataEnumFunction'
  | 'isDataEnumFunction'
  | 'instructionAsyncInputType'
  | 'instructionAsyncInputWithSignersType'
  | 'instructionSyncInputType'
  | 'instructionSyncInputWithSignersType'
  | 'instructionType'
  | 'instructionWithSignersType'
  // | 'instructionData'
  | 'instructionAsyncFunction'
  | 'instructionSyncFunction'
  | 'instructionRawFunction'
  | 'programType'
  | 'programAddressConstant'
  | 'programCreateFunction'
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
  accountType: (name) => `${pascalCase(name)}`,
  accountSeedsType: (name) => `${pascalCase(name)}Seeds`,
  // accountData: (name) => `${pascalCase(name)}AccountData`,
  accountDecodeFunction: (name) => `decode${pascalCase(name)}`,
  accountFetchFunction: (name) => `fetch${pascalCase(name)}`,
  accountFetchAllFunction: (name) => `fetchAll${pascalCase(name)}`,
  accountSafeFetchFunction: (name) => `safeFetch${pascalCase(name)}`,
  accountSafeFetchAllFunction: (name) => `safeFetchAll${pascalCase(name)}`,
  accountFindPdaFunction: (name) => `find${pascalCase(name)}Pda`,
  accountFetchFromSeedsFunction: (name) => `fetch${pascalCase(name)}FromSeeds`,
  accountSafeFetchFromSeedsFunction: (name) =>
    `safeFetch${pascalCase(name)}FromSeeds`,
  accountGetSizeFunction: (name) => `get${pascalCase(name)}Size`,
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
  // instructionData: (name) => `${pascalCase(name)}InstructionData`,
  instructionAsyncFunction: (name) => `get${pascalCase(name)}InstructionAsync`,
  instructionSyncFunction: (name) => `get${pascalCase(name)}Instruction`,
  instructionRawFunction: (name) => `get${pascalCase(name)}InstructionRaw`,
  programType: (name) => `${pascalCase(name)}Program`,
  programAddressConstant: (name) =>
    `${snakeCase(name).toUpperCase()}_PROGRAM_ADDRESS`,
  programCreateFunction: (name) => `create${pascalCase(name)}Program`,
  programErrorClass: (name) => `${pascalCase(name)}ProgramError`,
  programErrorCodeEnum: (name) => `${pascalCase(name)}ProgramErrorCode`,
  programErrorCodeMap: (name) => `${camelCase(name)}ProgramErrorCodeMap`,
  programGetErrorFromCodeFunction: (name) =>
    `get${pascalCase(name)}ProgramErrorFromCode`,
  resolverFunction: (name) => `${camelCase(name)}`,
};
