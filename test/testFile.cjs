const k = require('../dist/cjs/index.js');
const {
  publicKeyTypeNode,
} = require('../dist/cjs/nodes/typeNodes/PublicKeyTypeNode.js');

const kinobi = k.createFromIdls([
  __dirname + '/spl_memo.json',
  __dirname + '/spl_system.json',
  __dirname + '/mpl_candy_machine_core.json',
  __dirname + '/mpl_token_auth_rules.json',
  __dirname + '/mpl_token_metadata.json',
]);

kinobi.update(
  k.updateProgramsVisitor({
    candyMachineCore: { name: 'mplCandyMachineCore', prefix: 'Cm' },
    mplTokenAuthRules: { prefix: 'Ta' },
    mplTokenMetadata: { prefix: 'Tm' },
  })
);

kinobi.update(
  k.updateAccountsVisitor({
    Metadata: { size: 679 },
    MasterEditionV1: {
      seeds: [
        k.constantPdaSeedNodeFromString('metadata'),
        k.programIdPdaSeedNode(),
        k.variablePdaSeedNode(
          'delegateRole',
          k.definedTypeLinkNode('delegateRole'),
          'The role of the delegate'
        ),
      ],
    },
    MasterEditionV2: {
      size: 282,
      seeds: [
        k.constantPdaSeedNodeFromString('metadata'),
        k.programIdPdaSeedNode(),
        k.variablePdaSeedNode(
          'mint',
          publicKeyTypeNode(),
          'The address of the mint account'
        ),
        k.constantPdaSeedNodeFromString('edition'),
      ],
    },
    delegateRecord: {
      size: 282,
      seeds: [
        k.constantPdaSeedNodeFromString('delegate_record'),
        k.programIdPdaSeedNode(),
        k.variablePdaSeedNode(
          'role',
          k.definedTypeLinkNode('delegateRole'),
          'The delegate role'
        ),
      ],
    },
    FrequencyAccount: {
      seeds: [
        k.constantPdaSeedNodeFromString('frequency_pda'),
        k.programIdPdaSeedNode(),
      ],
    },
  })
);

kinobi.update(
  k.updateDefinedTypesVisitor({
    'mplCandyMachineCore.Creator': { name: 'CmCreator' },
    'mplTokenAuthRules.Key': { name: 'TaKey' },
    'mplTokenMetadata.Key': { name: 'TmKey' },
    'mplTokenMetadata.CreateArgs': { name: 'TmCreateArgs' },
    'mplTokenAuthRules.CreateArgs': { name: 'TaCreateArgs' },
  })
);

kinobi.update(
  k.updateInstructionsVisitor({
    'mplTokenAuthRules.Create': {
      name: 'CreateRuleSet',
      arguments: {
        ruleSetBump: { defaultValue: k.accountBumpValueNode('ruleSetPda') },
      },
    },
    'mplCandyMachineCore.Update': { name: 'UpdateCandyMachine' },
    CreateMetadataAccount: {
      byteDeltas: [k.instructionByteDeltaNode(k.accountLinkNode('Metadata'))],
      accounts: {
        metadata: { defaultValue: k.pdaValueNode('metadata') },
      },
      arguments: {
        metadataBump: { defaultValue: k.accountBumpValueNode('metadata') },
      },
    },
    CreateMetadataAccountV3: {
      accounts: {
        metadata: { defaultValue: k.pdaValueNode('metadata') },
      },
    },
    CreateMasterEditionV3: {
      byteDeltas: [
        k.instructionByteDeltaNode(k.accountLinkNode('MasterEditionV2')),
      ],
    },
    'mplCandyMachineCore.Mint': {
      name: 'MintFromCandyMachine',
      accounts: {
        nftMintAuthority: { defaultValue: k.identityValueNode() },
      },
    },
    Dummy: {
      accounts: {
        mintAuthority: { defaultValue: k.accountValueNode('updateAuthority') },
        edition: { defaultValue: k.accountValueNode('payer') },
        foo: { defaultValue: k.accountValueNode('bar') },
        bar: {
          defaultValue: k.programIdValueNode(),
          isOptional: true,
        },
        delegateRecord: {
          defaultValue: k.conditionalValueNode({
            condition: k.accountValueNode('delegate'),
            ifTrue: k.pdaValueNode('delegateRecord', [
              k.pdaSeedValueNode(
                'role',
                k.enumValueNode('delegateRole', 'Collection')
              ),
            ]),
          }),
        },
        tokenOrAtaProgram: {
          defaultValue: k.conditionalValueNode({
            condition: k.resolverValueNode('resolveTokenOrAta', [
              k.argumentValueNode('proof'),
            ]),
            ifTrue: k.publicKeyValueNode(
              'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
            ),
            ifFalse: k.publicKeyValueNode(
              'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
            ),
          }),
        },
      },
      arguments: {
        identityArg: {
          type: k.publicKeyTypeNode(),
          defaultValue: k.identityValueNode(),
        },
        proof: {
          type: k.arrayTypeNode(k.publicKeyTypeNode(), k.remainderSizeNode()),
          defaultValue: k.arrayValueNode([]),
        },
      },
      remainingAccounts: [
        k.instructionRemainingAccountsNode(k.argumentValueNode('proof')),
      ],
    },
    DeprecatedCreateReservationList: { name: 'CreateReservationList' },
    Transfer: {
      accounts: {
        masterEdition: {
          defaultValue: k.resolverValueNode(
            'resolveMasterEditionFromTokenStandard',
            [k.accountValueNode('mint'), k.argumentValueNode('tokenStandard')]
          ),
        },
      },
      arguments: {
        tokenStandard: {
          type: k.definedTypeLinkNode('tokenStandard'),
          defaultValue: k.enumValueNode('tokenStandard', 'NonFungible'),
        },
      },
    },
    addMemo: {
      remainingAccounts: [
        k.instructionRemainingAccountsNode(k.argumentValueNode('signers'), {
          isSigner: true,
        }),
      ],
    },
  })
);

