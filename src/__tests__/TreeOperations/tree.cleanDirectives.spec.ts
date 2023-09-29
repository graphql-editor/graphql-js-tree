import { mutate } from '@/TreeOperations/tree';
import { createMock } from '@/__tests__/TreeOperations/mocks';

describe('Tree Operations - directive cleaning tests', () => {
  test('Delete directive node from tree using cleanall', () => {
    const treeMock = createMock();
    const directiveNode = JSON.parse(JSON.stringify(treeMock.nodes[5]));
    mutate(treeMock, treeMock.nodes).removeAllDirectives();
    expect(treeMock.nodes).not.toContainEqual(directiveNode);
    expect(treeMock.nodes[0].directives).toHaveLength(0);
  });
});
