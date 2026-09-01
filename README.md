# Kinobi

Generate powerful clients for your Solana programs.

![](https://user-images.githubusercontent.com/3642397/217322233-828db66e-3691-47e7-a638-e87178a25cd3.png)

_Documentation coming soon..._

## Loading a Codama IDL

Kinobi can also load IDLs that follow the [Codama](https://github.com/codama-idl/codama) standard (v1) — for instance the `idl.json` shipped by [`solana-program/token-2022`](https://github.com/solana-program/token-2022):

```ts
import { createFromJson, renderJavaScriptVisitor } from '@metaplex-foundation/kinobi';
import fs from 'node:fs';

const kinobi = createFromJson(fs.readFileSync('idl.json', 'utf8'));
kinobi.accept(renderJavaScriptVisitor('clients/js/src/generated-token2022'));
```

On load, the Codama tree is normalized to Kinobi's node model (names are camel-cased, defaults filled in, display-only metadata dropped, `count` nodes mapped to `size` nodes, and size-prefixed strings/bytes collapsed to their native sized form) and re-stamped with the `kinobi` standard. The JavaScript (Umi) renderer then emits serializers for the Codama-standard type nodes — `zeroableOptionTypeNode`, `remainderOptionTypeNode`, `sizePrefixTypeNode`, `fixedSizeTypeNode`, `hiddenPrefixTypeNode`, and padded `preOffsetTypeNode` — backed by helpers emitted into the generated `shared` folder only when used.
