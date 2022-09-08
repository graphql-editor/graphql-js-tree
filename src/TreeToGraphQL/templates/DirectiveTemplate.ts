import { ParserField } from '@/Models';
import { getTypeName } from '@/shared';
import { TemplateUtils } from './TemplateUtils';

/**
 * Template for directives
 */
export class DirectiveTemplate {
  /**
   * Resolve directive field
   */
  static resolve(f: ParserField): string {
    let argsString = '';
    if (f.args.length) {
      argsString = `(\n${f.args
        .map((a) => TemplateUtils.resolverForConnection(a))
        .map((a) => `\t${a}`)
        .join('\n')}\n)`;
    }
    return `@${getTypeName(f.type.fieldType)}${argsString}`;
  }
}
