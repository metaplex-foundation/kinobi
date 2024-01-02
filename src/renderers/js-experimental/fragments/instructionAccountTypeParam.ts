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
    instructionAccountNode.defaultsTo,
    programNode.publicKey,
    linkables
  );

  return fragment(
    `${typeParam} extends string${accountMeta} = ${defaultAddress}`,
    imports
  );
}

function getDefaultAddress(
  defaultsTo: InstructionInputValueNode | undefined,
  programId: string,
  linkables: LinkableDictionary
): string {
  switch (defaultsTo?.kind) {
    case 'publicKeyValueNode':
      return `"${defaultsTo.publicKey}"`;
    case 'programLinkNode':
      const programNode = linkables.get(defaultsTo);
      return programNode ? `"${programNode.publicKey}"` : 'string';
    case 'programIdValueNode':
      return `"${programId}"`;
    default:
      return 'string';
  }
}
