import { Directive, OperationType, FieldType, Value } from './Spec';
import { GraphQLNodeParams } from './Types';

export interface ParserField {
  name: string;
  id: string;
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
  fromInterface?: string[];
  value?: {
    type: Value;
    value?: string;
  };
}

export interface ParserTree {
  nodes: ParserField[];
}
