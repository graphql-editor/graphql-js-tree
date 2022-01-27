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
import { Parser } from '../../Parser';

describe('Input Values tests on parser', () => {
  test(`Built in ScalarTypes - ${Object.keys(ScalarTypes).join(', ')}`, () => {
    const schema = `input Person{
        id: ${ScalarTypes.ID}
        name: ${ScalarTypes.String}
        age: ${ScalarTypes.Int}
        weight: ${ScalarTypes.Float}
        verified: ${ScalarTypes.Boolean}
    }`;
    const tree = Parser.parse(schema);
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
          data: {
            type: TypeDefinition.InputObjectTypeDefinition,
          },
          directives: [],
          interfaces: [],
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
                type: ValueDefinition.InputValueDefinition,
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
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
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
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
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
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
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
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
            },
          ],
        },
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test('Enum objects', () => {
    const schema = `
    enum Car
    input Person{
        car: Car
    }`;
    const tree = Parser.parse(schema);
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
              args: [],
              interfaces: [],
            },
          ],
        },
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test('Input objects', () => {
    const schema = `
    input Car{
        year:Int
    }
    input Person{
        car: Car
    }`;
    const tree = Parser.parse(schema);
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
              interfaces: [],
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
              args: [],
            },
          ],
        },
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test('Custom scalar objects', () => {
    const schema = `
    scalar Car
    input Person{
        car: Car
    }`;
    const tree = Parser.parse(schema);
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
              args: [],
              interfaces: [],
            },
          ],
        },
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`Default ScalarTypes values - ${Object.keys(ScalarTypes).join(', ')}`, () => {
    const schema = `input Person{
        id: ${ScalarTypes.ID} = "abcdef"
        name: ${ScalarTypes.String} = "Artur"
        emptyName: ${ScalarTypes.String} = ""
        noName: ${ScalarTypes.String}
        emptyArray: [${ScalarTypes.String}] = []
        noArray: [${ScalarTypes.String}]
        age: ${ScalarTypes.Int} = 28
        weight: ${ScalarTypes.Float} = 73.0
        verified: ${ScalarTypes.Boolean} = true
    }`;
    const tree = Parser.parse(schema);
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
              interfaces: [],
              args: [
                {
                  name: 'abcdef',
                  interfaces: [],
                  args: [],
                  directives: [],
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
                  interfaces: [],
                  args: [],
                  directives: [],
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
              name: 'emptyName',
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
                  name: '',
                  interfaces: [],
                  args: [],
                  directives: [],
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
              name: 'noName',
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
              args: [],
            },
            {
              name: 'emptyArray',
              type: {
                fieldType: {
                  type: Options.array,
                  nest: {
                    type: Options.name,
                    name: ScalarTypes.String,
                  },
                },
              },
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              args: [],
              interfaces: [],
            },
            {
              name: 'noArray',
              type: {
                fieldType: {
                  type: Options.array,
                  nest: {
                    type: Options.name,
                    name: ScalarTypes.String,
                  },
                },
              },
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
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
                type: ValueDefinition.InputValueDefinition,
              },
              interfaces: [],
              directives: [],
              args: [
                {
                  name: '28',
                  type: {
                    fieldType: {
                      name: Value.IntValue,
                      type: Options.name,
                    },
                  },
                  data: {
                    type: Value.IntValue,
                  },
                  args: [],
                  interfaces: [],
                  directives: [],
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
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              interfaces: [],
              args: [
                {
                  name: '73.0',
                  type: {
                    fieldType: {
                      name: Value.FloatValue,
                      type: Options.name,
                    },
                  },
                  data: {
                    type: Value.FloatValue,
                  },
                  args: [],
                  directives: [],
                  interfaces: [],
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
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              directives: [],
              interfaces: [],
              args: [
                {
                  name: 'true',
                  type: {
                    fieldType: {
                      name: Value.BooleanValue,
                      type: Options.name,
                    },
                  },
                  data: {
                    type: Value.BooleanValue,
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
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });

  test('Default Input objects', () => {
    const schema = `
    input Car{
        year:Int
    }
    input Person{
        car: Car = {
            year: 2010
        }
    }`;
    const tree = Parser.parse(schema);
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
              interfaces: [],
              directives: [],
              args: [
                {
                  name: Value.ObjectValue,
                  type: {
                    fieldType: {
                      name: Value.ObjectValue,
                      type: Options.name,
                    },
                  },
                  data: {
                    type: Value.ObjectValue,
                  },
                  interfaces: [],
                  directives: [],
                  args: [
                    {
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
                      interfaces: [],
                      directives: [],
                      args: [
                        {
                          name: '2010',
                          interfaces: [],
                          args: [],
                          directives: [],
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
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test('Default Enum objects', () => {
    const schema = `
    enum Car {
        HONDA
        YAMAHA
    }
    input Person{
        car: Car = HONDA
    }`;
    const tree = Parser.parse(schema);
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
              interfaces: [],
              args: [],
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
              interfaces: [],
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
                  interfaces: [],
                  directives: [],
                  args: [],
                },
              ],
            },
          ],
        },
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
});
