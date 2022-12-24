import { createParserField } from '@/shared';
import {
  OperationType,
  ParserTree,
  ScalarTypes,
  TypeDefinition,
  TypeDefinitionDisplayStrings,
  TypeSystemDefinition,
  Options,
} from '../../Models';
import { Parser } from '../../Parser';

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
            operations: [OperationType.query],
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
            operations: [OperationType.query],
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
            operations: [OperationType.mutation],
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
            operations: [OperationType.subscription],
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
            operations: [OperationType.query],
            fieldType: {
              name: TypeDefinitionDisplayStrings.type,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ObjectTypeDefinition,
          },
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
});
