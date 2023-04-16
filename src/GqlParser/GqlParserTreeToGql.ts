import { getValueAsGqlStringNode } from '@/GqlParser/valueNode';
import { Instances, TypeSystemDefinition } from '@/Models';
import { GqlParserTree, VariableDefinitionWithoutLoc } from '@/Models/GqlParserTree';
import { compileType } from '@/shared';
export const GqlParserTreeToGql = (mainTree: GqlParserTree) => {
  const generateName = (tree: GqlParserTree): string => {
    return `${
      tree.operation
        ? `${tree.operation}${tree.name ? ` ${tree.name}` : ''}${generateVariableDefinitions(tree)}`
        : tree.name
    }`;
  };
  const generateChildren = (tree: GqlParserTree): string => {
    return `${tree.children ? `{\n ${tree.children.map(generateGql).join('\n ')}\n}` : ''}`;
  };
  const generateValue = (tree: GqlParserTree): string => {
    return `${tree.value ? `: ${getValueAsGqlStringNode(tree.value)}` : ''}`;
  };
  const generateArguments = (tree: GqlParserTree): string => {
    return `${tree.arguments ? `(\n ${tree.arguments.map((a) => generateGql(a)).join(', ')})` : ''}`;
  };
  const generateGql = (tree: GqlParserTree): string => {
    return `${generateName(tree)}${generateValue(tree)}${generateArguments(tree)}${generateChildren(tree)}`;
  };
  const generateVariableDefinitions = (tree: GqlParserTree): string => {
    return `${
      tree.variableDefinitions?.length
        ? `(${tree.variableDefinitions.map((tvd) => `$${tvd.name}: ${tvd.type}`).join(', ')})`
        : ''
    }`;
  };
  return generateGql(mainTree);
};

export const enrichFieldNodeWithVariables = (
  fieldTree: GqlParserTree,
  variableDefinitionsUpdate: (
    fn: (variableDefinitions: VariableDefinitionWithoutLoc[]) => VariableDefinitionWithoutLoc[],
  ) => void,
): GqlParserTree => {
  if (
    fieldTree.node.data.type === TypeSystemDefinition.FieldDefinition ||
    fieldTree.node.data.type === Instances.Directive
  ) {
    return {
      ...fieldTree,
      arguments: fieldTree.node.args.map((a) => {
        const VarName = `${fieldTree.name}_${a.name}`;
        const VarNode: GqlParserTree = {
          name: a.name,
          node: a,
          value: {
            kind: 'Variable',
            value: VarName,
          },
        };
        variableDefinitionsUpdate((variableDefinitions) => [
          ...variableDefinitions,
          {
            name: VarName,
            type: compileType(a.type.fieldType),
          },
        ]);
        return VarNode;
      }),
    };
  }
  return fieldTree;
};

export const enrichWholeTreeWithVars = (mainTree: GqlParserTree): GqlParserTree => {
  let variableDefinitions: VariableDefinitionWithoutLoc[] = [];
  const recursiveEnrich = (tree: GqlParserTree): GqlParserTree => {
    return enrichFieldNodeWithVariables(
      {
        ...tree,
        ...(tree.children
          ? {
              children: tree.children.map(recursiveEnrich),
            }
          : {}),
        ...(tree.directives
          ? {
              directives: tree.directives.map(recursiveEnrich),
            }
          : {}),
      },
      (varsUpdate) => {
        variableDefinitions = varsUpdate(variableDefinitions);
      },
    );
  };
  return { ...recursiveEnrich(mainTree), variableDefinitions };
};