const tmKey = (name) => ({
  field: 'key',
  value: k.enumValueNode('TmKey', name),
});
const taKey = (name) => ({
  field: 'key',
  value: k.enumValueNode('TaKey', name),
});
kinobi.update(
  k.setAccountDiscriminatorFromFieldVisitor({
    'mplTokenMetadata.Edition': tmKey('EditionV1'),
    'mplTokenMetadata.MasterEditionV1': tmKey('MasterEditionV1'),
    'mplTokenMetadata.ReservationListV1': tmKey('ReservationListV1'),
    'mplTokenMetadata.Metadata': tmKey('MetadataV1'),
    'mplTokenMetadata.ReservationListV2': tmKey('ReservationListV2'),
    'mplTokenMetadata.MasterEditionV2': tmKey('MasterEditionV2'),
    'mplTokenMetadata.EditionMarker': tmKey('EditionMarker'),
    'mplTokenMetadata.UseAuthorityRecord': tmKey('UseAuthorityRecord'),
    'mplTokenMetadata.CollectionAuthorityRecord': tmKey(
      'CollectionAuthorityRecord'
    ),
    'mplTokenMetadata.TokenOwnedEscrow': tmKey('TokenOwnedEscrow'),
    'mplTokenMetadata.DelegateRecord': tmKey('Delegate'),
    'mplTokenAuthRules.FrequencyAccount': taKey('Frequency'),
  })
);

kinobi.update(
  k.setStructDefaultValuesVisitor({
    'mplTokenMetadata.Collection': {
      verified: k.booleanValueNode(false),
    },
    'mplTokenMetadata.UpdateArgs.V1': {
      tokenStandard: k.someValueNode(
        k.enumValueNode('TokenStandard', 'NonFungible')
      ),
    },
  })
);

kinobi.update(
  k.setNumberWrappersVisitor({
    'DelegateArgs.SaleV1.amount': { kind: 'SolAmount' },
    'CandyMachineData.sellerFeeBasisPoints': {
      kind: 'Amount',
      decimals: 2,
      unit: '%',
    },
  })
);

kinobi.update(
  k.createSubInstructionsFromEnumArgsVisitor({
    'mplTokenMetadata.Create': 'createArgs',
    'mplTokenMetadata.Update': 'updateArgs',
  })
);

kinobi.update(k.unwrapTupleEnumWithSingleStructVisitor(['payloadType.*']));

kinobi.update(k.unwrapDefinedTypesVisitor(['Data']));
kinobi.update(
  k.flattenStructVisitor({
    'mplTokenMetadata.Metadata': ['Data'],
  })
);

const kinobiJson = kinobi.getJson();
const kinobiReconstructed = k.createFromJson(kinobiJson);

// kinobi.accept(k.consoleLogVisitor(k.getDebugStringVisitor({ indent: true })));

/**
 * Render clients.
 */

kinobiReconstructed.accept(
  k.renderJavaScriptVisitor('./test/packages/js/src/generated', {
    customAccountData: [{ name: 'ReservationListV1', extract: true }],
    customInstructionData: ['CreateReservationList'],
  })
);

kinobiReconstructed.accept(
  k.renderJavaScriptExperimentalVisitor(
    './test/packages/js-experimental/src/generated',
    {
      asyncResolvers: ['resolveMasterEditionFromTokenStandard'],
      customAccountData: [{ name: 'ReservationListV1', extract: true }],
      customInstructionData: ['CreateReservationList'],
    }
  )
);

kinobiReconstructed.accept(
  k.renderRustVisitor('./test/packages/rust/src/generated', {
    crateFolder: './test/packages/rust',
    formatCode: true,
  })
);
