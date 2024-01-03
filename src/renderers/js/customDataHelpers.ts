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

export type CustomDataOptions =
  | string
  | {
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
      const options = typeof o === 'string' ? { name: o } : o;
      const importAs = mainCase(
        options.importAs ?? `${options.name}${defaultSuffix}`
      );
      const importFrom = options.importFrom ?? 'hooked';
      return [
        mainCase(options.name),
        {
          importAs,
          importFrom,
          extractAs: options.extractAs ? mainCase(options.extractAs) : importAs,
          extract: options.extract ?? false,
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
          type: { ...node.data },
          idlName: node.idlName,
        }),
      ];
    }

    return [
      definedTypeNode({
        name: options.extractAs,
        type: structTypeNodeFromInstructionArgumentNodes(node.arguments),
        idlName: node.idlName,
      }),
    ];
  });
