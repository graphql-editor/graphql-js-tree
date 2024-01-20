import { ParserField, TypeSystemDefinition } from '@/Models';

export const removeOrphans = (possibleOrphans: string[], nodes: ParserField[]) => {
  const usedNodes = nodes.flatMap((n) => {
    return [...n.interfaces, ...n.args.flatMap((a) => [...a.name, ...a.args.map((ia) => ia.name)])];
  });
  return nodes.filter((n) => {
    if (!possibleOrphans.includes(n.name)) {
      return true;
    }
    if (n.data.type === TypeSystemDefinition.DirectiveDefinition) {
      return true;
    }
    return usedNodes.includes(n.name);
  });
};
