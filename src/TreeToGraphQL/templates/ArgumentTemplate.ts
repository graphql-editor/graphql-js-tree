import { ParserField } from '@/Models';
import { getTypeName } from '@/shared/getTypeName';
import { TemplateUtils } from './TemplateUtils';

/**
 * resolve function argument
 */
export class ArgumentTemplate {
  static resolve({ args, type }: ParserField, prefix = 0): string {
    let argsString = '';
    if (args) {
      if (args.length) {
        argsString = `${args.map((a) => TemplateUtils.resolverForConnection(a, prefix)).join('\n')}`;
      } else {
        argsString = '[]';
      }
    }
    return `${getTypeName(type.fieldType)}: ${argsString}`;
  }
}
