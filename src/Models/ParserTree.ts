import { Directive, OperationType, FieldType } from './Spec';
import { GraphQLNodeParams } from './Types';

export interface ParserField {
  name: string;
  type: {
    fieldType: FieldType;
    operations?: OperationType[];
    directiveOptions?: Directive[];
  };
  data: GraphQLNodeParams;
  args: ParserField[];
  interfaces: string[];
  directives: ParserField[];
  description?: string;
}

export interface ParserTree {
  nodes: ParserField[];
}
