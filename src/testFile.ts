/* eslint-disable no-console */
import idl from './idl.json';
import { Solita } from './Solita';
import { PrintVisitor } from './visitors/PrintVisitor';

const solita = new Solita(idl);
const printVisitor = new PrintVisitor();
solita.visit(printVisitor);
