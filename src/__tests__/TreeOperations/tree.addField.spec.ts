import { ScalarTypes } from '@/Models';
import { createPlainField, createPlainInputValue } from '@/shared';
import { mutate } from '@/TreeOperations/tree';
import { createMock, createInterfaceMock } from '@/__tests__/TreeOperations/mocks';

describe('Tree Operations tests - adding fields', () => {
  test('Add field to root node', () => {
    const treeMock = createMock();
    const oldPersonNodeId = treeMock.nodes[0].id;
    const lastNameNode = createPlainField({
      type: ScalarTypes.String,
      name: 'lastName',
    });

    mutate(treeMock, treeMock.nodes).addFieldToNode(treeMock.nodes[0], lastNameNode);

    expect(treeMock.nodes[0].id).not.toEqual(oldPersonNodeId);
    expect(treeMock.nodes[0].args).toContainEqual(lastNameNode);
  });
  test('Add field to interface node', () => {
    const treeMock = createInterfaceMock();
    const lastNameNode = createPlainField({
      type: ScalarTypes.String,
      name: 'lastName',
    });

    mutate(treeMock, treeMock.nodes).addFieldToNode(treeMock.nodes[0], lastNameNode);
    expect(treeMock.nodes[1].args).toContainEqual({
      ...lastNameNode,
      fromInterface: ['Node'],
    });
  });
  test('Add field to field node', () => {
    const treeMock = createMock();
    const oldPersonNodeId = treeMock.nodes[0].id;
    const oldFriendsNodeId = treeMock.nodes[0].args[2].id;
    const limitNode = createPlainInputValue({
      type: ScalarTypes.Int,
      name: 'limit',
    });

    mutate(treeMock, treeMock.nodes).addFieldToNode(treeMock.nodes[0].args[2], limitNode);

    expect(treeMock.nodes[0].id).not.toEqual(oldPersonNodeId);
    expect(treeMock.nodes[0].args[2].id).not.toEqual(oldFriendsNodeId);
    expect(treeMock.nodes[0].args[2].args).toContainEqual(limitNode);
  });
});
