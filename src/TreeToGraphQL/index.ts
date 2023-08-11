import { ParserTree } from '@/Models';
import { TemplateUtils } from './templates/TemplateUtils';

export class TreeToGraphQL {
  static parse(parserTree: ParserTree): string {
    const joinDefinitions = (...defintions: string[]): string => defintions.join('\n\n');
    const alldefs = parserTree.nodes.map((a) => TemplateUtils.resolverForConnection(a));
    return joinDefinitions(...alldefs).concat('\n');
  }
}
