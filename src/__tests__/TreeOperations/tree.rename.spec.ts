import { Options, ParserField, ScalarTypes, Value } from '@/Models';
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
  test(`Change directive node name`, () => {
    const treeMock = createMock();
    const oldDirectiveNodeId = treeMock.nodes[5].id;
    mutate(treeMock, treeMock.nodes).renameRootNode(treeMock.nodes[5], 'alien');
    expect(treeMock.nodes[5].id).not.toEqual(oldDirectiveNodeId);
    expect(treeMock.nodes[5].name).toEqual('alien');
    expect(getTypeName(treeMock.nodes[0].directives[0].type.fieldType)).toEqual('alien');
    expect(treeMock.nodes[0].directives[0].name).toEqual('alien');
  });
  test('Update field name on field node', () => {
    const treeMock = createMock();
    const oldField = JSON.parse(JSON.stringify(treeMock.nodes[0].args[1]));
    const updatedField = createParserField({
      ...treeMock.nodes[0].args[1],
      name: 'firstName',
    });

    mutate(treeMock, treeMock.nodes).updateFieldOnNode(treeMock.nodes[0], 1, updatedField);

    expect(treeMock.nodes[0].args).not.toContainEqual(oldField);
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
  test('Update field name on directive definition', () => {
    const treeMock = createMock();
    const updatedField = createParserField({
      ...treeMock.nodes[5].args[0],
      name: 'firstName',
      type: {
        fieldType: {
          type: Options.name,
          name: ScalarTypes.String,
        },
      },
    });
    const argumentCopy = JSON.parse(JSON.stringify(treeMock.nodes[0].directives[0].args[0])) as ParserField;

    mutate(treeMock, treeMock.nodes).updateFieldOnNode(treeMock.nodes[5], 0, updatedField);
    expect(treeMock.nodes[5].args).toContainEqual({
      ...updatedField,
    });
    expect(treeMock.nodes[0].directives[0].args).toContainEqual({
      ...argumentCopy,
      name: 'firstName',
      value: {
        type: Value.StringValue,
        value: argumentCopy.value?.value,
      },
      type: {
        fieldType: {
          name: 'firstName',
          type: Options.name,
        },
      },
    });
  });
  test('Update input value name on input value node', () => {
    const treeMock = createMock();
    const oldInputValue = JSON.parse(JSON.stringify(treeMock.nodes[1].args[1].args[0]));
    const updatedInputValue = createParserField({
      ...treeMock.nodes[1].args[1].args[0],
      name: 'userId',
    });
    mutate(treeMock, treeMock.nodes).updateFieldOnNode(treeMock.nodes[1].args[1], 0, updatedInputValue);

    expect(treeMock.nodes[1].args[1].args).not.toContainEqual(oldInputValue);
    expect(treeMock.nodes[1].args[1].args).toContainEqual(updatedInputValue);
  });
});
