import type { ConfigureOptions } from 'nunjucks';
import * as nodes from '../../nodes';
import { ImportFrom, pascalCase, snakeCase } from '../../shared';
import {
  BaseThrowVisitor,
  GetByteSizeVisitor,
  GetResolvedInstructionInputsVisitor,
  ResolvedInstructionInput,
  Visitor,
  visit,
} from '../../visitors';
import { RenderMap } from '../RenderMap';
import { resolveTemplate } from '../utils';
import {
  GetRustTypeManifestVisitor,
  RustTypeManifest,
} from './GetRustTypeManifestVisitor';
import { renderRustValueNode } from './RenderRustValueNode';
import { RustImportMap } from './RustImportMap';

export type GetRustRenderMapOptions = {
  renderParentInstructions?: boolean;
  dependencyMap?: Record<ImportFrom, string>;
  typeManifestVisitor?: Visitor<RustTypeManifest>;
  byteSizeVisitor?: Visitor<number | null> & {
    registerDefinedTypes?: (definedTypes: nodes.DefinedTypeNode[]) => void;
  };
  resolvedInstructionInputVisitor?: Visitor<ResolvedInstructionInput[]>;
};

export class GetRustRenderMapVisitor extends BaseThrowVisitor<RenderMap> {
  readonly options: Required<GetRustRenderMapOptions>;

  private program: nodes.ProgramNode | null = null;

  constructor(options: GetRustRenderMapOptions = {}) {
    super();
    this.options = {
      renderParentInstructions: options.renderParentInstructions ?? false,
      dependencyMap: { ...options.dependencyMap },
      typeManifestVisitor:
        options.typeManifestVisitor ?? new GetRustTypeManifestVisitor(),
      byteSizeVisitor: options.byteSizeVisitor ?? new GetByteSizeVisitor(),
      resolvedInstructionInputVisitor:
        options.resolvedInstructionInputVisitor ??
        new GetResolvedInstructionInputsVisitor(),
    };
  }

  visitRoot(root: nodes.RootNode): RenderMap {
    this.byteSizeVisitor.registerDefinedTypes?.(nodes.getAllDefinedTypes(root));

    const programsToExport = root.programs.filter((p) => !p.internal);
    const accountsToExport = nodes
      .getAllAccounts(root)
      .filter((a) => !a.internal);
    const instructionsToExport = nodes
      .getAllInstructionsWithSubs(root, !this.options.renderParentInstructions)
      .filter((i) => !i.internal);
    const definedTypesToExport = nodes
      .getAllDefinedTypes(root)
      .filter((t) => !t.internal);
    const hasAnythingToExport =
      programsToExport.length > 0 ||
      accountsToExport.length > 0 ||
      instructionsToExport.length > 0 ||
      definedTypesToExport.length > 0;

    const ctx = {
      root,
      programsToExport,
      accountsToExport,
      instructionsToExport,
      definedTypesToExport,
      hasAnythingToExport,
    };

    const map = new RenderMap();
    if (programsToExport.length > 0) {
      map
        .add('programs.rs', this.render('programsMod.njk', ctx))
        .add('errors/mod.rs', this.render('errorsMod.njk', ctx));
    }
    if (accountsToExport.length > 0) {
      map.add('accounts/mod.rs', this.render('accountsMod.njk', ctx));
    }
    if (instructionsToExport.length > 0) {
      map.add('instructions/mod.rs', this.render('instructionsMod.njk', ctx));
    }
    if (definedTypesToExport.length > 0) {
      map
        .add('types/mod.rs', this.render('definedTypesMod.njk', ctx))
        .add('types/helper/mod.rs', this.render('sharedPage.njk', ctx));
    }

    return map
      .add('mod.rs', this.render('rootMod.njk', ctx))
      .mergeWith(...root.programs.map((program) => visit(program, this)));
  }

