import {
  ArgumentNode,
  DirectiveNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
  ObjectFieldNode,
  SchemaDefinitionNode,
  TypeDefinitionNode,
  TypeNode,
  TypeSystemDefinitionNode,
  TypeSystemExtensionNode,
  ValueNode,
} from 'graphql';
import { kindAsValue, Options, ParserField } from '@/Models';
import { Instances, TypeSystemDefinition, ValueDefinition } from '@/Models/Spec';
import { generateNodeId } from '@/shared';
import { extractDefaultValueString } from '@/Parser/extractDefaultValueString';

/**
 * Class for resolving Types to ParserFields
 */
export class TypeResolver {
  /**
   * Resolve absolute parent type
   *
   * @param n
   * @param [options=[]]
   */
  static resolveSingleFieldType(n: TypeNode): ParserField['type']['fieldType'] {
    if (n.kind === 'ListType') {
      return {
        type: Options.array,
        nest: TypeResolver.resolveSingleFieldType(n.type),
      };
    }
    if (n.kind === 'NonNullType') {
      return {
        type: Options.required,
        nest: TypeResolver.resolveSingleFieldType(n.type),
      };
    }
    return {
      name: n.name.value,
      type: Options.name,
    };
  }

  /**
   * Iterate fields and return them as ParserFields
   *
   * @param fields
   */
  static iterateObjectTypeFields(fields: ReadonlyArray<FieldDefinitionNode>): ParserField[] {
    return fields.map((n) => {
      const args = n.arguments ? TypeResolver.iterateInputValueFields(n.arguments) : [];
      return {
        name: n.name.value,
        ...(n.description ? { description: n.description.value } : {}),
        args,
        type: { fieldType: TypeResolver.resolveSingleFieldType(n.type) },
        directives: n.directives ? TypeResolver.iterateDirectives(n.directives) : [],
        interfaces: [],
        data: {
          type: TypeSystemDefinition.FieldDefinition,
        },
        id: generateNodeId(n.name.value, TypeSystemDefinition.FieldDefinition, args),
      };
    });
  }

  /**
   * Resolve default ValueNode options
   *
   * @param value
   */
  static resolveInputValueOptions = (value: ValueNode, name: string): ParserField['type']['fieldType'] => {
    if (value.kind === 'ListValue') {
      return {
        type: Options.array,
        nest: {
          name,
          type: Options.name,
        },
      };
    }
    return {
      name,
      type: Options.name,
    };
  };

  /**
   * Resolve object field
   *
   * @param f
   */
  static resolveObjectField(f: ObjectFieldNode): ParserField[] {
    return [
      {
        name: f.name.value,
        type: {
          fieldType: TypeResolver.resolveInputValueOptions(f.value, f.name.value),
        },
        data: {
          type: Instances.Argument,
        },
        interfaces: [],
        directives: [],
        args: [],
        value: {
          type: kindAsValue(f.value.kind),
          value: extractDefaultValueString(f.value),
        },
        id: generateNodeId(f.name.value, Instances.Argument, []),
      },
    ];
  }

  /**
   * Iterate directives
   * @param directives GraphQL Directive nodes
   */
  static iterateDirectives(directives: ReadonlyArray<DirectiveNode>): ParserField[] {
    return directives.map((n) => {
      const args = n.arguments ? TypeResolver.iterateArgumentFields(n.arguments) : [];
      return {
        name: n.name.value,
        type: {
          fieldType: {
            name: n.name.value,
            type: Options.name,
          },
        },
        directives: [],
        interfaces: [],
        data: {
          type: Instances.Directive,
        },
        args,
        id: generateNodeId(n.name.value, Instances.Directive, args),
      };
    });
  }

  /**
   * Iterate argument fields
   *
   * @param fields Argument Nodes
   * @returns
   */
  static iterateArgumentFields(fields: ReadonlyArray<ArgumentNode>): ParserField[] {
    return fields.map((n) => {
      return {
        name: n.name.value,
        type: {
          fieldType: TypeResolver.resolveInputValueOptions(n.value, n.name.value),
        },
        data: {
          type: Instances.Argument,
        },
        directives: [],
        interfaces: [],
        value: {
          type: kindAsValue(n.value.kind),
          value: extractDefaultValueString(n.value),
        },
        args: [],
        id: generateNodeId(n.name.value, Instances.Argument, []),
      };
    });
  }

