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
import { TreeToGraphQL } from '../../TreeToGraphQL';

describe('Input Values tests on TreeToGraphQL', () => {
  test(`Built in ScalarTypes - ${Object.keys(ScalarTypes).join(', ')}`, () => {
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

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`car: Car`);
  });
  test('Input objects', () => {
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

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`car: Car`);
  });
  test('Custom scalar objects', () => {
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

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`car: Car`);
  });
  test(`Default ScalarTypes values - ${Object.keys(ScalarTypes).join(', ')}`, () => {
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

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`id: ${ScalarTypes.ID} = "abcdef"`);
    expect(graphql).toContain(`name: ${ScalarTypes.String} = "Arturo"`);
    expect(graphql).toContain(`age: ${ScalarTypes.Int} = 28`);
    expect(graphql).toContain(`weight: ${ScalarTypes.Float} = 73.0`);
    expect(graphql).toContain(`verified: ${ScalarTypes.Boolean} = true`);
  });
  test('Default Input Arrays', () => {
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
                type: Value.ListValue,
                value: '["Arturo","A","B"]',
              },
            }),
          ],
        }),
      ],
    };
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`names: [String] = [`);
  });
  test('Default Input objects', () => {
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
                value: '{year:2010}',
              },
            }),
          ],
        }),
      ],
    };
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`car: Car = {year:2010}`);
  });
  test('Default Enum objects', () => {
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
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`car: Car = HONDA`);
  });
});
