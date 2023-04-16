import { getValueWithoutLoc } from '@/GqlParser/valueNode';
import { OperationType, ParserField } from '@/Models';
import { GqlParserTree, VariableDefinitionWithoutLoc } from '@/Models/GqlParserTree';
import { Parser } from '@/Parser';
import { TypeResolver } from '@/Parser/typeResolver';
import { compileType } from '@/shared';
import {
  DefinitionNode,
  parse,
  OperationDefinitionNode,
  SelectionNode,
  ArgumentNode,
  DirectiveNode,
  FieldNode,
  VariableDefinitionNode,
} from 'graphql';
export const GqlParser = (gql: string, schema: string) => {
  const { definitions } = parse(schema + '\n' + gql);
  const ops = definitions.filter(onlyOperations);
  const { nodes } = Parser.parse(schema);

  const composeDefinition = (d: OperationDefinitionNode): GqlParserTree => {
    const node = nodes.find((n) => n.type.operations?.includes(d.operation as OperationType));
    if (!node) {
      throw new Error(`Operation ${d.name} does not exist in schema`);
    }
    return {
      name: d.name?.value,
      node,
      ...(d.operation
        ? {
            operation:
              d.operation === 'query'
                ? OperationType.query
                : d.operation === 'mutation'
                ? OperationType.mutation
                : OperationType.subscription,
          }
        : {}),
      ...(d.variableDefinitions?.length
        ? {
            variableDefinitions: d.variableDefinitions.map((vd) => composeVariableDefinition(vd)),
          }
        : {}),
      children: d.selectionSet.selections.filter(onlyFieldNodes).map((s) => composeSelectionNode(s, node)),
    };
  };

  const composeVariableDefinition = (v: VariableDefinitionNode): VariableDefinitionWithoutLoc => {
    const t = TypeResolver.resolveSingleFieldType(v.type);
    return {
      name: v.variable.name.value,
      type: compileType(t),
    };
  };

  const composeArgumentNode = (a: ArgumentNode, parentNode: ParserField): GqlParserTree => {
    const node = parentNode.args.find((ar) => ar.name === a.name.value);
    if (!node) {
      throw new Error(`Invalid argument name ${a.name}`);
    }
    return {
      name: a.name.value,
      node,
      value: getValueWithoutLoc(a.value),
    };
  };
  const composeDirectiveNode = (a: DirectiveNode, parentNode: ParserField): GqlParserTree => {
    const node = parentNode.args.find((ar) => ar.name === a.name.value);
    if (!node) {
      throw new Error(`Invalid argument name ${a.name}`);
    }

    return {
      node,
      name: a.name.value,
      arguments: a.arguments?.map((a) => composeArgumentNode(a, node)),
    };
  };

  const composeSelectionNode = (s: FieldNode, parentNode: ParserField): GqlParserTree => {
    const fieldNode = parentNode.args.find((a) => a.name === s.name.value);
    if (!fieldNode) {
      throw new Error('Field does not exist in schema');
    }
    return {
      node: fieldNode,
      name: s.name.value,
      arguments: s.arguments?.map((a) => composeArgumentNode(a, fieldNode)),
      directives: s.directives?.map((a) => composeDirectiveNode(a, fieldNode)),
      children: s.selectionSet?.selections.filter(onlyFieldNodes).map((a) => composeSelectionNode(a, fieldNode)),
    } as GqlParserTree;
  };
  return ops.map((o) => composeDefinition(o));
};

const onlyOperations = (definition: DefinitionNode): definition is OperationDefinitionNode => {
  return definition.kind === 'OperationDefinition';
};
const onlyFieldNodes = (definition: SelectionNode): definition is FieldNode => {
  return definition.kind === 'Field';
};
