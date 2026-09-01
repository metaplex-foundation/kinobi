import test from 'ava';
import {
  createFromJson,
  createFromRoot,
  MainCaseString,
  programNode,
  rootNode,
} from '../src';

const codamaRoot = () => ({
  kind: 'rootNode',
  standard: 'codama',
  version: '1.0.0',
  program: {
    kind: 'programNode',
    name: 'token-2022',
    publicKey: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
    version: '1.0.0',
    docs: [],
    accounts: [],
    instructions: [
      {
        kind: 'instructionNode',
        name: 'initializeMint',
        docs: [],
        optionalAccountStrategy: 'programId',
        accounts: [],
        arguments: [
          {
            kind: 'instructionArgumentNode',
            name: 'extensions',
            docs: [],
            type: {
              kind: 'remainderOptionTypeNode',
              item: { kind: 'publicKeyTypeNode' },
            },
          },
        ],
        display: [{ kind: 'instructionDisplayNode' }],
      },
    ],
    definedTypes: [],
    pdas: [],
    errors: [],
  },
  additionalPrograms: [],
});

test('it loads codama-standard IDLs and normalizes them', (t) => {
  const kinobi = createFromJson(JSON.stringify(codamaRoot()));
  const root = kinobi.getRoot();

  // The root is re-stamped with the kinobi standard.
  t.is(root.standard, 'kinobi');

  // Names are main-cased and defaults are filled in by the node builders.
  t.is(root.program.name, 'token2022' as MainCaseString);
  t.is(root.program.prefix, '' as MainCaseString);
  const instruction = root.program.instructions[0];
  t.is(instruction.idlName, 'initializeMint');

  // Unknown metadata keys are dropped.
  t.false('display' in instruction);

  // The remainder option argument type survives the normalization.
  t.is(instruction.arguments[0].type.kind, 'remainderOptionTypeNode');
});

test('it rejects unsupported codama standard versions', (t) => {
  const root = { ...codamaRoot(), version: '2.0.0' };
  t.throws(() => createFromJson(JSON.stringify(root)), {
    message: /Codama standard/,
  });
});

test('it still loads kinobi-standard roots', (t) => {
  const root = rootNode(
    programNode({
      name: 'myProgram',
      publicKey: '11111111111111111111111111111111',
    })
  );
  const kinobi = createFromRoot(root, false);
  t.is(kinobi.getRoot().standard, 'kinobi');
  t.is(kinobi.getRoot().program.name, 'myProgram' as MainCaseString);
});
