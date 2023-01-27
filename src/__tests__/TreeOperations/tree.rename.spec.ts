import { createParserField, getTypeName } from '@/shared';
import { mutate } from '@/TreeOperations/tree';
import { createMock, createInterfaceMock } from '@/__tests__/TreeOperations/mocks';

describe('Tree Operations tests - rename operations', () => {
  test(`Change node name`, () => {
    const treeMock = createMock();
    const oldPersonNodeId = treeMock.nodes[0].id;

    mutate(treeMock, treeMock.nodes).renameRootNode(treeMock.nodes[0], 'Alien');

    expect(treeMock.nodes[0].id).not.toEqual(oldPersonNodeId);
    expect(treeMock.nodes[0].name).toEqual('Alien');
    expect(getTypeName(treeMock.nodes[1].args[0].type.fieldType)).toEqual('Alien');
  });
  test(`Change interface node name`, () => {
    const treeMock = createInterfaceMock();
    mutate(treeMock, treeMock.nodes).renameRootNode(treeMock.nodes[0], 'Alien');
    expect(treeMock.nodes[1].interfaces).toContainEqual('Alien');
    expect(treeMock.nodes[1].args[0].fromInterface).toContainEqual('Alien');
  });
  test('Update field name on field node', () => {
    const treeMock = createMock();
    const oldPersonNodeId = treeMock.nodes[0].id;
    const oldField = JSON.parse(JSON.stringify(treeMock.nodes[0].args[1]));
    const updatedField = createParserField({
      ...treeMock.nodes[0].args[1],
      name: 'firstName',
    });

    mutate(treeMock, treeMock.nodes).updateFieldOnNode(treeMock.nodes[0], 1, updatedField);

    expect(treeMock.nodes[0].args).not.toContainEqual(oldField);
    expect(treeMock.nodes[0].id).not.toEqual(oldPersonNodeId);
    expect(treeMock.nodes[0].args).toContainEqual(updatedField);
  });
  test('Update field name on field node of interface', () => {
    const treeMock = createInterfaceMock();
    const updatedField = createParserField({
      ...treeMock.nodes[0].args[1],
      name: 'firstName',
    });

    mutate(treeMock, treeMock.nodes).updateFieldOnNode(treeMock.nodes[0], 0, updatedField);
    expect(treeMock.nodes[1].args).toContainEqual({
      ...updatedField,
      fromInterface: [treeMock.nodes[0].name],
    });
  });
  test('Update input value name on input value node', () => {
    const treeMock = createMock();
    const oldQueryId = treeMock.nodes[1].id;
    const oldFieldId = treeMock.nodes[1].args[1].id;
    const oldInputValue = JSON.parse(JSON.stringify(treeMock.nodes[1].args[1].args[0]));
    const updatedInputValue = createParserField({
      ...treeMock.nodes[1].args[1].args[0],
      name: 'userId',
    });
    mutate(treeMock, treeMock.nodes).updateFieldOnNode(treeMock.nodes[1].args[1], 0, updatedInputValue);

    expect(treeMock.nodes[1].args[1].args).not.toContainEqual(oldInputValue);
    expect(treeMock.nodes[1].args[1].args).toContainEqual(updatedInputValue);
    expect(treeMock.nodes[1].args[1].id).not.toEqual(oldFieldId);
    expect(treeMock.nodes[1].id).not.toEqual(oldQueryId);
  });
});
