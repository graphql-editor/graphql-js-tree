import {
  createParserField,
  createPlainDirectiveImplementation,
  createRootDirectiveField,
  createSchemaDefinition,
  createSchemaExtension,
} from '@/shared';
import {
  ParserTree,
  ScalarTypes,
  TypeDefinition,
  TypeDefinitionDisplayStrings,
  TypeSystemDefinition,
  Options,
  Directive,
} from '@/Models';
import { Parser } from '@/Parser';

describe('Schema base operations', () => {
  test(`query`, () => {
    const schema = `type Query{
          status: ${ScalarTypes.String}
      }
      schema{
          query: Query
      }
      `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'Query',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.type,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ObjectTypeDefinition,
          },

          args: [
            createParserField({
              name: 'status',
              type: {
                fieldType: {
                  name: ScalarTypes.String,
                  type: Options.name,
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            }),
          ],
        }),
        createSchemaDefinition({
          operations: {
            query: 'Query',
          },
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`Detect Query, Mutation, Suscription`, () => {
    const schema = `type Query{
          status: ${ScalarTypes.String}
      }
      type Mutation{
        updateStatus: ${ScalarTypes.String}
      }
      type Subscription{
        watchStatus: ${ScalarTypes.String}
      }
      `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'Query',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.type,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ObjectTypeDefinition,
          },

          args: [
            createParserField({
              name: 'status',
              type: {
                fieldType: {
                  name: ScalarTypes.String,
                  type: Options.name,
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            }),
          ],
        }),
        createParserField({
          name: 'Mutation',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.type,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ObjectTypeDefinition,
          },

          args: [
            createParserField({
              name: 'updateStatus',
              type: {
                fieldType: {
                  name: ScalarTypes.String,
                  type: Options.name,
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            }),
          ],
        }),
        createParserField({
          name: 'Subscription',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.type,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ObjectTypeDefinition,
          },

          args: [
            createParserField({
              name: 'watchStatus',
              type: {
                fieldType: {
                  name: ScalarTypes.String,
                  type: Options.name,
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            }),
          ],
        }),
        createSchemaDefinition({
          operations: {
            query: 'Query',
            mutation: 'Mutation',
            subscription: 'Subscription',
          },
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`empty query`, () => {
    const schema = `
      type Query
      schema{
          query: Query
      }
      `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'Query',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.type,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ObjectTypeDefinition,
          },
        }),
        createSchemaDefinition({
          operations: {
            query: 'Query',
          },
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`schema directives query`, () => {
    const schema = `
      type Query
      directive @schemator on ${Directive.SCHEMA}
      schema @schemator{
          query: Query
      }
      `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'Query',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.type,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ObjectTypeDefinition,
          },
        }),
        createRootDirectiveField({ name: 'schemator', directiveOptions: [Directive.SCHEMA] }),
        createSchemaDefinition({
          operations: {
            query: 'Query',
          },
          directives: [
            createPlainDirectiveImplementation({
              name: 'schemator',
            }),
          ],
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`schema extension with directive`, () => {
    const schema = `
      type Query
      directive @schemator on ${Directive.SCHEMA}
      schema{
        query: Query
      }
      extend schema @schemator
      `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'Query',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.type,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ObjectTypeDefinition,
          },
        }),
        createSchemaDefinition({
          operations: {
            query: 'Query',
          },
        }),
        createSchemaExtension({
          directives: [createPlainDirectiveImplementation({ name: 'schemator' })],
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`schema extension with other operation`, () => {
    const schema = `
      type Query
      type ExtMut
      schema{
        query: Query
      }
      extend schema{
        mutation: ExtMut
      }
      `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'Query',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.type,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ObjectTypeDefinition,
          },
        }),
        createSchemaDefinition({
          operations: {
            query: 'Query',
          },
        }),
        createSchemaExtension({
          operations: {
            mutation: 'ExtMut',
          },
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
});
