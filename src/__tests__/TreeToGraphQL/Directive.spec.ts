import {
  createParserField,
  createPlainArgument,
  createPlainDirectiveImplementation,
  createPlainEnumValue,
  createPlainInputValue,
  createUnionMember,
} from '@/shared';
import {
  Directive,
  ParserTree,
  ScalarTypes,
  TypeDefinition,
  TypeDefinitionDisplayStrings,
  TypeSystemDefinition,
  TypeSystemDefinitionDisplayStrings,
  Value,
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
            createPlainDirectiveImplementation({
              name: 'model',
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
                createPlainDirectiveImplementation({
                  name: 'model',
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
            createPlainDirectiveImplementation({
              name: 'model',
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
            createPlainDirectiveImplementation({
              name: 'model',
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
            createPlainDirectiveImplementation({
              name: 'model',
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
            createPlainDirectiveImplementation({
              name: 'model',
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
            createPlainDirectiveImplementation({
              name: 'model',
              args: [
                createPlainArgument({
                  name: 'address',
                  value: {
                    type: Value.ObjectValue,
                    value: `{name:"Arturo", weight:22.3}`,
                  },
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

    const graphql = trimGraphQL(TreeToGraphQL.parse(treeMock));
    expect(graphql).toContain(trimGraphQL(`@model( address: Address = {age:2010})`));
    expect(graphql).toContain(trimGraphQL(`@model( address: {name:"Arturo", weight:22.3})`));
  });
});
