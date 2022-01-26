import {
  Helpers,
  ParserTree,
  ScalarTypes,
  TypeDefinition,
  TypeDefinitionDisplayStrings,
  TypeSystemDefinition,
  Options,
} from '../../Models';
import { Parser } from '../../Parser';

describe('Comment tests on parser', () => {
  it('Creates comment node from graphql', () => {
    const schema = `
          type Person{
              name:String
          }
          # hello world
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
              type: {
                fieldType: {
                  name: ScalarTypes.String,
                  type: Options.name,
                },
              },
              directives: [],
              interfaces: [],
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            },
          ],
        },
        {
          name: Helpers.Comment,
          type: {
            fieldType: {
              name: Helpers.Comment,
              type: Options.name,
            },
          },
          data: {
            type: Helpers.Comment,
          },
          description: 'hello world',
          directives: [],
          interfaces: [],
          args: [],
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  it('Doesnt create a comment node from markdown in description', () => {
    const schema = `
"""
# My header
"""
type Person{
    name:String
}
# hello world
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
          description: `# My header`,
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'name',
              args: [],
              type: {
                fieldType: {
                  name: ScalarTypes.String,
                  type: Options.name,
                },
              },
              directives: [],
              interfaces: [],
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            },
          ],
        },
        {
          name: Helpers.Comment,
          type: {
            fieldType: {
              name: Helpers.Comment,
              type: Options.name,
            },
          },
          data: {
            type: Helpers.Comment,
          },
          description: 'hello world',
          directives: [],
          interfaces: [],
          args: [],
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
});
