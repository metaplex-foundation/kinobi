import {
  AccountNode,
  DefinedTypeLinkNode,
  DefinedTypeNode,
  InstructionNode,
  definedTypeLinkNode,
  definedTypeNode,
  isNode,
  structTypeNodeFromInstructionArgumentNodes,
} from '../../nodes';
import { ImportFrom, MainCaseString, mainCase } from '../../shared';

export type CustomDataOptions = {
  name: string;
  importAs?: string;
  importFrom?: ImportFrom;
  extractAs?: string;
  extract?: boolean;
};

export type ParsedCustomDataOptions = Map<
  MainCaseString,
  {
    importAs: MainCaseString;
    importFrom: ImportFrom;
    extractAs: MainCaseString;
    extract: boolean;
    linkNode: DefinedTypeLinkNode;
  }
>;

export const parseCustomDataOptions = (
  customDataOptions: CustomDataOptions[],
  defaultSuffix: string
): ParsedCustomDataOptions =>
  new Map(
    customDataOptions.map((o) => {
      const importAs = mainCase(o.importAs ?? `${o.name}${defaultSuffix}`);
      const importFrom = o.importFrom ?? 'hooked';
      return [
        mainCase(o.name),
        {
          importAs,
          importFrom,
          extractAs: o.extractAs ? mainCase(o.extractAs) : importAs,
          extract: o.extract ?? true,
          linkNode: definedTypeLinkNode(importAs, importFrom),
        },
      ];
    })
  );

export const getDefinedTypeNodesToExtract = (
  nodes: AccountNode[] | InstructionNode[],
  parsedCustomDataOptions: ParsedCustomDataOptions
): DefinedTypeNode[] =>
  nodes.flatMap((node) => {
    const options = parsedCustomDataOptions.get(node.name);
    if (!options || !options.extract) return [];

    if (isNode(node, 'accountNode')) {
      return [
        definedTypeNode({
          name: options.extractAs,
          type: { ...node.data.struct },
          idlName: node.idlName,
        }),
      ];
    }

    return [
      definedTypeNode({
        name: options.extractAs,
        type: structTypeNodeFromInstructionArgumentNodes(
          node.dataArgs.dataArguments
        ),
        idlName: node.idlName,
      }),
    ];
  });
