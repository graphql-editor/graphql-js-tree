import {
  buildASTSchema,
  DocumentNode,
  GraphQLSchema,
  isTypeSystemDefinitionNode,
  isTypeSystemExtensionNode,
  parse,
  SchemaDefinitionNode,
  SchemaExtensionNode,
  TypeDefinitionNode,
  TypeSystemDefinitionNode,
} from 'graphql';
import { ParserField, ParserTree, TypeDefinitionDisplayMap, Options, kindAsAllTypes } from '@/Models';
import {
  Directive,
  Helpers,
  TypeDefinition,
  TypeExtension,
  TypeSystemDefinition,
  TypeSystemExtension,
} from '@/Models/Spec';
import { TypeResolver } from './typeResolver';
import { ParserUtils } from './ParserUtils';
import { createParserField, createSchemaDefinition, generateNodeId } from '@/shared';
export class Parser {
  static findComments(schema: string): string[] {
    const stripDocs = schema
      .split(`"""`)
      .filter((e, i) => i % 2 !== 1)
      .join('');
    return stripDocs
      .split('\n')
      .filter((s) => s.trimStart().startsWith('#'))
      .map((s) => s.trimStart().slice(1).trimStart());
  }
  /**
   * Parse schema from string and return ast
   *
   * @param schema
   */
  static importSchema = (schema: string): GraphQLSchema => buildASTSchema(parse(schema));
  static documentDefinitionToSerializedNodeTree = (
    d: TypeSystemDefinitionNode | TypeDefinitionNode | SchemaDefinitionNode | SchemaExtensionNode,
  ): ParserField | undefined => {
    if (isTypeSystemDefinitionNode(d) || isTypeSystemExtensionNode(d)) {
      const args = TypeResolver.resolveFieldsFromDefinition(d);
      const interfaces = 'interfaces' in d && d.interfaces ? d.interfaces.map((i) => i.name.value) : [];
      const directives = 'directives' in d && d.directives ? TypeResolver.iterateDirectives(d.directives) : [];
      if (d.kind === 'SchemaDefinition') {
        return {
          name: 'schema',
          args: d.operationTypes.map((ot) =>
            createParserField({
              name: ot.operation,
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              type: {
                fieldType: {
                  name: ot.type.name.value,
                  type: Options.name,
                },
              },
            }),
          ),
          data: {
            type: TypeSystemDefinition.SchemaDefinition,
          },
          directives: d.directives ? TypeResolver.iterateDirectives(d.directives) : [],
          id: generateNodeId('schema', kindAsAllTypes(d.kind), []),
          interfaces: [],
          type: {
            fieldType: {
              type: Options.name,
              name: 'schema',
            },
          },
        };
      }
      if (d.kind === 'SchemaExtension') {
        return {
          name: 'schema',
          data: {
            type: TypeSystemExtension.SchemaExtension,
          },
          directives: d.directives ? TypeResolver.iterateDirectives(d.directives) : [],
          interfaces: [],
          type: {
            fieldType: {
              type: Options.name,
              name: 'schema',
            },
          },
          args:
            d.operationTypes?.map((ot) =>
              createParserField({
                name: ot.operation,
                data: {
                  type: TypeSystemDefinition.FieldDefinition,
                },
                type: {
                  fieldType: {
                    name: ot.type.name.value,
                    type: Options.name,
                  },
                },
              }),
            ) || [],
          id: generateNodeId('schema', kindAsAllTypes(d.kind), []),
        };
      }
      return {
        name: d.name.value,
        type:
          d.kind === 'DirectiveDefinition'
            ? {
                fieldType: { name: TypeDefinitionDisplayMap[d.kind], type: Options.name },
                directiveOptions: d.locations.map((l) => l.value as Directive),
              }
            : {
                fieldType: { name: TypeDefinitionDisplayMap[d.kind], type: Options.name },
              },
        data: {
          type: kindAsAllTypes(d.kind),
        },

        ...('description' in d && d.description?.value ? { description: d.description.value } : {}),
        interfaces,
        directives,
        args,
        id: generateNodeId(d.name.value, kindAsAllTypes(d.kind), args),
      };
    }
  };
  /**
   * Parse whole string GraphQL schema and return ParserTree
   *
   * @param schema GraphQL schema string
   * @param [excludeRoots=[]] param to exclude some node names from parsing in this schema
   * @returns
   */
  static parse = (schema: string, excludeRoots: string[] = [], libraries = ''): ParserTree => {
    let parsedSchema: DocumentNode | undefined;
    const compiledSchema = [libraries, schema].join('\n');
    const isEmptySchema = compiledSchema.replace(/\s+/gm, '').length === 0;
    if (isEmptySchema) {
      return { nodes: [] };
    }
    try {
      parsedSchema = parse(compiledSchema);
    } catch (error) {
      if (compiledSchema.trim()) {
        console.error(error);
      }
    }
    if (!parsedSchema) {
      throw new Error('Cannot parse the schema');
    }

    const nodes = parsedSchema.definitions
      .filter((t) =>
        t.kind === 'SchemaExtension' || t.kind === 'SchemaDefinition'
          ? true
          : 'name' in t && t.name && !excludeRoots.includes(t.name.value),
      )
      .filter((t) => t.kind !== 'FragmentDefinition')
      .map((t) =>
        Parser.documentDefinitionToSerializedNodeTree(
          t as TypeDefinitionNode | SchemaDefinitionNode | TypeSystemDefinitionNode | SchemaExtensionNode,
        ),
      )
      .filter((d) => !!d) as ParserField[];
    const comments: ParserField[] = Parser.findComments(schema).map((description) =>
      createParserField({
        name: Helpers.Comment,
        type: {
          fieldType: {
            name: Helpers.Comment,
            type: Options.name,
          },
        },
        data: {
          type: Helpers.Comment,
        },
        description,
      }),
    );
    const nodeTree: ParserTree = {
      nodes: [...comments, ...nodes],
    };
    const allInterfaceNodes = nodeTree.nodes.filter((n) => n.data.type === TypeDefinition.InterfaceTypeDefinition);
    nodeTree.nodes.forEach((n) => {
      if (
        n.data.type === TypeDefinition.ObjectTypeDefinition ||
        n.data.type === TypeDefinition.InterfaceTypeDefinition
      ) {
        if (n.interfaces) {
          const myInterfaces = allInterfaceNodes
            .filter((interfaceNode) => n.interfaces.includes(interfaceNode.name))
            .map((n) => ({
              name: n.name,
              argNames: n.args.map((a) => a.name),
            }));
          n.args = n.args.map((a) => {
            const interfaceNames = myInterfaces
              .filter((myInterface) => myInterface.argNames.includes(a.name))
              .map((i) => i.name);
            if (interfaceNames.length)
              return {
                ...a,
                fromInterface: interfaceNames,
              };
            return a;
          });
        }
      }
    });
    const schemaNode = nodeTree.nodes.find((n) => n.data.type === TypeSystemDefinition.SchemaDefinition);
    if (!schemaNode) {
      const query = nodeTree.nodes.find((n) => n.name === 'Query')?.name;
      const mutation = nodeTree.nodes.find((n) => n.name === 'Mutation')?.name;
      const subscription = nodeTree.nodes.find((n) => n.name === 'Subscription')?.name;
      if (query || mutation || subscription) {
        nodeTree.nodes.push(
          createSchemaDefinition({
            operations: {
              query,
              mutation,
              subscription,
            },
          }),
        );
      }
    }
    return nodeTree;
  };
  static parseAddExtensions = (schema: string, excludeRoots: string[] = []): ParserTree => {
    const parsed = Parser.parse(schema, excludeRoots);
    const Extensions = parsed.nodes.filter((n) => n.data.type && n.data.type in TypeExtension);
    if (!Extensions || Extensions.length === 0) {
      return parsed;
    }
    const nodes = parsed.nodes.filter((n) => !(n.data.type && n.data.type in TypeExtension));
    Extensions.forEach((e) => {
      const extendedNode = nodes.find((we) => ParserUtils.isExtensionOf(e, we));
      if (!extendedNode) {
        throw new Error(`Invalid extension node`);
      }
      extendedNode.directives = [...(extendedNode.directives || []), ...e.directives];
      extendedNode.interfaces = [...(extendedNode.interfaces || []), ...e.interfaces];
      extendedNode.args = [...(extendedNode.args || []), ...e.args];
    });

    return { nodes };
  };
}
export * from './ParserUtils';
