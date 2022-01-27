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
              args: [],
              directives: [],
              interfaces: [],
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
          args: [],
          directives: [],
          interfaces: [],
        },
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.OBJECT}`);
    expect(graphql).toContain(`type Person @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.FIELD_DEFINITION}`, () => {
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
              interfaces: [],
            },
          ],
          directives: [],
        },
        {
          name: 'model',
          type: {
            directiveOptions: [Directive.FIELD_DEFINITION],
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
          },
          args: [],
          directives: [],
          interfaces: [],
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        },
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.FIELD_DEFINITION}`);
    expect(graphql).toContain(`name: String @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.ARGUMENT_DEFINITION}`, () => {
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
                  interfaces: [],
                },
              ],
              interfaces: [],
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
          type: {
            directiveOptions: [Directive.ARGUMENT_DEFINITION],
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
          },
          args: [],
          directives: [],
          interfaces: [],
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        },
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.ARGUMENT_DEFINITION}`);
    expect(graphql).toContain(`override: String @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.INTERFACE}`, () => {
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
              directives: [],
              interfaces: [],
              type: {
                fieldType: {
                  name: 'model',
                  type: Options.name,
                },
              },
              args: [],
            },
          ],
        },
        {
          name: 'model',
          type: {
            directiveOptions: [Directive.INTERFACE],
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
          },
          args: [],
          directives: [],
          interfaces: [],
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        },
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.INTERFACE}`);
    expect(graphql).toContain(`interface Person @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.UNION}`, () => {
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'model',
          type: {
            directiveOptions: [Directive.UNION],
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
          },
          args: [],
          directives: [],
          interfaces: [],
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
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.union,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.UnionTypeDefinition,
          },
          interfaces: [],
          directives: [
            {
              name: 'model',
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
              args: [],
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
              type: {
                fieldType: {
                  name: 'Plane',
                  type: Options.name,
                },
              },
              args: [],
              directives: [],
              interfaces: [],
              data: {
                type: TypeSystemDefinition.UnionMemberDefinition,
              },
            },
          ],
        },
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.UNION}`);
    expect(graphql).toContain(`union Machine @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.ENUM}`, () => {
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
              data: {
                type: Instances.Directive,
              },
              directives: [],
              interfaces: [],
              type: {
                fieldType: {
                  name: 'model',
                  type: Options.name,
                },
              },
              args: [],
            },
          ],
        },
        {
          name: 'model',
          type: {
            directiveOptions: [Directive.ENUM],
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
          },
          args: [],
          directives: [],
          interfaces: [],
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        },
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.ENUM}`);
    expect(graphql).toContain(`enum Person @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.ENUM_VALUE}`, () => {
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
          args: [
            {
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
              args: [],
              interfaces: [],
              directives: [
                {
                  name: 'model',
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
                  args: [],
                },
              ],
            },
            {
              name: 'DUMB',
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
              directives: [],
            },
          ],
          interfaces: [],
          directives: [],
        },
        {
          name: 'model',
          args: [],
          directives: [],
          interfaces: [],
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
        },
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.ENUM_VALUE}`);
    expect(graphql).toContain(`SMART @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.INPUT_OBJECT}`, () => {
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
              directives: [],
              interfaces: [],
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
            },
          ],
        },
        {
          name: 'model',
          args: [],
          directives: [],
          interfaces: [],
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
        },
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.INPUT_OBJECT}`);
    expect(graphql).toContain(`input Person @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.INPUT_FIELD_DEFINITION}`, () => {
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
                  args: [],
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
            directiveOptions: [Directive.INPUT_FIELD_DEFINITION],
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        },
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.INPUT_FIELD_DEFINITION}`);
    expect(graphql).toContain(`name: String @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.SCALAR}`, () => {
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
              args: [],
            },
          ],
        },
        {
          name: 'model',
          args: [],
          directives: [],
          interfaces: [],
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
        },
      ],
    };

    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`directive @model on ${Directive.SCALAR}`);
    expect(graphql).toContain(`scalar Person @model`);
  });
  test(`${TypeSystemDefinition.DirectiveDefinition} - directive keyword on ${Directive.OBJECT} with input arguments`, () => {
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
              interfaces: [],
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
              args: [],
            },
            {
              name: 'age',
              interfaces: [],
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
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              args: [],
            },
          ],
          interfaces: [],
          directives: [],
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
                          data: {
                            type: Instances.Argument,
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
                          directives: [],
                          interfaces: [],
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
            directiveOptions: [Directive.OBJECT],
            fieldType: {
              name: TypeSystemDefinitionDisplayStrings.directive,
              type: Options.name,
            },
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

    const graphql = trimGraphQL(TreeToGraphQL.parse(treeMock));
    expect(graphql).toContain(`@model( address: Address = { age: 2010})`);
    expect(graphql).toContain(`@model( address: { name: \"Artur\",weight: 22.3})`);
  });
});
