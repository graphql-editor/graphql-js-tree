import {
  Options,
  ParserTree,
  ScalarTypes,
  TypeDefinition,
  TypeDefinitionDisplayStrings,
  TypeSystemDefinition,
} from '../../Models';
import { TreeToGraphQL } from '../../TreeToGraphQL';

describe('Fields tests on parser', () => {
  test(`Built in ScalarTypes - ${Object.keys(ScalarTypes).join(', ')}`, () => {
    const treeMock: ParserTree = {
      nodes: [
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'id',
              type: {
                fieldType: {
                  name: ScalarTypes.ID,
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
            {
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
              directives: [],
              args: [],
              interfaces: [],
            },
            {
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
              directives: [],
              args: [],
              interfaces: [],
            },
            {
              name: 'weight',
              type: {
                fieldType: {
                  name: ScalarTypes.Float,
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
            {
              name: 'verified',
              type: {
                fieldType: {
                  name: ScalarTypes.Boolean,
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

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`id: ${ScalarTypes.ID}`);
    expect(graphql).toContain(`name: ${ScalarTypes.String}`);
    expect(graphql).toContain(`age: ${ScalarTypes.Int}`);
    expect(graphql).toContain(`weight: ${ScalarTypes.Float}`);
    expect(graphql).toContain(`verified: ${ScalarTypes.Boolean}`);
  });
  test('Type objects', () => {
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Car',
          type: {
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
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'car',
              type: {
                fieldType: {
                  name: 'Car',
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

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`car: Car`);
  });
  test('Interface objects', () => {
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Car',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.interface,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InterfaceTypeDefinition,
          },
          directives: [],
          args: [],
          interfaces: [],
        },
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'car',
              type: {
                fieldType: {
                  name: 'Car',
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

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`car: Car`);
  });
  test('Enum objects', () => {
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Car',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.enum,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.EnumTypeDefinition,
          },
          directives: [],
          args: [],
          interfaces: [],
        },
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'car',
              type: {
                fieldType: {
                  name: 'Car',
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

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`car: Car`);
  });
  test('Custom scalar objects', () => {
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Car',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.scalar,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ScalarTypeDefinition,
          },
          directives: [],
          interfaces: [],
          args: [],
        },
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'car',
              type: {
                fieldType: {
                  name: 'Car',
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

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`car: Car`);
  });
  test('Union objects', () => {
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Car',
          type: {
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
        {
          name: 'Plane',
          type: {
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
        {
          name: 'Machine',
          interfaces: [],
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.union,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.UnionTypeDefinition,
          },
          directives: [],
          args: [
            {
              name: 'Car',
              directives: [],
              interfaces: [],
              args: [],
              type: {
                fieldType: {
                  name: 'Car',
                  type: Options.name,
                },
              },
              data: {
                type: TypeSystemDefinition.UnionMemberDefinition,
              },
            },
            {
              name: 'Plane',
              directives: [],
              interfaces: [],
              args: [],
              type: {
                fieldType: {
                  name: 'Plane',
                  type: Options.name,
                },
              },
              data: {
                type: TypeSystemDefinition.UnionMemberDefinition,
              },
            },
          ],
        },
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'machine',
              type: {
                fieldType: {
                  name: 'Machine',
                  type: Options.name,
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
            },
          ],
        },
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`machine: Machine`);
  });
  test(`Required fields`, () => {
    const treeMock: ParserTree = {
      nodes: [
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'id',
              type: {
                fieldType: {
                  type: Options.required,
                  nest: {
                    type: Options.name,
                    name: ScalarTypes.ID,
                  },
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
            },
          ],
        },
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`id: ID!`);
  });
  test(`ListType fields`, () => {
    const treeMock: ParserTree = {
      nodes: [
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'id',
              type: {
                fieldType: {
                  type: Options.required,
                  nest: {
                    name: ScalarTypes.ID,
                    type: Options.name,
                  },
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
            },
            {
              name: 'name',
              type: {
                fieldType: {
                  type: Options.array,
                  nest: {
                    name: ScalarTypes.String,
                    type: Options.name,
                  },
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
            },
            {
              name: 'friends',
              type: {
                fieldType: {
                  type: Options.required,
                  nest: {
                    type: Options.array,
                    nest: {
                      type: Options.required,
                      nest: {
                        type: Options.name,
                        name: 'Person',
                      },
                    },
                  },
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
            },
          ],
        },
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`name: [${ScalarTypes.String}]`);
    expect(graphql).toContain(`friends: [Person!]!`);
  });
  test(`ListType nested lists`, () => {
    const treeMock: ParserTree = {
      nodes: [
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'matrix',
              type: {
                fieldType: {
                  type: Options.array,
                  nest: {
                    type: Options.array,
                    nest: {
                      type: Options.name,
                      name: ScalarTypes.String,
                    },
                  },
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
            },
          ],
        },
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`matrix: [[${ScalarTypes.String}]]`);
  });
  test(`ListType nested lists with required`, () => {
    const treeMock: ParserTree = {
      nodes: [
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'matrix',
              type: {
                fieldType: {
                  type: Options.required,
                  nest: {
                    type: Options.array,
                    nest: {
                      type: Options.required,
                      nest: {
                        type: Options.array,
                        nest: {
                          type: Options.required,
                          nest: {
                            type: Options.name,
                            name: ScalarTypes.String,
                          },
                        },
                      },
                    },
                  },
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
            },
          ],
        },
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`matrix: [[${ScalarTypes.String}!]!]!`);
  });
});
