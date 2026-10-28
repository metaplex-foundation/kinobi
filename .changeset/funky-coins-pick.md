---
'@metaplex-foundation/kinobi': patch
---

Fix missing imports for fixed-size option serializers in nested GPA fields (registerNestedFieldsFromStruct), which made generated clients such as Genesis fail to compile.
