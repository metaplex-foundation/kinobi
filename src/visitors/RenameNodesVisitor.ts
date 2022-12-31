import * as nodes from '../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

type RenameMap = Record<string, string | ProgramOptions>;

type ProgramOptions = {
  name?: string;
  prefix?: string;
  instructions?: Record<string, string | InstructionOptions>;
  accounts?: Record<string, string | AccountOptions>;
  types?: Record<string, string | TypeOptions>;
  errors?: Record<string, string>;
};

type InstructionOptions = {
  name?: string;
  accounts?: Record<string, string>;
  args?: Record<string, string>;
};

type AccountOptions = {
  name?: string;
  fields?: Record<string, string>;
};

type TypeOptions = {
  name?: string;
  fields?: Record<string, string>;
};

export class RenameNodesVisitor extends TransformNodesVisitor {
  constructor(renameMap: RenameMap) {
    const transforms: NodeTransform[] = Object.entries(renameMap).flatMap(
      ([program, programOptions]) => {
        const programTransform = programNodeTransform(program, programOptions);
        if (typeof programOptions === 'string') return programTransform;
        return [
          ...programTransform,
          ...Object.entries(programOptions.instructions ?? {}).map(
            (args): NodeTransform => instructionNodeTransform(program, ...args)
          ),
          ...Object.entries(programOptions.accounts ?? {}).map(
            (args): NodeTransform => accountNodeTransform(program, ...args)
          ),
          ...Object.entries(programOptions.types ?? {}).map(
            (args): NodeTransform => typeNodeTransform(program, ...args)
          ),
          ...Object.entries(programOptions.errors ?? {}).map(
            (args): NodeTransform => errorNodeTransform(program, ...args)
          ),
        ];
      }
    );

    super(transforms);
  }
}

function programNodeTransform(
  program: string,
  options: string | ProgramOptions
): NodeTransform[] {
  const programTransform: NodeTransform[] = [];
  const newProgramName = typeof options === 'string' ? options : options.name;
  const newProgramPrefix =
    typeof options === 'string' ? undefined : options.prefix;

  if (newProgramName || newProgramPrefix) {
    programTransform.push({
      selector: { program },
      transformer: (node: nodes.Node) => {
        nodes.assertProgramNode(node);
        return new nodes.ProgramNode(
          node.idl,
          {
            ...node.metadata,
            name: newProgramName ?? node.metadata.name,
            prefix: newProgramPrefix ?? node.metadata.prefix,
          },
          node.accounts,
          node.instructions,
          node.definedTypes,
          node.errors
        );
      },
    });
  }

  return programTransform;
}

function instructionNodeTransform(
  program: string,
  instruction: string,
  options: string | InstructionOptions
): NodeTransform {
  return {
    selector: { instruction, program },
    transformer: (node: nodes.Node) => {
      nodes.assertInstructionNode(node);

      if (typeof options === 'string') {
        return new nodes.InstructionNode(
          options,
          node.accounts,
          node.args,
          node.metadata
        );
      }

      const newName = options.name ?? node.name;
      const accountMap = options.accounts ?? {};
      const argMap = options.args ?? {};
      return new nodes.InstructionNode(
        newName,
        node.accounts.map((account) => ({
          ...account,
          name: accountMap[account.name] ?? account.name,
        })),
        mapStructFields(node.args, argMap, `${newName}InstructionArgs`),
        node.metadata
      );
    },
  };
}

function accountNodeTransform(
  program: string,
  account: string,
  options: string | AccountOptions
): NodeTransform {
  return {
    selector: { account, program },
    transformer: (node: nodes.Node) => {
      nodes.assertAccountNode(node);

      if (typeof options === 'string') {
        return new nodes.AccountNode(options, node.type, node.docs);
      }

      const newName = options.name ?? node.name;
      return new nodes.AccountNode(
        newName,
        mapStructFields(node.type, options.fields ?? {}, newName),
        node.docs
      );
    },
  };
}

function typeNodeTransform(
  program: string,
  type: string,
  options: string | TypeOptions
): NodeTransform {
  return {
    selector: { type, program },
    transformer: (node: nodes.Node) => {
      nodes.assertDefinedTypeNode(node);

      if (typeof options === 'string') {
        return new nodes.DefinedTypeNode(options, node.type, node.docs);
      }

      const newName = options.name ?? node.name;
      const fieldMap = options.fields ?? {};
      return new nodes.DefinedTypeNode(
        newName,
        nodes.isTypeStructNode(node.type)
          ? mapStructFields(node.type, fieldMap, newName)
          : mapEnumVariants(node.type, fieldMap, newName),
        node.docs
      );
    },
  };
}

function errorNodeTransform(
  program: string,
  error: string,
  options: string
): NodeTransform {
  return {
    selector: { error, program },
    transformer: (node: nodes.Node) => {
      nodes.assertErrorNode(node);
      return new nodes.ErrorNode(options, node.code, node.message, node.docs);
    },
  };
}

function mapStructFields(
  node: nodes.TypeStructNode,
  map: Record<string, string>,
  newName?: string
): nodes.TypeStructNode {
  return new nodes.TypeStructNode(
    newName ?? node.name,
    node.fields.map((field) => ({
      ...field,
      name: map[field.name] ?? field.name,
    }))
  );
}

function mapEnumVariants(
  node: nodes.TypeEnumNode,
  map: Record<string, string>,
  newName?: string
): nodes.TypeEnumNode {
  return new nodes.TypeEnumNode(
    newName ?? node.name,
    node.variants.map((variant) => ({
      ...variant,
      name: map[variant.name] ?? variant.name,
    }))
  );
}
