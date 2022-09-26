import { Parser } from '../../Parser';

describe('Empty schema tests on parser', () => {
  it('Creates empty tree from schema', () => {
    const schema = `          `;
    const tree = Parser.parse(schema);
    expect(tree.nodes.length).toEqual(0);
  });
  it('Creates empty tree from schema', () => {
    const schema = `  \t\t      \n\n\n  `;
    const tree = Parser.parse(schema);
    expect(tree.nodes.length).toEqual(0);
  });
});
