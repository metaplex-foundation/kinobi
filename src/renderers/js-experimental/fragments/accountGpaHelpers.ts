import {
  AccountNode,
  FieldDiscriminatorNode,
  ProgramNode,
  SizeDiscriminatorNode,
  isNode,
  resolveNestedTypeNode,
} from '../../../nodes';
import { getGpaFieldsFromAccount } from '../../../shared';
import { getByteSizeVisitor, visit } from '../../../visitors';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment } from './common';

export function getAccountGpaHelpersFragment(
  scope: Pick<
    GlobalFragmentScope,
    'nameApi' | 'linkables' | 'typeManifestVisitor' | 'customAccountData'
  > & {
    accountNode: AccountNode;
    programNode: ProgramNode;
  }
): Fragment {
  const {
    accountNode,
    programNode,
    nameApi,
    linkables,
    typeManifestVisitor,
    customAccountData,
  } = scope;

  // Get GPA fields with byte offsets.
  const byteSizeVisitor = getByteSizeVisitor(linkables);
  const gpaFields = getGpaFieldsFromAccount(accountNode, byteSizeVisitor).map(
    (gpaField) => {
      const manifest = visit(gpaField.type, typeManifestVisitor);
      return { ...gpaField, manifest };
    }
  );

  if (gpaFields.length === 0) {
    return fragment('');
  }

  // Build the type annotation string: { 'key': TmKeyArgs; 'updateAuthority': Address; ... }
  const gpaFieldsType = `{ ${gpaFields
    .map((f) => `'${f.name}': ${f.manifest.looseType.render}`)
    .join('; ')} }`;

  // Build the argument string: { 'key': [0, getTmKeyEncoder()], ... }
  const gpaFieldsArgument = `{ ${gpaFields
    .map((f) => {
      const offset = f.offset === null ? 'null' : `${f.offset}`;
      return `'${f.name}': [${offset}, ${f.manifest.encoder.render}]`;
    })
    .join(', ')} }`;

  // Resolve discriminator.
  const discriminator =
    (accountNode.discriminators ?? []).find(
      (d) => !isNode(d, 'constantDiscriminatorNode')
    ) ?? null;

  let discriminatorCode = '';
  const discriminatorImportsFragment = fragment('');

  if (isNode(discriminator, 'fieldDiscriminatorNode')) {
    const discriminatorField = resolveNestedTypeNode(
      accountNode.data
    ).fields.find((f) => f.name === discriminator.name);
    const discriminatorValue = discriminatorField?.defaultValue
      ? visit(discriminatorField.defaultValue, typeManifestVisitor)
      : undefined;
    if (discriminatorValue) {
      discriminatorImportsFragment.mergeImportsWith(discriminatorValue.value);
      discriminatorCode = `.whereField('${discriminator.name}', ${discriminatorValue.value.render})`;
    }
  } else if (isNode(discriminator, 'sizeDiscriminatorNode')) {
    discriminatorCode = `.whereSize(${discriminator.size})`;
  }

  // Build the function name.
  const gpaBuilderFunction = nameApi.accountGpaBuilderFunction(
    accountNode.name
  );
  const programAddressConstant = nameApi.programAddressConstant(
    programNode.name
  );

  // Build the function code.
  const code =
    `export function ${gpaBuilderFunction}(` +
    `programAddress: Address = ${programAddressConstant}` +
    `) {\n` +
    `return gpaBuilder<${gpaFieldsType}>(programAddress, ${gpaFieldsArgument})` +
    `${discriminatorCode};\n` +
    `}`;

  // Build the fragment with all imports.
  const f = fragment(code)
    .addImports('solanaAddresses', ['Address'])
    .addImports('shared', ['gpaBuilder'])
    .addImports('generatedPrograms', [programAddressConstant]);

  // Merge imports from GPA field manifests (loose types and encoders).
  gpaFields.forEach((gpaField) => {
    f.mergeImportsWith(gpaField.manifest.looseType, gpaField.manifest.encoder);
  });

  // Merge discriminator value imports.
  f.mergeImportsWith(discriminatorImportsFragment);

  return f;
}