  visitProgram(program: nodes.ProgramNode): RenderMap {
    this.program = program;
    const { name } = program;
    const renderMap = new RenderMap()
      .mergeWith(...program.accounts.map((account) => visit(account, this)))
      .mergeWith(...program.definedTypes.map((type) => visit(type, this)));

    // Internal programs are support programs that
    // were added to fill missing types or accounts.
    // They don't need to render anything else.
    if (program.internal) {
      this.program = null;
      return renderMap;
    }

    renderMap
      .mergeWith(
        ...nodes
          .getAllInstructionsWithSubs(
            program,
            !this.options.renderParentInstructions
          )
          .map((ix) => visit(ix, this))
      )
      .add(
        `errors/${snakeCase(name)}.rs`,
        this.render('errorsPage.njk', {
          imports: new RustImportMap().toString(this.options.dependencyMap),
          program,
          errors: program.errors.map((error) => ({
            ...error,
            prefixedName: pascalCase(program.prefix) + pascalCase(error.name),
          })),
        })
      );
    this.program = null;
    return renderMap;
  }

  visitAccount(account: nodes.AccountNode): RenderMap {
    const typeManifest = visit(account, this.typeManifestVisitor);
    const { imports } = typeManifest;

    return new RenderMap().add(
      `accounts/${snakeCase(account.name)}.rs`,
      this.render('accountsPage.njk', {
        account,
        imports: imports.toString(this.options.dependencyMap),
        program: this.program,
        typeManifest,
      })
    );
  }

  visitInstruction(instruction: nodes.InstructionNode): RenderMap {
    // Imports.
    const imports = new RustImportMap();
    imports.add(['borsh::BorshDeserialize', 'borsh::BorshSerialize']);

    // Instruction args.
    const instructionArgs: any[] = [];
    let hasArgs = false;

    instruction.dataArgs.struct.fields.forEach((field) => {
      const manifest = visit(field.child, this.typeManifestVisitor);
      imports.mergeWith(manifest.imports);
      const innerOptionType = nodes.isOptionTypeNode(field.child)
        ? visit(field.child.child, this.typeManifestVisitor).type
        : null;

      if (field.defaultsTo) {
        const { imports: argImports, render: value } = renderRustValueNode(
          field.defaultsTo.value
        );
        imports.mergeWith(argImports);

        instructionArgs.push({
          name: field.name,
          type: manifest.type,
          default: field.defaultsTo.strategy === 'omitted',
          optional: field.defaultsTo.strategy === 'optional',
          innerOptionType,
          value,
        });
      } else {
        instructionArgs.push({
          name: field.name,
          type: manifest.type,
          default: false,
          optional: false,
          innerOptionType,
          value: null,
        });
        hasArgs = true;
      }
    });

    return new RenderMap().add(
      `instructions/${snakeCase(instruction.name)}.rs`,
      this.render('instructionsPage.njk', {
        instruction,
        imports: imports.toString(this.options.dependencyMap),
        instructionArgs,
        hasArgs,
        program: this.program,
      })
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): RenderMap {
    const typeManifest = visit(definedType, this.typeManifestVisitor);
    const imports = new RustImportMap().mergeWithManifest(typeManifest);

    return new RenderMap().add(
      `types/${snakeCase(definedType.name)}.rs`,
      this.render('definedTypesPage.njk', {
        definedType,
        imports: imports.toString(this.options.dependencyMap),
        typeManifest,
      })
    );
  }

  get typeManifestVisitor() {
    return this.options.typeManifestVisitor;
  }

  get byteSizeVisitor() {
    return this.options.byteSizeVisitor;
  }

  get resolvedInstructionInputVisitor() {
    return this.options.resolvedInstructionInputVisitor;
  }

  protected render(
    template: string,
    context?: object,
    options?: ConfigureOptions
  ): string {
    const code = resolveTemplate(
      `${__dirname}/templates`,
      template,
      context,
      options
    );
    return code;
  }
}
