import { Value } from '@/Models';
import { createParserField } from '@/shared';
import { mutate } from '@/TreeOperations/tree';
import { createMock } from '@/__tests__/TreeOperations/mocks';

describe('Tree Operations tests - Setting default value', () => {
  test('Set input value default value - StringValue', () => {
    const treeMock = createMock();
    const updatedInputValue = createParserField({
      ...treeMock.nodes[1].args[1].args[0],
      value: {
        type: Value.StringValue,
        value: 'Hello',
      },
    });
    mutate(treeMock, treeMock.nodes).setValueNode(treeMock.nodes[1].args[1].args[0], 'Hello');
    expect(treeMock.nodes[1].args[1].args).toContainEqual(updatedInputValue);
  });
  test('Set input value default value - IntValue', () => {
    const treeMock = createMock();
    const updatedInputValue = createParserField({
      ...treeMock.nodes[1].args[1].args[1],
      value: {
        type: Value.IntValue,
        value: '18',
      },
    });
    mutate(treeMock, treeMock.nodes).setValueNode(treeMock.nodes[1].args[1].args[1], '18');
    expect(treeMock.nodes[1].args[1].args).toContainEqual(updatedInputValue);
  });
  test('Set input value default value - FloatValue', () => {
    const treeMock = createMock();
    const updatedInputValue = createParserField({
      ...treeMock.nodes[1].args[1].args[2],
      value: {
        type: Value.FloatValue,
        value: '36.7',
      },
    });
    mutate(treeMock, treeMock.nodes).setValueNode(treeMock.nodes[1].args[1].args[2], '36.7');
    expect(treeMock.nodes[1].args[1].args).toContainEqual(updatedInputValue);
  });
  test('Set input value default value - BooleanValue', () => {
    const treeMock = createMock();
    const updatedInputValue = createParserField({
      ...treeMock.nodes[1].args[1].args[3],
      value: {
        type: Value.BooleanValue,
        value: 'true',
      },
    });
    mutate(treeMock, treeMock.nodes).setValueNode(treeMock.nodes[1].args[1].args[3], 'true');
    expect(treeMock.nodes[1].args[1].args).toContainEqual(updatedInputValue);
  });
  test('Set input value default value - ObjectValue', () => {
    const treeMock = createMock();
    const updatedInputValue = createParserField({
      ...treeMock.nodes[1].args[1].args[4],
      value: {
        type: Value.ObjectValue,
        value: `{ firstName:"Hello" }`,
      },
    });
    mutate(treeMock, treeMock.nodes).setValueNode(treeMock.nodes[1].args[1].args[4], `{ firstName:"Hello" }`);
    expect(treeMock.nodes[1].args[1].args).toContainEqual(updatedInputValue);
  });
  test('Set input value default value - ListValue', () => {
    const treeMock = createMock();
    const updatedInputValue = createParserField({
      ...treeMock.nodes[1].args[1].args[5],
      value: {
        type: Value.ListValue,
        value: `["Hello"]`,
      },
    });
    mutate(treeMock, treeMock.nodes).setValueNode(treeMock.nodes[1].args[1].args[5], `["Hello"]`);
    expect(treeMock.nodes[1].args[1].args).toContainEqual(updatedInputValue);
  });
  test('Set input value default value - EnumValue', () => {
    const treeMock = createMock();
    const updatedInputValue = createParserField({
      ...treeMock.nodes[1].args[1].args[6],
      value: {
        type: Value.EnumValue,
        value: `HELLO`,
      },
    });
    mutate(treeMock, treeMock.nodes).setValueNode(treeMock.nodes[1].args[1].args[6], `HELLO`);
    expect(treeMock.nodes[1].args[1].args).toContainEqual(updatedInputValue);
  });
});
