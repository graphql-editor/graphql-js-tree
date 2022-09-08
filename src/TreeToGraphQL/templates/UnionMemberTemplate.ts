import { ParserField } from '@/Models';
import { getTypeName } from '@/shared';

/**
 * Template for union member represented in GraphQL Union - `type U = A | B` where A and B are union members
 */
export class UnionMemberTemplate {
  static resolve(f: ParserField): string {
    return getTypeName(f.type.fieldType);
  }
}
