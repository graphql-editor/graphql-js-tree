import {
  buildASTSchema,
  DefinitionNode,
  DocumentNode,
  GraphQLSchema,
  isTypeSystemDefinitionNode,
  isTypeSystemExtensionNode,
  parse,
} from 'graphql';
import { ParserField, ParserTree, TypeDefinitionDisplayMap, Options, kindAsAllTypes } from '@/Models';
import { Directive, Helpers, OperationType, TypeDefinition, TypeExtension } from '@/Models/Spec';
import { TypeResolver } from './typeResolver';
import { ParserUtils } from './ParserUtils';
import { createParserField, generateNodeId } from '@/shared';
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
  static documentDefinitionToSerializedNodeTree = (d: DefinitionNode): ParserField | undefined => {
    if (isTypeSystemDefinitionNode(d) || isTypeSystemExtensionNode(d)) {
      const args = TypeResolver.resolveFieldsFromDefinition(d);
      if ('name' in d) {
        const interfaces = 'interfaces' in d && d.interfaces ? d.interfaces.map((i) => i.name.value) : [];
        const directives = 'directives' in d && d.directives ? TypeResolver.iterateDirectives(d.directives) : [];

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
    const operations: { Query?: string; Mutation?: string; Subscription?: string } = {};

    const schemaDefinition = parsedSchema.definitions.find((d) => d.kind === 'SchemaDefinition');
    if (schemaDefinition && 'operationTypes' in schemaDefinition) {
      schemaDefinition.operationTypes?.forEach((ot) => {
        if (ot.operation === 'query') {
          operations.Query = ot.type.name.value;
        }
        if (ot.operation === 'mutation') {
          operations.Mutation = ot.type.name.value;
        }
        if (ot.operation === 'subscription') {
          operations.Subscription = ot.type.name.value;
        }
      });
    }
    const nodes = parsedSchema.definitions
      .filter((t) => 'name' in t && t.name && !excludeRoots.includes(t.name.value))
      .map(Parser.documentDefinitionToSerializedNodeTree)
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
      if (n.data.type === TypeDefinition.ObjectTypeDefinition) {
        if (operations.Query ? operations.Query === n.name : n.name === 'Query') {
          n.type.operations = [OperationType.query];
        }
        if (operations.Mutation ? operations.Mutation === n.name : n.name === 'Mutation') {
          n.type.operations = [OperationType.mutation];
        }
        if (operations.Subscription ? operations.Subscription === n.name : n.name === 'Subscription') {
          n.type.operations = [OperationType.subscription];
        }
      }
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
