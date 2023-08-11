import { ParserField } from '@/Models';
import { TemplateUtils } from '@/TreeToGraphQL/templates/TemplateUtils';
import { getTypeName } from '@/shared';

/**
 * resolve comment node
 */
export class SchemaDefinitionTemplate {
  static resolve(f: ParserField): string {
    return `schema${TemplateUtils.resolveDirectives(f.directives)}{${f.args.map(
      (a) => `${a.name}: ${getTypeName(a.type.fieldType)}`,
    )}}`;
  }
}

export class SchemaExtensionTemplate {
  static resolve(f: ParserField): string {
    return `extend schema${TemplateUtils.resolveDirectives(f.directives)}${
      f.args.length ? `{${f.args.map((a) => `\n\t${a.name}: ${getTypeName(a.type.fieldType)}`)}}` : ''
    }`;
  }
}
