import { createParserField, createPlainField, createRootField } from '@/shared';
import { Helpers, ParserTree, ScalarTypes, TypeDefinition, Options } from '../../Models';
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
        createRootField({
          name: 'Person',
          type: TypeDefinition.ObjectTypeDefinition,
          args: [
            createPlainField({
              name: 'name',
              type: ScalarTypes.String,
            }),
          ],
        }),
        createParserField({
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
        }),
      ],
    };
    expect(tree.nodes).toContainEqual(treeMock.nodes[1]);
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
        createRootField({
          name: 'Person',
          type: TypeDefinition.ObjectTypeDefinition,
          description: `# My header`,
          args: [
            createPlainField({
              name: 'name',
              type: ScalarTypes.String,
            }),
          ],
        }),
        createParserField({
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
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
});
