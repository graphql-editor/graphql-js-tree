import { getValueWithoutLoc } from '@/GqlParser/valueNode';
import { OperationType, ParserField, TypeDefinition, TypeSystemDefinition } from '@/Models';
import { GqlParserTree, VariableDefinitionWithoutLoc } from '@/Models/GqlParserTree';
import { Parser } from '@/Parser';
import { TypeResolver } from '@/Parser/typeResolver';
import { compileType, createTypeNameField, getTypeName } from '@/shared';
import {
  DefinitionNode,
  parse,
  OperationDefinitionNode,
  SelectionNode,
  ArgumentNode,
  DirectiveNode,
  FieldNode,
  VariableDefinitionNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  InlineFragmentNode,
} from 'graphql';
export const parseGql = (gql: string, schema: string) => {
  const { definitions } = parse(schema + '\n' + gql, { noLocation: true });
  const ops = definitions.filter(onlyOperations);
  const frags = definitions.filter(onlyFragments);
  const { nodes } = Parser.parse(schema);

  const composeDefinition = (d: OperationDefinitionNode): GqlParserTree => {
    const schemaNode = nodes.find((n) => n.data.type === TypeSystemDefinition.SchemaDefinition);
    const operationField = schemaNode?.args.find((a) => a.name === d.operation);
    if (!operationField) {
      console.log(JSON.stringify(schemaNode, null, 2));
      throw new Error(`Operation ${d.name?.value} does not exist in schema`);
    }
    const operationType = getTypeName(operationField.type.fieldType);
    const node = nodes.find((n) => n.name === operationType);
    if (!node) {
      throw new Error(`Operation ${d.name?.value} does not exist in schema`);
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
      children: d.selectionSet.selections.map((s) => composeSelectionNode(s, node)),
    };
  };

  const composeFragment = (f: FragmentDefinitionNode): GqlParserTree => {
    const node = nodes.find((n) => n.name == f.typeCondition.name.value);
    if (!node) {
      throw new Error(`Type ${f.typeCondition.name.value} does not exist in schema`);
    }
    return {
      node,
      fragment: true,
      name: f.name.value,
      ...(f.directives?.length ? { directives: f.directives.map((a) => composeDirectiveNode(a, node)) } : {}),
      children: f.selectionSet.selections.map((s) => composeSelectionNode(s, node)),
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
      ...(a.arguments?.length ? { arguments: a.arguments?.map((ar) => composeArgumentNode(ar, node)) } : {}),
    };
  };

  const composeFragmentSpread = (f: FragmentSpreadNode, node: ParserField): GqlParserTree => {
    return {
      node,
      name: f.name.value,
      ...(f.directives?.length ? { directives: f.directives?.map((a) => composeDirectiveNode(a, node)) } : {}),
      fragmentSpread: true,
    };
  };
  const composeInlineFragment = (f: InlineFragmentNode, node: ParserField): GqlParserTree => {
    const chosenNode = nodes.find((n) => n.name === f.typeCondition?.name.value);
    const rightNode = chosenNode || node;
    return {
      node: rightNode,
      name: rightNode.name,
      ...(f.directives?.length ? { directives: f.directives?.map((a) => composeDirectiveNode(a, rightNode)) } : {}),
      inlineFragment: true,
      children: f.selectionSet.selections.map((s) => composeSelectionNode(s, rightNode)),
    };
  };

  const composeSelectionNode = (s: SelectionNode, node: ParserField): GqlParserTree => {
    if (s.kind === 'Field') return composeFieldNode(s, node);
    if (s.kind === 'FragmentSpread') return composeFragmentSpread(s, node);
    return composeInlineFragment(s, node);
  };

  const composeFieldNode = (s: FieldNode, parentNode: ParserField): GqlParserTree => {
    const fieldNode =
      s.name.value === '__typename' ? createTypeNameField() : parentNode.args.find((a) => a.name === s.name.value);
    if (!fieldNode) {
      throw new Error(`Field "${s.name.value}" does not exist in "${parentNode.name}" node`);
    }
    const passParentDown = getTypeName(fieldNode.type.fieldType);
    const isParentObjectNode = nodes.find(
      (n) =>
        n.name === passParentDown &&
        (n.data.type === TypeDefinition.ObjectTypeDefinition ||
          n.data.type === TypeDefinition.UnionTypeDefinition ||
          n.data.type === TypeDefinition.InterfaceTypeDefinition),
    );

    return {
      node: fieldNode,
      name: s.name.value,
      ...(s.arguments?.length ? { arguments: s.arguments?.map((a) => composeArgumentNode(a, fieldNode)) } : {}),
      ...(s.directives?.length ? { directives: s.directives?.map((a) => composeDirectiveNode(a, fieldNode)) } : {}),
      ...(s.selectionSet?.selections.length
        ? { children: s.selectionSet.selections.map((s) => composeSelectionNode(s, isParentObjectNode || fieldNode)) }
        : {}),
    } as GqlParserTree;
  };
  return [...frags.map((f) => composeFragment(f)), ...ops.map((o) => composeDefinition(o))];
};

const onlyOperations = (definition: DefinitionNode): definition is OperationDefinitionNode => {
  return definition.kind === 'OperationDefinition';
};
const onlyFragments = (definition: DefinitionNode): definition is FragmentDefinitionNode => {
  return definition.kind === 'FragmentDefinition';
};
