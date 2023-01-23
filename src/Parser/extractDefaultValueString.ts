import { ValueNode } from 'graphql';

export const extractDefaultValueString = (graphqlNode: ValueNode) => {
  const startIndex = graphqlNode.loc?.start;
  const endIndex = graphqlNode.loc?.end;
  if (!startIndex || !endIndex) return;

  const textNode = graphqlNode.loc?.source.body.slice(startIndex, endIndex);
  if (textNode && graphqlNode.kind === 'StringValue' && textNode.match(/^"|'/gm) && textNode.match(/"|'$/gm)) {
    return textNode.slice(1, -1);
  }
  return textNode;
};
