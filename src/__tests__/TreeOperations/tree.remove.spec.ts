import { mutate } from '@/TreeOperations/tree';
import { createMock, createInterfaceMock } from '@/__tests__/TreeOperations/mocks';

describe('Tree Operations - node removal tests', () => {
  test('Delete node from tree', () => {
    const treeMock = createMock();
    const nodeCopy = JSON.parse(JSON.stringify(treeMock.nodes[0]));

    mutate(treeMock, treeMock.nodes).removeNode(treeMock.nodes[0]);

    expect(treeMock.nodes).not.toContainEqual(nodeCopy);
  });
  test('Delete interface node from tree', () => {
    const treeMock = createInterfaceMock();
    const copyOfArg = JSON.parse(JSON.stringify(treeMock.nodes[1].args[0]));
    mutate(treeMock, treeMock.nodes).removeNode(treeMock.nodes[0]);
    expect(treeMock.nodes[0].interfaces).not.toContainEqual('Node');
    expect(treeMock.nodes[0].args).not.toContainEqual(copyOfArg);
  });
  test('Delete directive node from tree', () => {
    const treeMock = createMock();
    const directiveNode = JSON.parse(JSON.stringify(treeMock.nodes[5]));
    mutate(treeMock, treeMock.nodes).removeNode(treeMock.nodes[5]);
    expect(treeMock.nodes).not.toContainEqual(directiveNode);
    expect(treeMock.nodes[0].directives).toHaveLength(0);
  });
  test('Delete field from root node', () => {
    const treeMock = createMock();
    const oldField = JSON.parse(JSON.stringify(treeMock.nodes[0].args[0]));

    mutate(treeMock, treeMock.nodes).removeNode(treeMock.nodes[0].args[0]);

    expect(treeMock.nodes[0].args).not.toContainEqual(oldField);
  });
  test('Delete field from interface node', () => {
    const treeMock = createInterfaceMock();
    // const oldInterfaceNode = JSON.parse(JSON.stringify(treeMock.nodes[0]));
    const oldField = JSON.parse(JSON.stringify(treeMock.nodes[1].args[0]));

    mutate(treeMock, treeMock.nodes).removeNode(treeMock.nodes[0].args[0]);
    expect(treeMock.nodes[1].args).not.toContainEqual(oldField);
  });
  test('Delete input value from field node', () => {
    const treeMock = createMock();
    const oldInputValue = JSON.parse(JSON.stringify(treeMock.nodes[1].args[1].args[0]));
    mutate(treeMock, treeMock.nodes).removeNode(treeMock.nodes[1].args[1].args[0]);

    expect(treeMock.nodes[1].args[1].args).not.toContainEqual(oldInputValue);
  });
  test('Delete directive from node', () => {
    const treeMock = createMock();
    expect(() => mutate(treeMock, treeMock.nodes).removeNode(treeMock.nodes[0].directives[0])).toThrowError();
  });
  test('Delete argument node from Directive Instance', () => {
    const treeMock = createMock();
    expect(() => mutate(treeMock, treeMock.nodes).removeNode(treeMock.nodes[0].directives[0].args[0])).toThrowError();
  });
  test('Delete union member from union node', () => {
    const treeMock = createMock();
    const oldArgument = JSON.parse(JSON.stringify(treeMock.nodes[4].args[0]));
    mutate(treeMock, treeMock.nodes).removeNode(treeMock.nodes[4].args[0]);
    expect(treeMock.nodes[3].args).not.toContainEqual(oldArgument);
  });
  test('Delete enum value from enum node', () => {
    const treeMock = createMock();
    const oldArgument = JSON.parse(JSON.stringify(treeMock.nodes[3].args[0]));
    mutate(treeMock, treeMock.nodes).removeNode(treeMock.nodes[3].args[0]);
    expect(treeMock.nodes[3].args).not.toContainEqual(oldArgument);
  });
  test('Delete directive field from directive definition node', () => {
    const treeMock = createMock();
    const oldArgument = JSON.parse(JSON.stringify(treeMock.nodes[5].args[0]));
    mutate(treeMock, treeMock.nodes).removeNode(treeMock.nodes[5].args[0]);
    expect(treeMock.nodes[5].args).not.toContainEqual(oldArgument);
    expect(treeMock.nodes[0].directives[0].args).toHaveLength(0);
  });
  test('Delete node extensions when node is removed', () => {
    const treeMock = createMock();
    const oldExtendNode = JSON.parse(JSON.stringify(treeMock.nodes[6]));
    const oldExtendNode2 = JSON.parse(JSON.stringify(treeMock.nodes[7]));
    mutate(treeMock, treeMock.nodes).removeNode(treeMock.nodes[0]);
    expect(treeMock.nodes).not.toContainEqual(oldExtendNode);
    expect(treeMock.nodes).not.toContainEqual(oldExtendNode2);
  });
});
