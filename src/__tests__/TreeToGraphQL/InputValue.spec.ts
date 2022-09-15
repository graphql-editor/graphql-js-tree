import { createParserField } from '@/shared';
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
            }),
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
            createParserField({
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
            createParserField({
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
            createParserField({
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
            createParserField({
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
            createParserField({
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
            createParserField({
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

              args: [
                createParserField({
                  name: 'abcdef',

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

              args: [
                createParserField({
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
                }),
              ],
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

              args: [
                createParserField({
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
                }),
              ],
            }),
            createParserField({
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

              args: [
                createParserField({
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
                }),
              ],
            }),
          ],
        }),
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`id: ${ScalarTypes.ID} = "abcdef"`);
    expect(graphql).toContain(`name: ${ScalarTypes.String} = "Artur"`);
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

              args: [
                createParserField({
                  name: Value.ListValue,

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
                    createParserField({
                      name: 'A',

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
                    createParserField({
                      name: 'B',

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

                  type: {
                    fieldType: {
                      name: Value.ListValue,
                      type: Options.name,
                    },
                  },
                  data: {
                    type: Value.ListValue,
                  },
                }),
              ],
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
            createParserField({
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
            createParserField({
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
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`car: Car = {`);
    expect(graphql).toContain(`year: 2010`);
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
            createParserField({
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
            }),
            createParserField({
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
            createParserField({
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

              args: [
                createParserField({
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
                }),
              ],
            }),
          ],
        }),
      ],
    };
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`car: Car = HONDA`);
  });
});
