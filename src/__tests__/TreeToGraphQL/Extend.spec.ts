import { createParserField } from '@/shared';
import {
  ParserTree,
  ScalarTypes,
  TypeDefinition,
  TypeDefinitionDisplayStrings,
  TypeExtension,
  TypeSystemDefinition,
  Options,
} from '../../Models';
import { TreeToGraphQL } from '../../TreeToGraphQL';

describe('Extend tests on TreeToGraphQL', () => {
  it('Extends Person TreeToGraphQL', () => {
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'Person',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.type,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ObjectTypeDefinition,
          },
          description: '',
          args: [
            createParserField({
              name: 'name',
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
          name: 'Person',
          type: {
            fieldType: {
              name: 'type',
              type: Options.name,
            },
          },
          data: {
            type: TypeExtension.ObjectTypeExtension,
          },
          description: '',
          args: [
            createParserField({
              name: 'age',
              type: {
                fieldType: {
                  name: ScalarTypes.Int,
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
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`extend type Person`);
  });
});
