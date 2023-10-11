import * as nodes from '../../../nodes';
import { getGpaFieldsFromAccount, pascalCase } from '../../../shared';
import { Visitor, visit } from '../../../visitors';
import { ImportMap } from '../ImportMap';
import { TypeManifest } from '../TypeManifest';
import { Fragment, fragmentFromTemplate } from './common';
import { getValueNodeFragment } from './valueNode';

export function getAccountGpaHelpersFragment(
  accountNode: nodes.AccountNode,
  programNode: nodes.ProgramNode,
  typeManifestVisitor: Visitor<TypeManifest>,
  byteSizeVisitor: Visitor<number | null>
): Fragment {
  const imports = new ImportMap();

  // Discriminator.
  const { discriminator } = accountNode;
  let resolvedDiscriminator:
    | { kind: 'size'; value: string }
    | { kind: 'field'; name: string; value: string }
    | null = null;
  if (discriminator?.kind === 'field') {
    const discriminatorField = accountNode.data.struct.fields.find(
      (f) => f.name === discriminator.name
    );
    const discriminatorValue = discriminatorField?.defaultsTo?.value
      ? getValueNodeFragment(discriminatorField.defaultsTo.value)
      : undefined;
    if (discriminatorValue) {
      imports.mergeWith(discriminatorValue.imports);
      resolvedDiscriminator = {
        kind: 'field',
        name: discriminator.name,
        value: discriminatorValue.render,
      };
    }
  } else if (discriminator?.kind === 'size') {
    resolvedDiscriminator =
      accountNode.size !== undefined
        ? { kind: 'size', value: `${accountNode.size}` }
        : null;
  }

  // GPA Fields.
  const gpaFields = getGpaFieldsFromAccount(accountNode, byteSizeVisitor).map(
    (gpaField) => {
      const gpaFieldManifest = visit(gpaField.type, typeManifestVisitor);
      imports.mergeWith(gpaFieldManifest.looseType, gpaFieldManifest.encoder);
      return { ...gpaField, manifest: gpaFieldManifest };
    }
  );
  let resolvedGpaFields: { type: string; argument: string } | null = null;
  if (gpaFields.length > 0) {
    imports.add('umi', ['gpaBuilder']);
    resolvedGpaFields = {
      type: `{ ${gpaFields
        .map((f) => `'${f.name}': ${f.manifest.looseType.render}`)
        .join(', ')} }`,
      argument: `{ ${gpaFields
        .map((f) => {
          const offset = f.offset === null ? 'null' : `${f.offset}`;
          return `'${f.name}': [${offset}, ${f.manifest.encoder.render}]`;
        })
        .join(', ')} }`,
    };
  }

  return fragmentFromTemplate('accountGpaHelpers.njk', {
    pascalCaseName: pascalCase(accountNode.name),
    program: programNode,
    discriminator: resolvedDiscriminator,
    gpaFields: resolvedGpaFields,
  })
    .mergeImportsWith(imports)
    .addImports('some-magical-place', ['GpaBuilder', 'Context', 'gpaBuilder']);
}
