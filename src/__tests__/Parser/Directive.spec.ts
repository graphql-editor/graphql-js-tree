import {
  createParserField,
  createPlainArgument,
  createPlainDirectiveImplementation,
  createPlainEnumValue,
  createPlainField,
  createPlainInputValue,
  createRootDirectiveField,
  createRootField,
  createUnionMember,
} from '@/shared';
import {
  Directive,
  ParserTree,
  ScalarTypes,
  TypeDefinition,
  TypeDefinitionDisplayStrings,
  TypeSystemDefinition,
  Value,
  Options,
} from '../../Models';
import { Parser } from '../../Parser';

// TODO: Add schema directive test
// TODO: Add directive with arguments test

describe('Directive tests on parser', () => {
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.OBJECT}`, () => {
    const schema = `
    type Person @model
    directive @model on ${Directive.OBJECT}
    `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createRootField({
          name: 'Person',
          type: TypeDefinition.ObjectTypeDefinition,
          directives: [
            createPlainDirectiveImplementation({
              name: 'model',
            }),
          ],
        }),
        createRootDirectiveField({
          name: 'model',
          directiveOptions: [Directive.OBJECT],
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.FIELD_DEFINITION}`, () => {
    const schema = `
    directive @model on ${Directive.FIELD_DEFINITION}
    type Person {
      name: String @model
    }
    `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createRootField({
          name: 'Person',
          type: TypeDefinition.ObjectTypeDefinition,
          args: [
            createPlainField({
              name: 'name',
              type: ScalarTypes.String,
              directives: [
                createPlainDirectiveImplementation({
                  name: 'model',
                }),
              ],
            }),
          ],
        }),
        createRootDirectiveField({
          name: 'model',
          directiveOptions: [Directive.FIELD_DEFINITION],
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.ARGUMENT_DEFINITION}`, () => {
    const schema = `
    directive @model on ${Directive.ARGUMENT_DEFINITION}
    type Person {
      name(override:String @model): String
    }
    `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createRootField({
          name: 'Person',
          type: TypeDefinition.ObjectTypeDefinition,
          args: [
            createPlainField({
              name: 'name',
              args: [
                createPlainInputValue({
                  name: 'override',
                  type: ScalarTypes.String,
                  directives: [
                    createPlainDirectiveImplementation({
                      name: 'model',
                    }),
                  ],
                }),
              ],
              type: ScalarTypes.String,
            }),
          ],
        }),
        createRootDirectiveField({
          name: 'model',
          directiveOptions: [Directive.ARGUMENT_DEFINITION],
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.INTERFACE}`, () => {
    const schema = `
    directive @model on ${Directive.INTERFACE}
    interface Person @model
    `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createRootField({
          name: 'Person',
          type: TypeDefinition.InterfaceTypeDefinition,
          directives: [
            createPlainDirectiveImplementation({
              name: 'model',
            }),
          ],
        }),
        createRootDirectiveField({
          name: 'model',
          directiveOptions: [Directive.INTERFACE],
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.UNION}`, () => {
    const schema = `
    directive @model on ${Directive.UNION}
    type Car
    type Plane
    union Machine @model = Car | Plane
    `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createRootDirectiveField({
          name: 'model',
          directiveOptions: [Directive.UNION],
        }),
        createRootField({
          name: 'Car',
          type: TypeDefinition.ObjectTypeDefinition,
        }),
        createRootField({
          name: 'Plane',
          type: TypeDefinition.ObjectTypeDefinition,
        }),
        createRootField({
          name: 'Machine',
          type: TypeDefinition.UnionTypeDefinition,
          directives: [
            createPlainDirectiveImplementation({
              name: 'model',
            }),
          ],
          args: [
            createUnionMember({
              name: 'Car',
            }),
            createUnionMember({
              name: 'Plane',
            }),
          ],
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.ENUM}`, () => {
    const schema = `
    directive @model on ${Directive.ENUM}
    enum Person @model
    `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'Person',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.enum,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.EnumTypeDefinition,
          },

          directives: [
            createPlainDirectiveImplementation({
              name: 'model',
            }),
          ],
        }),
        createRootDirectiveField({
          name: 'model',
          directiveOptions: [Directive.ENUM],
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.ENUM_VALUE}`, () => {
    const schema = `
    directive @model on ${Directive.ENUM_VALUE}
    enum Person{
      SMART @model
      DUMB
    }
    `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'Person',
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
              name: 'SMART',
              directives: [
                createPlainDirectiveImplementation({
                  name: 'model',
                }),
              ],
            }),
            createPlainEnumValue({
              name: 'DUMB',
            }),
          ],
        }),
        createRootDirectiveField({
          name: 'model',
          directiveOptions: [Directive.ENUM_VALUE],
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.INPUT_OBJECT}`, () => {
    const schema = `
    directive @model on ${Directive.INPUT_OBJECT}
    input Person @model
    `;
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

          directives: [
            createPlainDirectiveImplementation({
              name: 'model',
            }),
          ],
        }),
        createRootDirectiveField({
          name: 'model',
          directiveOptions: [Directive.INPUT_OBJECT],
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.INPUT_FIELD_DEFINITION}`, () => {
    const schema = `
    input Person{
      name: String @model
    }
    directive @model on ${Directive.INPUT_FIELD_DEFINITION}
    `;
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
              name: 'name',
              type: ScalarTypes.String,
              directives: [
                createPlainDirectiveImplementation({
                  name: 'model',
                }),
              ],
            }),
          ],
        }),
        createRootDirectiveField({
          name: 'model',
          directiveOptions: [Directive.INPUT_FIELD_DEFINITION],
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.SCALAR}`, () => {
    const schema = `
    directive @model on ${Directive.SCALAR}
    scalar Person @model
    `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'Person',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.scalar,
              type: Options.name,
            },
          },

          data: {
            type: TypeDefinition.ScalarTypeDefinition,
          },
          directives: [
            createPlainDirectiveImplementation({
              name: 'model',
            }),
          ],
        }),
        createRootDirectiveField({
          name: 'model',
          directiveOptions: [Directive.SCALAR],
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.OBJECT} with input arguments`, () => {
    const schema = `
    directive @model(
      address: Address = {age:2010}
    ) on ${Directive.OBJECT}
    type Person @model(address: {name:"Arturo",weight:22.3})
    input Address{
      name: ${ScalarTypes.String}
      age: ${ScalarTypes.Int}
      weight: ${ScalarTypes.Float}
    }
    `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'Address',
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
          ],
        }),
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

          directives: [
            createPlainDirectiveImplementation({
              name: 'model',
              args: [
                createPlainArgument({
                  name: 'address',
                  value: {
                    type: Value.ObjectValue,
                    value: `{name:"Arturo",weight:22.3}`,
                  },
                }),
              ],
            }),
          ],
        }),
        createRootDirectiveField({
          name: 'model',
          directiveOptions: [Directive.OBJECT],
          args: [
            createPlainInputValue({
              name: 'address',
              type: 'Address',
              value: {
                type: Value.ObjectValue,
                value: `{age:2010}`,
              },
            }),
          ],
        }),
      ],
    };
    const modelNode = tree.nodes.find((n) => n.name === 'model');
    const personNode = tree.nodes.find((n) => n.name === 'Person');
    const addressNode = tree.nodes.find((n) => n.name === 'Address');
    expect(modelNode).toEqual(treeMock.nodes[2]);
    expect(personNode).toEqual(treeMock.nodes[1]);
    expect(addressNode).toEqual(treeMock.nodes[0]);
  });
});
