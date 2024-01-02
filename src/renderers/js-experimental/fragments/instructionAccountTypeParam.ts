import {
  InstructionAccountNode,
  InstructionInputValueNode,
  InstructionNode,
  ProgramNode,
} from '../../../nodes';
import { LinkableDictionary, pascalCase } from '../../../shared';
import { ImportMap } from '../ImportMap';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment } from './common';

export function getInstructionAccountTypeParamFragment(
  scope: Pick<GlobalFragmentScope, 'linkables'> & {
    instructionNode: InstructionNode;
    instructionAccountNode: InstructionAccountNode;
    programNode: ProgramNode;
    allowAccountMeta: boolean;
  }
): Fragment {
  const {
    instructionNode,
    instructionAccountNode,
    programNode,
    allowAccountMeta,
    linkables,
  } = scope;
  const typeParam = `TAccount${pascalCase(instructionAccountNode.name)}`;
  const accountMeta = allowAccountMeta ? ' | IAccountMeta<string>' : '';
  const imports = new ImportMap();
  if (allowAccountMeta) {
    imports.add('solanaInstructions', 'IAccountMeta');
  }

  if (
    instructionNode.optionalAccountStrategy === 'omitted' &&
    instructionAccountNode.isOptional
  ) {
    return fragment(
      `${typeParam} extends string${accountMeta} | undefined = undefined`,
      imports
    );
  }

  const defaultAddress = getDefaultAddress(
    instructionAccountNode.defaultValue,
    programNode.publicKey,
    linkables
  );

  return fragment(
    `${typeParam} extends string${accountMeta} = ${defaultAddress}`,
    imports
  );
}

function getDefaultAddress(
  defaultValue: InstructionInputValueNode | undefined,
  programId: string,
  linkables: LinkableDictionary
): string {
  switch (defaultValue?.kind) {
    case 'publicKeyValueNode':
      return `"${defaultValue.publicKey}"`;
    case 'programLinkNode':
      const programNode = linkables.get(defaultValue);
      return programNode ? `"${programNode.publicKey}"` : 'string';
    case 'programIdValueNode':
      return `"${programId}"`;
    default:
      return 'string';
  }
}
