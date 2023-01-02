import chalk from 'chalk';
import * as nodes from '../../nodes';
import { GetDefaultValidatorBagVisitor, ValidatorBag } from '../../visitors';

export class GetJavaScriptValidatorBagVisitor extends GetDefaultValidatorBagVisitor {
  visitRoot(root: nodes.RootNode): ValidatorBag {
    return super.visitRoot(root);
  }

  visitProgram(program: nodes.ProgramNode): ValidatorBag {
    return super.visitProgram(program);
  }

  visitAccount(account: nodes.AccountNode): ValidatorBag {
    const bag = super.visitAccount(account);
    this.pushNode(account);
    if (account.name === 'Metadata') {
      bag.debug(
        `You cannot use Metadata as an account name. ${chalk.bold(
          'Because I say so!'
        )}`,
        account,
        this.stack
      );
    }
    this.popNode();
    return bag;
  }

  visitInstruction(instruction: nodes.InstructionNode): ValidatorBag {
    return super.visitInstruction(instruction);
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): ValidatorBag {
    return super.visitDefinedType(definedType);
  }

  visitError(error: nodes.ErrorNode): ValidatorBag {
    return super.visitError(error);
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): ValidatorBag {
    return super.visitTypeArray(typeArray);
  }

  visitTypeDefinedLink(
    typeDefinedLink: nodes.TypeDefinedLinkNode
  ): ValidatorBag {
    return super.visitTypeDefinedLink(typeDefinedLink);
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): ValidatorBag {
    return super.visitTypeEnum(typeEnum);
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): ValidatorBag {
    return super.visitTypeLeaf(typeLeaf);
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): ValidatorBag {
    return super.visitTypeMap(typeMap);
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): ValidatorBag {
    return super.visitTypeOption(typeOption);
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): ValidatorBag {
    return super.visitTypeSet(typeSet);
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): ValidatorBag {
    return super.visitTypeStruct(typeStruct);
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): ValidatorBag {
    return super.visitTypeTuple(typeTuple);
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): ValidatorBag {
    return super.visitTypeVec(typeVec);
  }
}
