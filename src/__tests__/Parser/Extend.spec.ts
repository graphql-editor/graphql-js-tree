import { TreeToGraphQL } from '../../TreeToGraphQL';
import {
  ParserTree,
  ScalarTypes,
  TypeDefinition,
  TypeDefinitionDisplayStrings,
  TypeExtension,
  TypeSystemDefinition,
  Options,
} from '../../Models';
import { Parser } from '../../Parser';

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
          directives: [],
          args: [
            {
              name: 'name',
              args: [],
              interfaces: [],
              type: {
                fieldType: {
                  name: ScalarTypes.String,
                  type: Options.name,
                },
              },
              directives: [],
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            },
          ],
        },
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'age',
              args: [],
              interfaces: [],
              type: {
                fieldType: {
                  name: ScalarTypes.Int,
                  type: Options.name,
                },
              },
              directives: [],
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            },
          ],
        },
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
});
