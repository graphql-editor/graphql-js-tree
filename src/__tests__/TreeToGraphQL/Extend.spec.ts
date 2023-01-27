import { createParserField, createPlainDirectiveImplementation, createUnionMember } from '@/shared';
import {
  ParserTree,
  ScalarTypes,
  TypeDefinition,
  TypeDefinitionDisplayStrings,
  TypeExtension,
  TypeSystemDefinition,
  Options,
  Directive,
} from '../../Models';
import { TreeToGraphQL } from '../../TreeToGraphQL';

describe('Extend tests on TreeToGraphQL', () => {
  it('Extends type TreeToGraphQL', () => {
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
          description: '',
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
          ],
        }),
        createParserField({
          name: 'Person',
          type: {
            fieldType: {
              name: 'type',
              type: Options.name,
            },
          },
          data: {
            type: TypeExtension.ObjectTypeExtension,
          },
          description: '',
          args: [
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
          ],
        }),
      ],
    };
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`extend type Person`);
  });
  it('Extends union TreeToGraphQL', () => {
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'Kid',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.type,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ObjectTypeDefinition,
          },
          description: '',
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
          ],
        }),
        createParserField({
          name: 'Man',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.type,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ObjectTypeDefinition,
          },
          description: '',
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
          ],
        }),
        createParserField({
          name: 'Woman',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.type,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ObjectTypeDefinition,
          },
          description: '',
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
          ],
        }),
        createParserField({
          name: 'Person',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.union,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.UnionTypeDefinition,
          },
          description: '',
          args: [
            createUnionMember({
              name: 'Kid',
            }),
          ],
        }),
        createParserField({
          name: 'Person',
          type: {
            fieldType: {
              name: 'type',
              type: Options.name,
            },
          },
          data: {
            type: TypeExtension.UnionTypeExtension,
          },
          description: '',
          args: [
            createUnionMember({
              name: 'Man',
            }),
            createUnionMember({
              name: 'Woman',
            }),
          ],
        }),
      ],
    };
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`extend union Person = Man | Woman`);
  });
  it('Extends scalar TreeToGraphQL', () => {
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'URL',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.scalar,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ScalarTypeDefinition,
          },
          description: '',
        }),
        createParserField({
          name: 'forScalar',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.directive,
              type: Options.name,
            },
            directiveOptions: [Directive.SCALAR],
          },
          data: {
            type: TypeSystemDefinition.DirectiveDefinition,
          },
        }),
        createParserField({
          name: 'URL',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.scalar,
              type: Options.name,
            },
          },
          directives: [
            createPlainDirectiveImplementation({
              name: 'forScalar',
            }),
          ],
          data: {
            type: TypeExtension.ScalarTypeExtension,
          },
          description: '',
        }),
      ],
    };
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`extend scalar URL @forScalar`);
  });
});
