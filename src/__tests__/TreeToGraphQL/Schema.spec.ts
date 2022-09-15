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
import { TreeToGraphQL } from '../../TreeToGraphQL';
import { trimGraphQL } from '../TestUtils';

describe('Schema base operations in TreeToGraphQL', () => {
  test(`query`, () => {
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'Query',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.type,
              type: Options.name,
            },
            operations: [OperationType.query],
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

    const graphql = trimGraphQL(TreeToGraphQL.parse(treeMock));
    expect(graphql).toContain(`schema{ query: Query}`);
  });
  test(`empty query`, () => {
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'Query',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.type,
              type: Options.name,
            },
            operations: [OperationType.query],
          },
          data: {
            type: TypeDefinition.ObjectTypeDefinition,
          },
        }),
      ],
    };

    const graphql = trimGraphQL(TreeToGraphQL.parse(treeMock));
    expect(graphql).toContain(`schema{ query: Query}`);
  });
});
