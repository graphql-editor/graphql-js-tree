import { createPlainDirectiveImplementation, createRootField } from '@/shared';
import { ParserTree, TypeDefinition } from '../../Models';
import { Parser } from '../../Parser';

// TODO: Add schema directive test
// TODO: Add directive with arguments test

describe('Exotic Directive tests on parser', () => {
  test(`Test non existing directives`, () => {
    const schema = `
    type Person @model
    `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createRootField({
          name: 'Person',
          type: TypeDefinition.ObjectTypeDefinition,
          directives: [
            createPlainDirectiveImplementation({
              name: 'model',
            }),
          ],
        }),
      ],
    };
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
});
