export default {
  node: 'rootNode',
  programs: [
    {
      node: 'programNode',
      name: 'splSystem',
      address: '11111111111111111111111111111111',
      version: '0.0.1',
      origin: 'shank',
      accounts: [
        {
          node: 'accountNode',
          name: 'nonce',
          pda: 'nonce',
          data: {
            node: 'accountDataNode',
            struct: {
              node: 'structTypeNode',
              fields: [
                {
                  node: 'structFieldTypeNode',
                  name: 'version',
                  type: { node: 'linkTypeNode', name: 'nonceVersion' },
                },
                {
                  node: 'structFieldTypeNode',
                  name: 'state',
                  type: { node: 'linkTypeNode', name: 'nonceState' },
                },
                {
                  node: 'structFieldTypeNode',
                  name: 'authority',
                  type: { node: 'publicKeyTypeNode' },
                },
                {
                  node: 'structFieldTypeNode',
                  name: 'blockhash',
                  type: { node: 'publicKeyTypeNode' },
                },
                {
                  node: 'structFieldTypeNode',
                  name: 'lamportsPerSignature',
                  type: { node: 'numberTypeNode', format: 'u64' },
                },
              ],
            },
          },
        },
      ],
      pdas: [
        {
          node: 'pdaNode',
          name: 'nonce',
          seeds: [
            {
              node: 'variablePdaSeedNode',
              name: 'authority',
              type: { node: 'publicKeyTypeNode' },
              docs: ["The address of the LUT's authority"],
            },
            {
              node: 'variablePdaSeedNode',
              name: 'recentSlot',
              type: { node: 'numberTypeNode', format: 'u64' },
              docs: ['The recent slot associated with the LUT'],
            },
          ],
        },
      ],
      instructions: [
        {
          node: 'instructionNode',
          name: 'createAccount',
          optionalAccountStrategy: 'programId',
          accounts: [
            {
              node: 'instructionAccountNode',
              name: 'payer',
              isWritable: true,
              isSigner: true,
              isOptional: false,
              docs: [],
              defaultsTo: { node: 'payerContextualValueNode' },
            },
            {
              node: 'instructionAccountNode',
              name: 'newAccount',
              isWritable: true,
              isSigner: true,
              isOptional: false,
            },
          ],
          discriminators: [
            {
              node: 'fieldInstructionDiscriminatorNode',
              field: 'discriminator',
              offset: 0,
            },
          ],
          dataArgs: {
            node: 'instructionDataArgsNode',
            struct: {
              node: 'structTypeNode',
              fields: [
                {
                  node: 'structFieldTypeNode',
                  name: 'discriminator',
                  type: { node: 'numberTypeNode', format: 'u32' },
                  defaultStrategy: 'optional',
                  defaultsTo: {
                    node: 'numberValueNode',
                    value: 0,
                  },
                },
                {
                  node: 'structFieldTypeNode',
                  name: 'lamports',
                  type: { node: 'numberTypeNode', format: 'u64' },
                },
                {
                  node: 'structFieldTypeNode',
                  name: 'space',
                  type: { node: 'numberTypeNode', format: 'u64' },
                },
                {
                  node: 'structFieldTypeNode',
                  name: 'programId',
                  type: { node: 'publicKeyTypeNode' },
                },
              ],
            },
          },
        },
      ],
      types: [
        {
          node: 'definedTypeNode',
          name: 'nonceVersion',
          type: {
            node: 'enumTypeNode',
            size: { node: 'numberTypeNode', format: 'u32' },
            variants: [
              { node: 'enumEmptyVariantTypeNode', name: 'Legacy' },
              { node: 'enumEmptyVariantTypeNode', name: 'Current' },
            ],
          },
        },
        {
          node: 'definedTypeNode',
          name: 'nonceState',
          type: {
            node: 'enumTypeNode',
            size: { node: 'numberTypeNode', format: 'u32' },
            variants: [
              { node: 'enumEmptyVariantTypeNode', name: 'Uninitialized' },
              { node: 'enumEmptyVariantTypeNode', name: 'Initialized' },
            ],
          },
        },
      ],
      errors: [
        {
          node: 'errorNode',
          code: 0,
          name: 'accountAlreadyInUse',
          message: 'an account with the same address already exists',
          docs: [],
        },
        {
          node: 'errorNode',
          code: 1,
          name: 'resultWithNegativeLamports',
          message: 'account does not have enough SOL to perform the operation',
          docs: [],
        },
        {
          node: 'errorNode',
          code: 2,
          name: 'invalidProgramId',
          message: 'cannot assign account to this program id',
          docs: [],
        },
        {
          node: 'errorNode',
          code: 3,
          name: 'invalidAccountDataLength',
          message: 'cannot allocate account data of this length',
          docs: [],
        },
        {
          code: 4,
          name: 'maxSeedLengthExceeded',
          message: 'length of requested seed is too long',
          docs: [],
        },
        {
          node: 'errorNode',
          code: 5,
          name: 'addressWithSeedMismatch',
          message:
            'provided address does not match addressed derived from seed',
          docs: [],
        },
        {
          node: 'errorNode',
          code: 6,
          name: 'nonceNoRecentBlockhashes',
          message:
            'advancing stored nonce requires a populated RecentBlockhashes sysvar',
          docs: [],
        },
        {
          node: 'errorNode',
          code: 7,
          name: 'nonceBlockhashNotExpired',
          message: 'stored nonce is still in recent_blockhashes',
          docs: [],
        },
        {
          node: 'errorNode',
          code: 8,
          name: 'nonceUnexpectedBlockhashValue',
          message: 'specified nonce does not match stored nonce',
          docs: [],
        },
      ],
    },
  ],
};
