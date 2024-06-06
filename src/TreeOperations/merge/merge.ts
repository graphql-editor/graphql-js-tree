import { ParserField, ParserTree, TypeDefinition, TypeSystemDefinition } from '@/Models';
import { Parser } from '@/Parser';
import { mergeArguments } from '@/TreeOperations/merge/arguments';
import { MergeError, ErrorConflict } from '@/TreeOperations/merge/common';
import { isExtensionNode } from '@/TreeOperations/shared';
import { TreeToGraphQL } from '@/TreeToGraphQL';
import { generateNodeId, getTypeName } from '@/shared';

const detectConflictOnBaseNode = (n1: ParserField, n2: ParserField) => {
  if (n1.data.type !== n2.data.type)
    throw new MergeError({
      conflictingNode: n1.name,
      message: `Data type conflict of nodes ${n1.name} and ${n2.name}`,
    });
  if (JSON.stringify(n1.interfaces) !== JSON.stringify(n2.interfaces))
    throw new MergeError({
      conflictingNode: n1.name,
      message: `Data type conflict of nodes ${n1.name} and ${n2.name}`,
    });
};

const detectConflictOnFieldNode = (parentName: string, f1: ParserField, f2: ParserField) => {
  const [f1Type, f2Type] = [getTypeName(f1.type.fieldType), getTypeName(f2.type.fieldType)];
  if (f1Type !== f2Type)
    throw new MergeError({
      conflictingNode: parentName,
      conflictingField: f1.name,
      message: `Data type conflict of node ${parentName} field ${f1.name} `,
    });
};
const addFromLibrary = (n: ParserField): ParserField => ({ ...n, fromLibrary: true });

const mergeFields = (parentName: string, fields1: ParserField[], fields2: ParserField[]) => {
  const mergedCommonFieldsAndF1Fields = fields1
    .map((f1) => {
      const commonField = fields2.find((f2) => f2.name === f1.name);
      if (!commonField) return f1;
      detectConflictOnFieldNode(parentName, f1, commonField);
      const mergedField: ParserField = {
        ...f1,
        args: mergeArguments(f1.name, f1.args, commonField.args),
      };
      return mergedField;
    })
    .filter(<T>(f: T | undefined): f is T => !!f);
  const otherF2Fields = fields2.filter((f2) => !fields1.find((f1) => f1.name === f2.name));
  return [...mergedCommonFieldsAndF1Fields, ...otherF2Fields];
};

const mergeNode = (n1: ParserField, n2: ParserField) => {
  detectConflictOnBaseNode(n1, n2);
  const args =
    n1.data.type === TypeDefinition.InputObjectTypeDefinition
      ? mergeArguments(n1.name, n1.args, n2.args)
      : mergeFields(n1.name, n1.args, n2.args.map(addFromLibrary));

  const mergedNode = {
    ...n1,
    id: generateNodeId(n1.name, n1.data.type, args),
    args,
    directives: [...n1.directives, ...n2.directives.map(addFromLibrary)],
    interfaces: [...n1.interfaces, ...n2.interfaces],
  } as ParserField;

  mergedNode.directives = mergedNode.directives.filter(
    (a, i) => mergedNode.directives.findIndex((aa) => aa.name === a.name) === i,
  );
  mergedNode.interfaces = mergedNode.interfaces.filter(
    (a, i) => mergedNode.interfaces.findIndex((aa) => aa === a) === i,
  );
  return mergedNode;
};

export const mergeTrees = (tree1: ParserTree, tree2: ParserTree) => {
  const mergedNodesT1: ParserField[] = [];
  const mergedNodesT2: ParserField[] = [];
  const mergeResultNodes: ParserField[] = [];
  const errors: Array<ErrorConflict> = [];
  const filteredTree2Nodes = tree2.nodes.filter((t) => t.data.type !== TypeSystemDefinition.SchemaDefinition);
  // merge nodes
  tree1.nodes.forEach((t1n) => {
    const matchingNode = filteredTree2Nodes.find((t2n) => t2n.name === t1n.name && t1n.data.type === t2n.data.type);
    if (matchingNode) {
      if (isExtensionNode(matchingNode.data.type)) {
        t1n.args.forEach((t1nA) => {
          const matchingArg = matchingNode.args.find((mNA) => mNA.name === t1nA.name);
          if (matchingArg) {
            if (JSON.stringify(matchingArg) !== JSON.stringify(t1nA)) {
              errors.push({
                conflictingField: t1nA.name,
                conflictingNode: t1n.name,
              });
            }
          }
        });
        return;
      }
      mergedNodesT1.push(t1n);
      mergedNodesT2.push(matchingNode);
      try {
        const mergeNodeResult = mergeNode(t1n, matchingNode);
        mergeResultNodes.push(mergeNodeResult);
      } catch (error) {
        if (error instanceof MergeError) {
          errors.push({
            conflictingNode: error.errorParams.conflictingNode,
            conflictingField: error.errorParams.conflictingField,
          });
        }
      }
    }
  });
  if (errors.length) {
    return {
      __typename: 'error' as const,
      errors,
    };
  }
  const t1Nodes = tree1.nodes.filter((t1n) => !mergedNodesT1.find((mtn1) => mtn1 === t1n));
  const t2Nodes = filteredTree2Nodes
    .filter((t2n) => !mergedNodesT2.find((mtn2) => mtn2 === t2n))
    .map((n) => ({ ...n, fromLibrary: true }));
  return {
    __typename: 'success' as const,
    nodes: [...t1Nodes, ...mergeResultNodes, ...t2Nodes],
  };
};

export const mergeSDLs = (sdl1: string, sdl2: string) => {
  const t1 = Parser.parse(sdl1);
  const t2 = Parser.parse(sdl2);
  const mergeResult = mergeTrees(t1, {
    nodes: t2.nodes.filter((n) => n.data.type !== TypeSystemDefinition.SchemaDefinition),
  });
  if (mergeResult.__typename === 'success') {
    const sdl = TreeToGraphQL.parse(mergeResult);
    return {
      ...mergeResult,
      sdl,
    };
  }
  return mergeResult;
};
