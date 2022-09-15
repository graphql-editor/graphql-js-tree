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
import { TreeToGraphQL } from '../../TreeToGraphQL';
import { trimGraphQL } from '../TestUtils';

// TODO: Add schema directive test
// TODO: Add directive with arguments test

describe('Directive tests on TreeToGraphQL', () => {
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.OBJECT}`, () => {
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

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.OBJECT}`);
    expect(graphql).toContain(`type Person @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.FIELD_DEFINITION}`, () => {
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
            directiveOptions: [Directive.FIELD_DEFINITION],
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        }),
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.FIELD_DEFINITION}`);
    expect(graphql).toContain(`name: String @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.ARGUMENT_DEFINITION}`, () => {
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
            directiveOptions: [Directive.ARGUMENT_DEFINITION],
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        }),
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.ARGUMENT_DEFINITION}`);
    expect(graphql).toContain(`override: String @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.INTERFACE}`, () => {
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
            directiveOptions: [Directive.INTERFACE],
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        }),
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.INTERFACE}`);
    expect(graphql).toContain(`interface Person @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.UNION}`, () => {
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'model',
          type: {
            directiveOptions: [Directive.UNION],
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
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

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.UNION}`);
    expect(graphql).toContain(`union Machine @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.ENUM}`, () => {
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
            directiveOptions: [Directive.ENUM],
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        }),
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.ENUM}`);
    expect(graphql).toContain(`enum Person @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.ENUM_VALUE}`, () => {
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
            directiveOptions: [Directive.ENUM_VALUE],
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        }),
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.ENUM_VALUE}`);
    expect(graphql).toContain(`SMART @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.INPUT_OBJECT}`, () => {
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
            directiveOptions: [Directive.INPUT_OBJECT],
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        }),
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.INPUT_OBJECT}`);
    expect(graphql).toContain(`input Person @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.INPUT_FIELD_DEFINITION}`, () => {
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
            directiveOptions: [Directive.INPUT_FIELD_DEFINITION],
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        }),
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.INPUT_FIELD_DEFINITION}`);
    expect(graphql).toContain(`name: String @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.SCALAR}`, () => {
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
            directiveOptions: [Directive.SCALAR],
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        }),
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.SCALAR}`);
    expect(graphql).toContain(`scalar Person @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.OBJECT} with input arguments`, () => {
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
                type: TypeSystemDefinition.FieldDefinition,
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
                type: TypeSystemDefinition.FieldDefinition,
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
                type: TypeSystemDefinition.FieldDefinition,
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
                  args: [
                    createParserField({
                      name: Value.ObjectValue,
                      args: [
                        createParserField({
                          name: 'name',
                          type: {
                            fieldType: {
                              name: 'name',
                              type: Options.name,
                            },
                          },
                          data: {
                            type: Instances.Argument,
                          },
                          args: [
                            createParserField({
                              name: 'Artur',
                              type: {
                                fieldType: {
                                  name: Value.StringValue,
                                  type: Options.name,
                                },
                              },
                              data: {
                                type: Value.StringValue,
                              },
                            }),
                          ],
                        }),
                        createParserField({
                          name: 'weight',
                          type: {
                            fieldType: {
                              name: 'weight',
                              type: Options.name,
                            },
                          },
                          data: {
                            type: Instances.Argument,
                          },
                          args: [
                            createParserField({
                              name: '22.3',
                              type: {
                                fieldType: {
                                  name: Value.FloatValue,
                                  type: Options.name,
                                },
                              },
                              data: {
                                type: Value.FloatValue,
                              },
                            }),
                          ],
                        }),
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
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        createParserField({
          name: 'model',
          type: {
            directiveOptions: [Directive.OBJECT],
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
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
              args: [
                createParserField({
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
                  args: [
                    createParserField({
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
                      args: [
                        createParserField({
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
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    };

    const graphql = trimGraphQL(TreeToGraphQL.parse(treeMock));
    expect(graphql).toContain(`@model( address: Address = { age: 2010})`);
    expect(graphql).toContain(`@model( address: { name: \"Artur\",weight: 22.3})`);
  });
});
