import { TreeToGraphQL } from '../../TreeToGraphQL';
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
import { Parser } from '../../Parser';
import { createParserField, createPlainDirectiveImplementation, createUnionMember } from '@/shared';

describe('Extend tests on parser', () => {
  it('Extends Person type', () => {
    const schema = `
        type Person{ name:String }
        extend type Person {
            age: Int
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
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  it('Extends union', () => {
    const schema = `
        type Man{ name:String }
        type Woman{ name:String }
        type Kid{ name:String }
        union Person = Man | Woman
        extend union Person = Kid
        `;
    const tree = Parser.parse(schema);
    const nodeWithName = (name: string) =>
      createParserField({
        name,
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
          }),
        ],
      });
    const treeMock: ParserTree = {
      nodes: [
        nodeWithName('Man'),
        nodeWithName('Woman'),
        nodeWithName('Kid'),
        createParserField({
          name: 'Person',
          type: {
            fieldType: {
              type: Options.name,
              name: TypeDefinitionDisplayStrings.union,
            },
          },
          data: {
            type: TypeDefinition.UnionTypeDefinition,
          },
          args: [
            createUnionMember({
              name: 'Man',
            }),
            createUnionMember({
              name: 'Woman',
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
            type: TypeExtension.UnionTypeExtension,
          },

          args: [
            createUnionMember({
              name: 'Kid',
            }),
          ],
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  it('Extends Person type and correctly join extensions', () => {
    const schema = `
        directive @model on OBJECT
        type Person @model { name:String }
        extend type Person {
            age: Int
        }
    `;
    const extendedSchema = TreeToGraphQL.parse(Parser.parseAddExtensions(schema));
    expect(extendedSchema).toContain('type Person @model');
    expect(extendedSchema).toContain('name: String');
    expect(extendedSchema).toContain('age: Int');
    expect(extendedSchema).not.toContain('extend type Person');
  });
  it('Extends URL scalar', () => {
    const schema = `
        scalar URL
        directive @forScalar on SCALAR
        extend scalar URL @forScalar
        `;
    const tree = Parser.parse(schema);
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
              name: 'scalar',
              type: Options.name,
            },
          },
          data: {
            type: TypeExtension.ScalarTypeExtension,
          },
          directives: [
            createPlainDirectiveImplementation({
              name: 'forScalar',
            }),
          ],
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
});
