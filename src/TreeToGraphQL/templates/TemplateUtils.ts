import {
  Helpers,
  Instances,
  ParserField,
  TypeDefinition,
  TypeExtension,
  TypeSystemDefinition,
  TypeSystemExtension,
  ValueDefinition,
} from '@/Models';
import { compileType } from '@/shared';
import { ArgumentTemplate } from './ArgumentTemplate';
import { CommentTemplate } from './CommentTemplate';
import { DirectiveTemplate } from './DirectiveTemplate';
import { EnumValueDefinitionTemplate } from './EnumValueDefinitionTemplate';
import { ExtendTemplate } from './ExtendTemplate';
import { FieldTemplate } from './FieldTemplate';
import { InputValueTemplate } from './InputValueTemplate';
import { TypeDefinitionsTemplates } from './TypeDefinitionsTemplates';
import { UnionMemberTemplate } from './UnionMemberTemplate';
import { SchemaDefinitionTemplate, SchemaExtensionTemplate } from '@/TreeToGraphQL/templates/SchemaDefinitionTemplate';

const dedent = new RegExp('\n([\t ]*)', 'gm');

/**
 * Class for solving GraphQL Types and directing them to a right resolver
 *
 * @export
 * @class TemplateUtils
 */
export class TemplateUtils {
  static resolveFieldType = (f: ParserField['type']['fieldType']): string => {
    return compileType(f);
  };
  /**
   *
   *
   * @param f field to be resolved
   * @static
   * @memberof TemplateUtils
   */
  static resolveType = (f: ParserField): string => TemplateUtils.resolveFieldType(f.type.fieldType);
  /**
   * Return description in GraphQL format
   *
   * @static
   * @param [description]
   * @param [prefix='']
   * @returns {string}
   * @memberof TemplateUtils
   */
  static descriptionResolver = (description?: string, prefix = 0): string => {
    if (description) {
      const indent = '\t'.repeat(prefix);
      const removedIndents = `${description.replace(/^([\t ]*)/g, indent).replace(dedent, `\n${indent}`)}`;
      const d = `${indent}"""\n${removedIndents}\n${indent}"""\n`;
      // Calculate how many indents already
      // how many - prefix
      // indent
      return d;
    }
    return '';
  };
  /**
   * Creates implements for GraphQL types
   *
   * @param [interfaces] names of interfaces
   * @static
   * @memberof TemplateUtils
   */
  static resolveImplements = (interfaces?: string[]): string =>
    interfaces && interfaces.length ? ` implements ${interfaces.join(' & ')}` : '';
  /**
   * Create directives for graphql fields
   *
   * @static
   * @memberof TemplateUtils
   * @param [directives] directives parser fields
   */
  static resolveDirectives = (directives?: ParserField[]): string =>
    directives && directives.length
      ? ` ${directives.map((d) => TemplateUtils.resolverForConnection(d)).join(' ')}`
      : '';
  /**
   * Detect the Zeus graphql type and cast it to proper function in type resolver
   *
   * @static
   * @memberof TemplateUtils
   * @param f
   * @returns {string}
   */
  static resolverForConnection = (f: ParserField, prefix = 0): string => {
    if (f.data) {
      const { type = '' } = f.data;
      if (type === TypeDefinition.UnionTypeDefinition) {
        return TypeDefinitionsTemplates.resolveUnion(f);
      }
      if (type in TypeExtension) {
        if (type === TypeExtension.UnionTypeExtension) {
          return TypeDefinitionsTemplates.resolveUnionExtension(f);
        }
        return TypeDefinitionsTemplates.resolveExtension(f);
      }
      if (type in TypeDefinition) {
        return TypeDefinitionsTemplates.resolve(f);
      }
      switch (type) {
        case TypeSystemDefinition.SchemaDefinition:
          return SchemaDefinitionTemplate.resolve(f);
        case TypeSystemExtension.SchemaExtension:
          return SchemaExtensionTemplate.resolve(f);
        case TypeSystemDefinition.FieldDefinition:
          return FieldTemplate.resolve(f, prefix);
        case TypeSystemDefinition.DirectiveDefinition:
          return TypeDefinitionsTemplates.resolveDirective(f);
        case TypeSystemDefinition.UnionMemberDefinition:
          return UnionMemberTemplate.resolve(f);
        case ValueDefinition.EnumValueDefinition:
          return EnumValueDefinitionTemplate.resolve(f);
        case ValueDefinition.InputValueDefinition:
          return InputValueTemplate.resolve(f, prefix);
        case Helpers.Extend:
          return ExtendTemplate.resolve(f);
        case Helpers.Comment:
          return CommentTemplate.resolve(f);
        case Instances.Argument:
          return ArgumentTemplate.resolve(f);
        case Instances.Directive:
          return DirectiveTemplate.resolve(f);
        default:
          return '';
      }
    }
    return '';
  };
}
