import { Options, ParserField } from '@/Models';
import { TemplateUtils } from './TemplateUtils';

/**
 * resolve extension
 */
export class ExtendTemplate {
  static resolve(f: ParserField): string {
    const extendedTypes = f.args
      .filter((e) => e.args.length || e.directives.length || e.interfaces.length)
      .map((e) =>
        TemplateUtils.resolverForConnection({
          ...e,
          type: {
            ...e.type,
            fieldType: {
              name: e.data.type!,
              type: Options.name,
            },
          },
        }),
      )
      .join('\n');
    return extendedTypes;
    return '';
  }
}
