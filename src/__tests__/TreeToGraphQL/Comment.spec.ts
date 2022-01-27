import { Helpers, ParserTree, Options } from '../../Models';
import { TreeToGraphQL } from '../../TreeToGraphQL';

describe('Comment tests on TreeToGraphQL', () => {
  it('Creates comment node and parse it back', () => {
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'comment',
          type: {
            fieldType: {
              name: 'comment',
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
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`# hello world`);
  });
});
