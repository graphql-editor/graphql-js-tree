import { ParserField, Value } from '@/Models';
import { getTypeName } from '@/shared';

/**
 * resolve function argument
 */
export class ArgumentTemplate {
  static resolve({ type, value }: ParserField): string {
    let argsString = '';
    if (value?.value) {
      argsString = `${value.type === Value.StringValue ? `"${value.value}"` : value.value}`;
    }
    return `${getTypeName(type.fieldType)}: ${argsString}`;
  }
}
