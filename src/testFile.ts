/* eslint-disable no-console */
import type { Idl } from './idl';
import idl from './idl.json';
import { Solita } from './Solita';
import { PrintVisitor } from './visitors/PrintVisitor';

const solita = new Solita(idl as Partial<Idl>);
const printVisitor = new PrintVisitor();
solita.visit(printVisitor);
