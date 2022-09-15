import { createParserField } from '@/shared';
import { ParserTree, ScalarTypes, TypeDefinition, TypeSystemDefinition, Options } from '../../Models';
import { TreeToGraphQL } from '../../TreeToGraphQL';

describe('Interfaces works as expected in TreeGraphQL', () => {
  it('Implements HasName Person interface', () => {
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'Person',
          type: {
            fieldType: {
              name: 'interface',
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InterfaceTypeDefinition,
          },
          description: '',
          interfaces: ['HasName', 'HasAge'],

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
          name: 'HasName',
          type: {
            fieldType: {
              name: 'interface',
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InterfaceTypeDefinition,
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
          name: 'HasAge',

          type: {
            fieldType: {
              name: 'interface',
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InterfaceTypeDefinition,
          },

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
    expect(graphql).toContain(`interface Person implements HasName & HasAge`);
  });
  it('Implements HasName Person type', () => {
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'Person',
          type: {
            fieldType: {
              name: 'type',
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ObjectTypeDefinition,
          },
          interfaces: ['HasName', 'HasAge'],

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
          name: 'HasName',
          type: {
            fieldType: {
              name: 'interface',
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InterfaceTypeDefinition,
          },

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
          name: 'HasAge',
          type: {
            fieldType: {
              name: 'interface',
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InterfaceTypeDefinition,
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
    expect(graphql).toContain(`type Person implements HasName & HasAge`);
  });
});
