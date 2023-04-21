import { parseGql } from '@/GqlParser';
import { getValueAsGqlStringNode } from '@/GqlParser/valueNode';
import { Instances, TypeSystemDefinition } from '@/Models';
import { GqlParserTree, VariableDefinitionWithoutLoc } from '@/Models/GqlParserTree';
import { compileType } from '@/shared';
export const parseGqlTree = (mainTree: GqlParserTree) => {
  const generateName = (tree: GqlParserTree): string => {
    if (tree.operation) {
      return `${tree.operation}${tree.name ? ` ${tree.name}` : ''}${generateVariableDefinitions(tree)}`;
    }
    if (tree.fragment) {
      return `fragment ${tree.name} on ${tree.node.name}`;
    }
    if (tree.fragmentSpread) {
      return `...${tree.name}`;
    }
    if (tree.inlineFragment) {
      return `...${tree.name ? ` on ${tree.name}` : ''}`;
    }
    return tree.name || '';
  };
  const generateChildren = (tree: GqlParserTree): string => {
    return `${tree.children?.length ? `{\n ${tree.children.map(generateGql).join('\n ')}\n}` : ''}`;
  };
  const generateValue = (tree: GqlParserTree): string => {
    return `${tree.value ? `: ${getValueAsGqlStringNode(tree.value)}` : ''}`;
  };
  const generateArguments = (tree: GqlParserTree): string => {
    return `${tree.arguments?.length ? `(\n ${tree.arguments.map((a) => generateGql(a)).join(', ')})` : ''}`;
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

export const parseGqlTrees = (trees: GqlParserTree[]) => {
  return trees.map(parseGqlTree).join('\n');
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
      ...(fieldTree.node.args.length
        ? {
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
          }
        : {}),
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

export const enrichGqlQueryWithAllVars = (query: string, schema: string) => {
  const trees = parseGql(query, schema);
  return parseGqlTrees(trees.map(enrichWholeTreeWithVars));
};
