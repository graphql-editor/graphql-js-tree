import { mutate } from '@/TreeOperations/tree';
import { createInterfaceMock } from '@/__tests__/TreeOperations/mocks';

describe('Tree Operations tests - interface implement decompose', () => {
  test('Implement interface', () => {
    const treeMock = createInterfaceMock();
    mutate(treeMock, treeMock.nodes).implementInterface(treeMock.nodes[2], treeMock.nodes[0]);
    treeMock.nodes[0].args.forEach((a) => {
      expect(treeMock.nodes[2].args).toContainEqual({
        ...a,
        fromInterface: [treeMock.nodes[0].name],
      });
    });
  });
  test('DeImplement interface', () => {
    const treeMock = createInterfaceMock();
    mutate(treeMock, treeMock.nodes).deImplementInterface(treeMock.nodes[1], treeMock.nodes[0].name);
    treeMock.nodes[0].args.forEach((a) => {
      expect(treeMock.nodes[1].args).not.toContainEqual({
        ...a,
        fromInterface: [treeMock.nodes[0].name],
      });
    });
  });
});
