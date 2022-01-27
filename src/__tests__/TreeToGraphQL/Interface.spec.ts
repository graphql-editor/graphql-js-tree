import { ParserTree, ScalarTypes, TypeDefinition, TypeSystemDefinition, Options } from '../../Models';
import { TreeToGraphQL } from '../../TreeToGraphQL';

describe('Interfaces works as expected in TreeGraphQL', () => {
  it('Implements HasName Person interface', () => {
    const treeMock: ParserTree = {
      nodes: [
        {
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
          directives: [],
          args: [
            {
              name: 'name',
              interfaces: [],
              args: [],
              type: {
                fieldType: {
                  name: ScalarTypes.String,
                  type: Options.name,
                },
              },
              directives: [],
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            },
          ],
        },
        {
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
          directives: [],
          interfaces: [],
          args: [
            {
              name: 'name',
              interfaces: [],
              args: [],
              type: {
                fieldType: {
                  name: ScalarTypes.String,
                  type: Options.name,
                },
              },
              directives: [],
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            },
          ],
        },
        {
          name: 'HasAge',
          interfaces: [],
          type: {
            fieldType: {
              name: 'interface',
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InterfaceTypeDefinition,
          },
          directives: [],
          args: [
            {
              name: 'age',
              args: [],
              type: {
                fieldType: {
                  name: ScalarTypes.Int,
                  type: Options.name,
                },
              },
              directives: [],
              interfaces: [],
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            },
          ],
        },
      ],
    };
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`interface Person implements HasName & HasAge`);
  });
  it('Implements HasName Person type', () => {
    const treeMock: ParserTree = {
      nodes: [
        {
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
          directives: [],
          args: [
            {
              name: 'name',
              args: [],
              interfaces: [],
              type: {
                fieldType: {
                  name: ScalarTypes.String,
                  type: Options.name,
                },
              },
              directives: [],
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            },
          ],
        },
        {
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
          directives: [],
          interfaces: [],
          args: [
            {
              name: 'name',
              args: [],
              type: {
                fieldType: {
                  name: ScalarTypes.String,
                  type: Options.name,
                },
              },
              interfaces: [],
              directives: [],
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            },
          ],
        },
        {
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
          directives: [],
          interfaces: [],
          args: [
            {
              name: 'age',
              args: [],
              type: {
                fieldType: {
                  name: ScalarTypes.Int,
                  type: Options.name,
                },
              },
              interfaces: [],
              directives: [],
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            },
          ],
        },
      ],
    };
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`type Person implements HasName & HasAge`);
  });
});
