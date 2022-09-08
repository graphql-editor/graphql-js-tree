import { ParserField, Value } from '@/Models';
import { getTypeName } from '@/shared';
import { TemplateUtils } from './TemplateUtils';

/**
 * Template responsible for default values in GraphQL
 */
export class ValueTemplate {
  static resolve(f: ParserField): string {
    let returnedValue = `${f.name}`;
    if (f.data.type) {
      if (f.data.type === Value.EnumValue) {
        returnedValue = `${getTypeName(f.type.fieldType)}`;
      }
      if (f.data.type === Value.StringValue) {
        returnedValue = `"${f.name}"`;
      }
      if (f.data.type === Value.ListValue) {
        returnedValue = `[${(f.args || []).map((a) => TemplateUtils.resolverForConnection(a))}]`;
      }
      if (f.data.type === Value.ObjectValue) {
        returnedValue = `{ ${(f.args || []).map((a) => TemplateUtils.resolverForConnection(a))}}`;
      }
    }
    return returnedValue;
  }
}