  /**
   * Iterate fields of input
   *
   * @param fields Input Value Definitions
   */
  static iterateInputValueFields(fields: ReadonlyArray<InputValueDefinitionNode>): ParserField[] {
    return fields.map((n) => {
      const value = n.defaultValue
        ? {
            type: kindAsValue(n.defaultValue.kind),
            value: extractDefaultValueString(n.defaultValue),
          }
        : undefined;
      return {
        name: n.name.value,
        ...(n.description ? { description: n.description.value } : {}),
        directives: n.directives ? TypeResolver.iterateDirectives(n.directives) : [],
        type: { fieldType: TypeResolver.resolveSingleFieldType(n.type) },
        data: {
          type: ValueDefinition.InputValueDefinition,
        },
        args: [],
        interfaces: [],
        ...(value ? { value } : {}),
        id: generateNodeId(n.name.value, ValueDefinition.InputValueDefinition, []),
      };
    });
  }

  /**
   * Resolve interfaces on Object Type
   *
   * @param n Type node
   */
  static resolveInterfaces(n: TypeDefinitionNode): string[] | undefined {
    if (n.kind !== 'ObjectTypeDefinition' || !n.interfaces) {
      return;
    }
    return n.interfaces.map((i) => i.name.value);
  }

  /**
   * Resolve fields of Type Defintiion node
   *
   * @param n Type Defintiion node
   */
  static resolveFields(n: TypeDefinitionNode): ParserField[] | undefined {
    if (n.kind === 'EnumTypeDefinition') {
      if (!n.values) {
        return;
      }
      return n.values.map((v) => ({
        name: v.name.value,
        ...(v.description ? { description: v.description.value } : {}),
        directives: v.directives ? TypeResolver.iterateDirectives(v.directives) : [],
        interfaces: [],
        args: [],
        type: { fieldType: { name: ValueDefinition.EnumValueDefinition, type: Options.name } },
        data: {
          type: ValueDefinition.EnumValueDefinition,
        },
        id: generateNodeId(v.name.value, ValueDefinition.EnumValueDefinition, []),
      }));
    }
    if (n.kind === 'ScalarTypeDefinition') {
      return;
    }
    if (n.kind === 'UnionTypeDefinition') {
      if (!n.types) {
        return;
      }
      return n.types.map((t) => ({
        name: t.name.value,
        type: { fieldType: { name: t.name.value, type: Options.name } },
        interfaces: [],
        args: [],
        directives: [],
        data: {
          type: TypeSystemDefinition.UnionMemberDefinition,
        },
        id: generateNodeId(t.name.value, TypeSystemDefinition.UnionMemberDefinition, []),
      }));
    }
    if (n.kind === 'InputObjectTypeDefinition') {
      if (!n.fields) {
        return;
      }
      const fields = TypeResolver.iterateInputValueFields(n.fields);
      return fields;
    }
    if (!n.fields) {
      return;
    }
    const fields = TypeResolver.iterateObjectTypeFields(n.fields);
    return fields;
  }

  static resolveFieldsFromDefinition(
    n: TypeSystemDefinitionNode | TypeSystemExtensionNode | SchemaDefinitionNode,
  ): ParserField[] {
    if ('values' in n && n.values) {
      return n.values.map((v) => ({
        name: v.name.value,
        args: [],
        interfaces: [],
        ...(v.description ? { description: v.description.value } : {}),
        directives: v.directives ? TypeResolver.iterateDirectives(v.directives) : [],
        type: { fieldType: { name: ValueDefinition.EnumValueDefinition, type: Options.name } },
        data: {
          type: ValueDefinition.EnumValueDefinition,
        },
        id: generateNodeId(v.name.value, ValueDefinition.EnumValueDefinition, []),
      }));
    }
    if ('types' in n && n.types) {
      return n.types.map((t) => ({
        name: t.name.value,
        directives: [],
        args: [],
        interfaces: [],
        type: { fieldType: { name: t.name.value, type: Options.name } },
        data: {
          type: TypeSystemDefinition.UnionMemberDefinition,
        },
        id: generateNodeId(t.name.value, TypeSystemDefinition.UnionMemberDefinition, []),
      }));
    }
    if ((n.kind === 'InputObjectTypeDefinition' || n.kind === 'InputObjectTypeExtension') && n.fields) {
      return TypeResolver.iterateInputValueFields(n.fields);
    }
    if ('arguments' in n && n.arguments) {
      return TypeResolver.iterateInputValueFields(n.arguments);
    }
    if (
      n.kind === 'ObjectTypeDefinition' ||
      n.kind === 'ObjectTypeExtension' ||
      n.kind === 'InterfaceTypeDefinition' ||
      n.kind === 'InterfaceTypeExtension'
    ) {
      if (!n.fields) {
        throw new Error('Type object should have fields');
      }
      return TypeResolver.iterateObjectTypeFields(n.fields);
    }
    return [];
  }
}
