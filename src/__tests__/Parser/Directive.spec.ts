import {
  Directive,
  Instances,
  ParserTree,
  ScalarTypes,
  TypeDefinition,
  TypeDefinitionDisplayStrings,
  TypeSystemDefinition,
  TypeSystemDefinitionDisplayStrings,
  Value,
  ValueDefinition,
  Options,
} from '../../Models';
import { Parser } from '../../Parser';

// TODO: Add schema directive test
// TODO: Add directive with arguments test

describe('Directive tests on parser', () => {
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.OBJECT}`, () => {
    const schema = `
    directive @model on ${Directive.OBJECT}
    type Person @model
    `;
    const tree = Parser.parse(schema);
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
          directives: [
            {
              name: 'model',
              args: [],
              directives: [],
              interfaces: [],
              data: {
                type: Instances.Directive,
              },
              type: {
                fieldType: {
                  name: 'model',
                  type: Options.name,
                },
              },
            },
          ],
          args: [],
        },
        {
          name: 'model',
          args: [],
          directives: [],
          interfaces: [],
          type: {
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
            directiveOptions: [Directive.OBJECT],
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
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
          args: [
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
              args: [],
              interfaces: [],
              directives: [
                {
                  name: 'model',
                  data: {
                    type: Instances.Directive,
                  },
                  type: {
                    fieldType: {
                      name: 'model',
                      type: Options.name,
                    },
                  },
                  args: [],
                  directives: [],
                  interfaces: [],
                },
              ],
            },
          ],
          directives: [],
        },
        {
          name: 'model',
          args: [],
          directives: [],
          interfaces: [],
          type: {
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
            directiveOptions: [Directive.FIELD_DEFINITION],
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
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
          args: [
            {
              name: 'name',
              interfaces: [],
              args: [
                {
                  name: 'override',
                  type: {
                    fieldType: {
                      name: ScalarTypes.String,
                      type: Options.name,
                    },
                  },
                  data: {
                    type: ValueDefinition.InputValueDefinition,
                  },
                  args: [],
                  interfaces: [],
                  directives: [
                    {
                      name: 'model',
                      data: {
                        type: Instances.Directive,
                      },
                      type: {
                        fieldType: {
                          name: 'model',
                          type: Options.name,
                        },
                      },
                      args: [],
                      directives: [],
                      interfaces: [],
                    },
                  ],
                },
              ],
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
            },
          ],
          directives: [],
        },
        {
          name: 'model',
          args: [],
          directives: [],
          interfaces: [],
          type: {
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
            directiveOptions: [Directive.ARGUMENT_DEFINITION],
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.INTERFACE}`, () => {
    const schema = `
    directive @model on ${Directive.INTERFACE}
    interface Person @model
    `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Person',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.interface,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InterfaceTypeDefinition,
          },
          interfaces: [],
          args: [],
          directives: [
            {
              name: 'model',
              data: {
                type: Instances.Directive,
              },
              type: {
                fieldType: {
                  name: 'model',
                  type: Options.name,
                },
              },
              args: [],
              directives: [],
              interfaces: [],
            },
          ],
        },
        {
          name: 'model',
          args: [],
          directives: [],
          interfaces: [],
          type: {
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
            directiveOptions: [Directive.INTERFACE],
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
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
        {
          name: 'model',
          args: [],
          directives: [],
          interfaces: [],
          type: {
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
            directiveOptions: [Directive.UNION],
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        },
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
          directives: [
            {
              name: 'model',
              data: {
                type: Instances.Directive,
              },
              type: {
                fieldType: {
                  name: 'model',
                  type: Options.name,
                },
              },
              args: [],
              directives: [],
              interfaces: [],
            },
          ],
          args: [
            {
              name: 'Car',
              args: [],
              directives: [],
              interfaces: [],
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
              args: [],
              directives: [],
              interfaces: [],
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
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.ENUM}`, () => {
    const schema = `
    directive @model on ${Directive.ENUM}
    enum Person @model
    `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        {
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
          args: [],
          interfaces: [],
          directives: [
            {
              name: 'model',
              args: [],
              directives: [],
              interfaces: [],
              data: {
                type: Instances.Directive,
              },
              type: {
                fieldType: {
                  name: 'model',
                  type: Options.name,
                },
              },
            },
          ],
        },
        {
          name: 'model',
          args: [],
          directives: [],
          interfaces: [],
          type: {
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
            directiveOptions: [Directive.ENUM],
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
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
        {
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
          directives: [],
          interfaces: [],
          args: [
            {
              name: 'SMART',
              args: [],
              interfaces: [],
              type: {
                fieldType: {
                  name: ValueDefinition.EnumValueDefinition,
                  type: Options.name,
                },
              },
              data: {
                type: ValueDefinition.EnumValueDefinition,
              },
              directives: [
                {
                  name: 'model',
                  data: {
                    type: Instances.Directive,
                  },
                  type: {
                    fieldType: {
                      name: 'model',
                      type: Options.name,
                    },
                  },
                  args: [],
                  directives: [],
                  interfaces: [],
                },
              ],
            },
            {
              name: 'DUMB',
              args: [],
              directives: [],
              interfaces: [],
              type: {
                fieldType: {
                  name: ValueDefinition.EnumValueDefinition,
                  type: Options.name,
                },
              },
              data: {
                type: ValueDefinition.EnumValueDefinition,
              },
            },
          ],
        },
        {
          name: 'model',
          args: [],
          directives: [],
          interfaces: [],
          type: {
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
            directiveOptions: [Directive.ENUM_VALUE],
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.INPUT_OBJECT}`, () => {
    const schema = `
    directive @model on ${Directive.INPUT_OBJECT}
    input Person @model
    `;
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
          args: [],
          interfaces: [],
          directives: [
            {
              name: 'model',
              data: {
                type: Instances.Directive,
              },
              type: {
                fieldType: {
                  name: 'model',
                  type: Options.name,
                },
              },
              args: [],
              directives: [],
              interfaces: [],
            },
          ],
        },
        {
          name: 'model',
          type: {
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
            directiveOptions: [Directive.INPUT_OBJECT],
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
          args: [],
          directives: [],
          interfaces: [],
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.INPUT_FIELD_DEFINITION}`, () => {
    const schema = `
    directive @model on ${Directive.INPUT_FIELD_DEFINITION}
    input Person{
      name: String
    }
    `;
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
              args: [],
              interfaces: [],
              directives: [
                {
                  name: 'model',
                  data: {
                    type: Instances.Directive,
                  },
                  type: {
                    fieldType: {
                      name: 'model',
                      type: Options.name,
                    },
                  },
                  args: [],
                  directives: [],
                  interfaces: [],
                },
              ],
            },
          ],
        },
        {
          name: 'model',
          args: [],
          directives: [],
          interfaces: [],
          type: {
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
            directiveOptions: [Directive.INPUT_FIELD_DEFINITION],
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.SCALAR}`, () => {
    const schema = `
    directive @model on ${Directive.SCALAR}
    scalar Person @model
    `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Person',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.scalar,
              type: Options.name,
            },
          },
          args: [],
          interfaces: [],
          data: {
            type: TypeDefinition.ScalarTypeDefinition,
          },
          directives: [
            {
              name: 'model',
              data: {
                type: Instances.Directive,
              },
              type: {
                fieldType: {
                  name: 'model',
                  type: Options.name,
                },
              },
              args: [],
              directives: [],
              interfaces: [],
            },
          ],
        },
        {
          name: 'model',
          type: {
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
            directiveOptions: [Directive.SCALAR],
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
          args: [],
          directives: [],
          interfaces: [],
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.OBJECT} with input arguments`, () => {
    const schema = `
    directive @model(
      address: Address = { age: 2010 }
    ) on ${Directive.OBJECT}
    type Person @model(address:{
      name: "Artur",
      weight: 22.3
    })
    input Address{
      name: ${ScalarTypes.String}
      age: ${ScalarTypes.Int}
      weight: ${ScalarTypes.Float}
    }
    `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        {
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
              args: [],
              directives: [],
              interfaces: [],
            },
          ],
          directives: [],
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
          directives: [
            {
              name: 'model',
              data: {
                type: Instances.Directive,
              },
              type: {
                fieldType: {
                  name: 'model',
                  type: Options.name,
                },
              },
              directives: [],
              interfaces: [],
              args: [
                {
                  name: 'address',
                  type: {
                    fieldType: {
                      name: 'address',
                      type: Options.name,
                    },
                  },
                  data: {
                    type: Instances.Argument,
                  },
                  directives: [],
                  interfaces: [],
                  args: [
                    {
                      name: Value.ObjectValue,
                      directives: [],
                      interfaces: [],
                      args: [
                        {
                          name: 'name',
                          type: {
                            fieldType: {
                              name: 'name',
                              type: Options.name,
                            },
                          },
                          directives: [],
                          interfaces: [],
                          data: {
                            type: Instances.Argument,
                          },
                          args: [
                            {
                              name: 'Artur',
                              directives: [],
                              interfaces: [],
                              args: [],
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
                          name: 'weight',
                          type: {
                            fieldType: {
                              name: 'weight',
                              type: Options.name,
                            },
                          },
                          directives: [],
                          interfaces: [],
                          data: {
                            type: Instances.Argument,
                          },
                          args: [
                            {
                              name: '22.3',
                              type: {
                                fieldType: {
                                  name: Value.FloatValue,
                                  type: Options.name,
                                },
                              },
                              directives: [],
                              interfaces: [],
                              args: [],
                              data: {
                                type: Value.FloatValue,
                              },
                            },
                          ],
                        },
                      ],
                      data: {
                        type: Value.ObjectValue,
                      },
                      type: {
                        fieldType: {
                          name: Value.ObjectValue,
                          type: Options.name,
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
          args: [],
        },
        {
          name: 'model',
          type: {
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
            directiveOptions: [Directive.OBJECT],
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
          directives: [],
          interfaces: [],
          args: [
            {
              name: 'address',
              type: {
                fieldType: {
                  name: 'Address',
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
                  type: {
                    fieldType: {
                      name: Value.ObjectValue,
                      type: Options.name,
                    },
                  },
                  data: {
                    type: Value.ObjectValue,
                  },
                  directives: [],
                  interfaces: [],
                  args: [
                    {
                      name: 'age',
                      type: {
                        fieldType: {
                          name: 'age',
                          type: Options.name,
                        },
                      },
                      data: {
                        type: Instances.Argument,
                      },
                      directives: [],
                      interfaces: [],
                      args: [
                        {
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
                          args: [],
                          directives: [],
                          interfaces: [],
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
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
});
