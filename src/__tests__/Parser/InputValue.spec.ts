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
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`Default ScalarTypes values - ${Object.keys(ScalarTypes).join(', ')}`, () => {
    const schema = `input Person{
        id: ${ScalarTypes.ID} = "abcdef"
        name: ${ScalarTypes.String} = "Artur"
        emptyName: ${ScalarTypes.String} = ""
        emptyArray: [${ScalarTypes.String}] = []
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

              args: [
                createParserField({
                  name: '',

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

              args: [
                createParserField({
                  data: { type: Value.ListValue },

                  name: Value.ListValue,
                  type: { fieldType: { name: Value.ListValue, type: Options.name } },
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
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  test(`Default ScalarTypes values - ${Object.keys(ScalarTypes).join(', ')}`, () => {
    const schema = `input Person{
        names: [${ScalarTypes.String}] = ["Artur","A","B"]
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

              args: [
                createParserField({
                  name: Value.ListValue,
                  type: {
                    fieldType: {
                      name: Value.ListValue,
                      type: Options.name,
                    },
                  },
                  data: {
                    type: Value.ListValue,
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
                }),
              ],
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
        car: Car = {
            year: 2010
        }
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
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
});
