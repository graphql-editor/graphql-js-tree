import { ParserField, Value } from '@/Models';
import { TemplateUtils } from './TemplateUtils';

/**
 * template for input value and function arguments
 */
export class InputValueTemplate {
  static resolve(f: ParserField, prefix = 0): string {
    let argsString = '';
    if (f.value?.value) {
      argsString = ` = ${f.value.type === Value.StringValue ? `"${f.value.value}"` : f.value.value}`;
    }
    return `${TemplateUtils.descriptionResolver(f.description, prefix)}${'\t'.repeat(prefix)}${
      f.name
    }: ${TemplateUtils.resolveType(f)}${argsString}${TemplateUtils.resolveDirectives(f.directives)}`;
  }
}
