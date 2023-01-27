import { createParserField, createPlainEnumValue, createPlainInputValue } from '@/shared';
import {
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
        createParserField({
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

          args: [
            createPlainInputValue({
              name: 'id',
              type: ScalarTypes.ID,
            }),
            createPlainInputValue({
              name: 'name',
              type: ScalarTypes.String,
            }),
            createPlainInputValue({
              name: 'age',
              type: ScalarTypes.Int,
            }),
            createPlainInputValue({
              name: 'weight',
              type: ScalarTypes.Float,
            }),
            createPlainInputValue({
              name: 'verified',
              type: ScalarTypes.Boolean,
            }),
          ],
        }),
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
        createParserField({
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
        }),
        createParserField({
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

          args: [
            createPlainInputValue({
              name: 'car',
              type: 'Car',
            }),
          ],
        }),
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
        createParserField({
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

          args: [
            createPlainInputValue({
              name: 'year',
              type: ScalarTypes.Int,
            }),
          ],
        }),
        createParserField({
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

          args: [
            createPlainInputValue({
              name: 'car',
              type: 'Car',
            }),
          ],
        }),
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
        createParserField({
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
        }),
        createParserField({
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

          args: [
            createPlainInputValue({
              name: 'car',
              type: 'Car',
            }),
          ],
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`Default ScalarTypes values - ${Object.keys(ScalarTypes).join(', ')}`, () => {
    const schema = `input Person{
        id: ${ScalarTypes.ID} = "abcdef"
        name: ${ScalarTypes.String} = "Arturo"
        emptyName: ${ScalarTypes.String}
        emptyArray: [${ScalarTypes.String}]
        age: ${ScalarTypes.Int} = 28
        weight: ${ScalarTypes.Float} = 73.0
        verified: ${ScalarTypes.Boolean} = true
    }`;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
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

          args: [
            createPlainInputValue({
              name: 'id',
              type: ScalarTypes.ID,
              value: {
                type: Value.StringValue,
                value: 'abcdef',
              },
            }),
            createPlainInputValue({
              name: 'name',
              type: ScalarTypes.String,
              value: {
                type: Value.StringValue,
                value: 'Arturo',
              },
            }),
            createPlainInputValue({
              name: 'emptyName',
              type: ScalarTypes.String,
            }),
            createParserField({
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
            }),
            createPlainInputValue({
              name: 'age',
              type: ScalarTypes.Int,
              value: {
                type: Value.IntValue,
                value: '28',
              },
            }),
            createPlainInputValue({
              name: 'weight',
              type: ScalarTypes.Float,
              value: {
                type: Value.FloatValue,
                value: '73.0',
              },
            }),
            createPlainInputValue({
              name: 'verified',
              type: ScalarTypes.Boolean,
              value: {
                type: Value.BooleanValue,
                value: 'true',
              },
            }),
          ],
        }),
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  test(`Default ScalarTypes values - ${Object.keys(ScalarTypes).join(', ')}`, () => {
    const schema = `input Person{
        names: [${ScalarTypes.String}] = ["Arturo","A","B"]
    }`;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
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

          args: [
            createParserField({
              name: 'names',
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
                type: ValueDefinition.InputValueDefinition,
              },
              value: {
                value: `["Arturo","A","B"]`,
                type: Value.ListValue,
              },
            }),
          ],
        }),
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
        car: Car = {year: 2010}
    }`;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
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

          args: [
            createPlainInputValue({
              name: 'year',
              type: ScalarTypes.Int,
            }),
          ],
        }),
        createParserField({
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

          args: [
            createPlainInputValue({
              name: 'car',
              type: 'Car',
              value: {
                type: Value.ObjectValue,
                value: `{year: 2010}`,
              },
            }),
          ],
        }),
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
        createParserField({
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

          args: [
            createPlainEnumValue({
              name: 'HONDA',
            }),
            createPlainEnumValue({
              name: 'YAMAHA',
            }),
          ],
        }),
        createParserField({
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

          args: [
            createPlainInputValue({
              name: 'car',
              type: 'Car',
              value: {
                type: Value.EnumValue,
                value: 'HONDA',
              },
            }),
          ],
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
});
