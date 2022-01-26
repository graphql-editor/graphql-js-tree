import { ParserField } from '@/Models';
import { TemplateUtils } from './TemplateUtils';

/**
 * template for input value and function arguments
 */
export class InputValueTemplate {
  static resolve(f: ParserField, prefix = 0): string {
    let argsString = '';
    if (f.args.length > 0) {
      argsString = ` = ${f.args.map((a) => TemplateUtils.resolverForConnection(a, prefix + 1)).join('\n')}`;
    }
    return `${TemplateUtils.descriptionResolver(f.description, prefix)}${'\t'.repeat(prefix)}${
      f.name
    }: ${TemplateUtils.resolveType(f)}${argsString}${TemplateUtils.resolveDirectives(f.directives)}`;
  }
}
