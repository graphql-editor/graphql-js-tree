import { ParserField } from '@/Models/ParserTree';
import { OperationType } from '@/Models/Spec';
import {
  BooleanValueNode,
  EnumValueNode,
  FloatValueNode,
  IntValueNode,
  ListValueNode,
  NullValueNode,
  ObjectFieldNode,
  ObjectValueNode,
  StringValueNode,
  VariableNode,
} from 'graphql';

type ObjectFieldNodeWithoutLoc = Omit<ObjectFieldNode, 'loc' | 'name' | 'value'> & {
  name: string;
  value: ValueNodeWithoutLoc;
};

export type ValueNodeWithoutLoc =
  | (Omit<VariableNode, 'loc' | 'name'> & { value: string })
  | Omit<IntValueNode, 'loc'>
  | Omit<FloatValueNode, 'loc'>
  | Omit<StringValueNode, 'loc'>
  | Omit<BooleanValueNode, 'loc'>
  | (Omit<NullValueNode, 'loc'> & { value: null })
  | Omit<EnumValueNode, 'loc'>
  | (Omit<ListValueNode, 'loc' | 'values'> & { values: ValueNodeWithoutLoc[] })
  | (Omit<ObjectValueNode, 'loc' | 'fields'> & {
      fields: ObjectFieldNodeWithoutLoc[];
    });

export type GqlParserTree = {
  name?: string;
  node: ParserField;
  children?: GqlParserTree[];
  arguments?: GqlParserTree[];
  directives?: GqlParserTree[];
  fragment?: boolean;
  fragmentSpread?: boolean;
  inlineFragment?: boolean;
  value?: ValueNodeWithoutLoc;
  operation?: OperationType;
  variableDefinitions?: VariableDefinitionWithoutLoc[];
};

export type VariableDefinitionWithoutLoc = {
  name: string;
  type: string;
};
