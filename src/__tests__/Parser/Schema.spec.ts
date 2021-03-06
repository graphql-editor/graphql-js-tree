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
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
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
              directives: [],
              args: [],
              interfaces: [],
            },
          ],
        },
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`query should exist`, () => {
    const schema = `type Query{
          status: ${ScalarTypes.String}
      }
      `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
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
              directives: [],
              args: [],
              interfaces: [],
            },
          ],
        },
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
        {
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
          interfaces: [],
          directives: [],
          args: [],
        },
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
});
