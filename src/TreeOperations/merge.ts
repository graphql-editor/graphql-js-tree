import { ParserField, ParserTree } from '@/Models';
import { Parser } from '@/Parser';
import { isExtensionNode } from '@/TreeOperations/shared';
import { TreeToGraphQL } from '@/TreeToGraphQL';
import { generateNodeId } from '@/shared';

const addFromLibrary = (n: ParserField): ParserField => ({ ...n, fromLibrary: true });

const mergeNode = (n1: ParserField, n2: ParserField) => {
  const mergedNode = {
    ...n1,
    args: [...n1.args, ...n2.args.map(addFromLibrary)],
    directives: [...n1.directives, ...n2.directives.map(addFromLibrary)],
    interfaces: [...n1.interfaces, ...n2.interfaces],
  } as ParserField;
  mergedNode.id = generateNodeId(mergeNode.name, mergedNode.data.type, mergedNode.args);
  //dedupe
  mergedNode.args = mergedNode.args.filter((a, i) => mergedNode.args.findIndex((aa) => aa.name === a.name) === i);
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
  const errors: Array<{ conflictingNode: string; conflictingField: string }> = [];
  // merge nodes
  tree1.nodes.forEach((t1n) => {
    const matchingNode = tree2.nodes.find((t2n) => t2n.name === t1n.name && t1n.data.type === t2n.data.type);
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
      } else {
        // Check if arg named same and different typings -> throw
        mergedNodesT1.push(t1n);
        mergedNodesT2.push(matchingNode);
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
        if (!errors.length) {
          mergeResultNodes.push(mergeNode(t1n, matchingNode));
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
  const t2Nodes = tree2.nodes
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
  const mergeResult = mergeTrees(t1, t2);
  if (mergeResult.__typename === 'success') {
    const sdl = TreeToGraphQL.parse(mergeResult);
    return {
      ...mergeResult,
      sdl,
    };
  }
  return mergeResult;
};
