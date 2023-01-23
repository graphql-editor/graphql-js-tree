import { createParserField } from '@/shared';
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
    type Person @model
    directive @model on ${Directive.OBJECT}
    `;
    const tree = Parser.parse(schema);
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

          directives: [
            createParserField({
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
            }),
          ],
        }),
        createParserField({
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

              directives: [
                createParserField({
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
                }),
              ],
            }),
          ],
        }),
        createParserField({
          name: 'model',

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

          args: [
            createParserField({
              name: 'name',

              args: [
                createParserField({
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

                  directives: [
                    createParserField({
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
                    }),
                  ],
                }),
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
            }),
          ],
        }),
        createParserField({
          name: 'model',

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
        createParserField({
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

          directives: [
            createParserField({
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
            }),
          ],
        }),
        createParserField({
          name: 'model',

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
        createParserField({
          name: 'model',

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
        }),
        createParserField({
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
        }),
        createParserField({
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
        }),
        createParserField({
          name: 'Machine',

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
            createParserField({
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
            }),
          ],
          args: [
            createParserField({
              name: 'Car',

              type: {
                fieldType: {
                  name: 'Car',
                  type: Options.name,
                },
              },
              data: {
                type: TypeSystemDefinition.UnionMemberDefinition,
              },
            }),
            createParserField({
              name: 'Plane',

              type: {
                fieldType: {
                  name: 'Plane',
                  type: Options.name,
                },
              },
              data: {
                type: TypeSystemDefinition.UnionMemberDefinition,
              },
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
            createParserField({
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
            }),
          ],
        }),
        createParserField({
          name: 'model',

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
            createParserField({
              name: 'SMART',

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
                createParserField({
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
                }),
              ],
            }),
            createParserField({
              name: 'DUMB',

              type: {
                fieldType: {
                  name: ValueDefinition.EnumValueDefinition,
                  type: Options.name,
                },
              },
              data: {
                type: ValueDefinition.EnumValueDefinition,
              },
            }),
          ],
        }),
        createParserField({
          name: 'model',

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
            createParserField({
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
            }),
          ],
        }),
        createParserField({
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
            createParserField({
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

              directives: [
                createParserField({
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
                }),
              ],
            }),
          ],
        }),
        createParserField({
          name: 'model',

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
            createParserField({
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
            }),
          ],
        }),
        createParserField({
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
            createParserField({
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
            }),
            createParserField({
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
            }),
            createParserField({
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
            createParserField({
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

              args: [
                createParserField({
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
                  value: {
                    type: Value.ObjectValue,
                    value: `{name:"Arturo",weight:22.3}`,
                  },
                }),
              ],
            }),
          ],
        }),
        createParserField({
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

          args: [
            createParserField({
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
