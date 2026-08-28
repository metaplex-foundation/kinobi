# Kinobi

Generate powerful clients for your Solana programs.

![](https://user-images.githubusercontent.com/3642397/217322233-828db66e-3691-47e7-a638-e87178a25cd3.png)

The Documentation of Kinobi can be found in the [Metaplex Developer Hub](https://developers.metaplex.com/umi/kinobi).

### Loading a Codama IDL

Kinobi can also load IDLs that follow the [Codama](https://github.com/codama-idl/codama) standard (v1) — for instance the `idl.json` shipped by [`solana-program/token-2022`](https://github.com/solana-program/token-2022):

```ts
import { createFromJson, renderJavaScriptVisitor } from '@metaplex-foundation/kinobi';
import fs from 'node:fs';

const kinobi = createFromJson(fs.readFileSync('token_2022.json', 'utf8'));
kinobi.accept(renderJavaScriptVisitor('clients/js/src/generated-token2022'));
```

On load, the tree is normalized to Kinobi conventions (names are camel-cased, defaults filled in, display-only metadata dropped).
