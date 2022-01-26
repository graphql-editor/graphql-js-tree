import {
  Instances,
  ParserTree,
  ScalarTypes,
  TypeDefinition,
  TypeDefinitionDisplayStrings,
  Value,
  ValueDefinition,
  Options,
} from '../../Models';
import { TreeToGraphQL } from '../../TreeToGraphQL';

describe('Input Values tests on TreeToGraphQL', () => {
  test(`Built in ScalarTypes - ${Object.keys(ScalarTypes).join(', ')}`, () => {
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Person',
          interfaces: [],
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.input,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InputObjectTypeDefinition,
          },
          directives: [],
          args: [
            {
              interfaces: [],
              name: 'id',
              type: {
                fieldType: {
                  name: ScalarTypes.ID,
                  type: Options.name,
                },
              },
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              args: [],
            },
            {
              interfaces: [],
              name: 'name',
              type: {
                fieldType: {
                  name: ScalarTypes.String,
                  type: Options.name,
                },
              },
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              args: [],
            },
            {
              interfaces: [],
              name: 'age',
              type: {
                fieldType: {
                  name: ScalarTypes.Int,
                  type: Options.name,
                },
              },
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              args: [],
            },
            {
              name: 'weight',
              interfaces: [],
              type: {
                fieldType: {
                  name: ScalarTypes.Float,
                  type: Options.name,
                },
              },
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              args: [],
            },
            {
              name: 'verified',
              interfaces: [],
              type: {
                fieldType: {
                  name: ScalarTypes.Boolean,
                  type: Options.name,
                },
              },
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              args: [],
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
  test('Enum objects', () => {
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Car',
          interfaces: [],
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
        },
        {
          name: 'Person',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.input,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InputObjectTypeDefinition,
          },
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'car',
              interfaces: [],
              type: {
                fieldType: {
                  name: 'Car',
                  type: Options.name,
                },
              },
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              args: [],
            },
          ],
        },
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`car: Car`);
  });
  test('Input objects', () => {
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Car',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.input,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InputObjectTypeDefinition,
          },
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'year',
              interfaces: [],
              type: {
                fieldType: {
                  name: ScalarTypes.Int,
                  type: Options.name,
                },
              },
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              args: [],
            },
          ],
        },
        {
          name: 'Person',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.input,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InputObjectTypeDefinition,
          },
          interfaces: [],
          directives: [],
          args: [
            {
              interfaces: [],
              name: 'car',
              type: {
                fieldType: {
                  name: 'Car',
                  type: Options.name,
                },
              },
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              args: [],
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
          args: [],
          interfaces: [],
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
        },
        {
          name: 'Person',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.input,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InputObjectTypeDefinition,
          },
          directives: [],
          interfaces: [],
          args: [
            {
              name: 'car',
              interfaces: [],
              type: {
                fieldType: {
                  name: 'Car',
                  type: Options.name,
                },
              },
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              args: [],
            },
          ],
        },
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`car: Car`);
  });
  test(`Default ScalarTypes values - ${Object.keys(ScalarTypes).join(', ')}`, () => {
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Person',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.input,
              type: Options.name,
            },
          },
          interfaces: [],
          data: {
            type: TypeDefinition.InputObjectTypeDefinition,
          },
          directives: [],
          args: [
            {
              name: 'id',
              interfaces: [],
              type: {
                fieldType: {
                  name: ScalarTypes.ID,
                  type: Options.name,
                },
              },
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              args: [
                {
                  name: 'abcdef',
                  args: [],
                  directives: [],
                  interfaces: [],
                  type: {
                    fieldType: {
                      name: Value.StringValue,
                      type: Options.name,
                    },
                  },
                  data: {
                    type: Value.StringValue,
                  },
                },
              ],
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
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              interfaces: [],
              args: [
                {
                  name: 'Artur',
                  args: [],
                  directives: [],
                  interfaces: [],
                  type: {
                    fieldType: {
                      name: Value.StringValue,
                      type: Options.name,
                    },
                  },
                  data: {
                    type: Value.StringValue,
                  },
                },
              ],
            },
            {
              name: 'age',
              type: {
                fieldType: {
                  name: ScalarTypes.Int,
                  type: Options.name,
                },
              },
              interfaces: [],
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              args: [
                {
                  name: '28',
                  args: [],
                  directives: [],
                  interfaces: [],
                  type: {
                    fieldType: {
                      name: Value.IntValue,
                      type: Options.name,
                    },
                  },
                  data: {
                    type: Value.IntValue,
                  },
                },
              ],
            },
            {
              name: 'weight',
              type: {
                fieldType: {
                  name: ScalarTypes.Float,
                  type: Options.name,
                },
              },
              interfaces: [],
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              args: [
                {
                  name: '73.0',
                  args: [],
                  directives: [],
                  interfaces: [],
                  type: {
                    fieldType: {
                      name: Value.FloatValue,
                      type: Options.name,
                    },
                  },
                  data: {
                    type: Value.FloatValue,
                  },
                },
              ],
            },
            {
              name: 'verified',
              type: {
                fieldType: {
                  name: ScalarTypes.Boolean,
                  type: Options.name,
                },
              },
              interfaces: [],
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              args: [
                {
                  name: 'true',
                  args: [],
                  directives: [],
                  interfaces: [],
                  type: {
                    fieldType: {
                      name: Value.BooleanValue,
                      type: Options.name,
                    },
                  },
                  data: {
                    type: Value.BooleanValue,
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`id: ${ScalarTypes.ID} = "abcdef"`);
    expect(graphql).toContain(`name: ${ScalarTypes.String} = "Artur"`);
    expect(graphql).toContain(`age: ${ScalarTypes.Int} = 28`);
    expect(graphql).toContain(`weight: ${ScalarTypes.Float} = 73.0`);
    expect(graphql).toContain(`verified: ${ScalarTypes.Boolean} = true`);
  });

  test('Default Input objects', () => {
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Car',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.input,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InputObjectTypeDefinition,
          },
          directives: [],
          interfaces: [],
          args: [
            {
              name: 'year',
              interfaces: [],
              type: {
                fieldType: {
                  name: ScalarTypes.Int,
                  type: Options.name,
                },
              },
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              args: [],
            },
          ],
        },
        {
          name: 'Person',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.input,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InputObjectTypeDefinition,
          },
          directives: [],
          interfaces: [],
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
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              interfaces: [],
              args: [
                {
                  name: Value.ObjectValue,
                  directives: [],
                  interfaces: [],
                  type: {
                    fieldType: {
                      name: Value.ObjectValue,
                      type: Options.name,
                    },
                  },
                  data: {
                    type: Value.ObjectValue,
                  },
                  args: [
                    {
                      directives: [],
                      interfaces: [],
                      name: 'year',
                      type: {
                        fieldType: {
                          name: 'year',
                          type: Options.name,
                        },
                      },
                      data: {
                        type: Instances.Argument,
                      },
                      args: [
                        {
                          args: [],
                          directives: [],
                          interfaces: [],
                          name: '2010',
                          type: {
                            fieldType: {
                              name: Value.IntValue,
                              type: Options.name,
                            },
                          },
                          data: {
                            type: Value.IntValue,
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`car: Car = {`);
    expect(graphql).toContain(`year: 2010`);
  });
  test('Default Enum objects', () => {
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
          interfaces: [],
          args: [
            {
              name: 'HONDA',
              data: {
                type: ValueDefinition.EnumValueDefinition,
              },
              type: {
                fieldType: {
                  name: ValueDefinition.EnumValueDefinition,
                  type: Options.name,
                },
              },
              directives: [],
              args: [],
              interfaces: [],
            },
            {
              name: 'YAMAHA',
              data: {
                type: ValueDefinition.EnumValueDefinition,
              },
              type: {
                fieldType: {
                  name: ValueDefinition.EnumValueDefinition,
                  type: Options.name,
                },
              },
              directives: [],
              args: [],
              interfaces: [],
            },
          ],
        },
        {
          name: 'Person',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.input,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InputObjectTypeDefinition,
          },
          directives: [],
          interfaces: [],
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
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              interfaces: [],
              args: [
                {
                  name: 'HONDA',
                  type: {
                    fieldType: {
                      name: 'HONDA',
                      type: Options.name,
                    },
                  },
                  data: {
                    type: Value.EnumValue,
                  },
                  args: [],
                  directives: [],
                  interfaces: [],
                },
              ],
            },
          ],
        },
      ],
    };
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`car: Car = HONDA`);
  });
});
