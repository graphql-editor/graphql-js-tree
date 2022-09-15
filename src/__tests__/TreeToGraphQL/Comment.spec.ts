import { createParserField } from '@/shared';
import { Helpers, ParserTree, Options } from '../../Models';
import { TreeToGraphQL } from '../../TreeToGraphQL';

describe('Comment tests on TreeToGraphQL', () => {
  it('Creates comment node and parse it back', () => {
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
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
        }),
      ],
    };
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(`# hello world`);
  });
});
