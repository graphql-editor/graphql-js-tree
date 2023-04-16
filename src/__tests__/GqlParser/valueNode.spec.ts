import { getValueAsGqlStringNode } from '@/GqlParser/valueNode';
import { expectTrimmedEqual } from '@/__tests__/TestUtils';

describe('Test generation of value strings from the GqlParserTree', () => {
  it('Generates Correct Variable Value', () => {
    const strValue = getValueAsGqlStringNode({ kind: 'Variable', value: 'Hello' });
    expect(strValue).toEqual(`$Hello`);
  });
  it('Generates Correct String Value', () => {
    const strValue = getValueAsGqlStringNode({ kind: 'StringValue', value: 'Hello' });
    expect(strValue).toEqual(`"Hello"`);
  });
  it('Generates Correct Int Value', () => {
    const strValue = getValueAsGqlStringNode({ kind: 'IntValue', value: '100' });
    expect(strValue).toEqual(`100`);
  });
  it('Generates Correct Float Value', () => {
    const strValue = getValueAsGqlStringNode({ kind: 'FloatValue', value: '100.0' });
    expect(strValue).toEqual(`100.0`);
  });
  it('Generates Correct Boolean Value', () => {
    const strValue = getValueAsGqlStringNode({ kind: 'BooleanValue', value: false });
    expect(strValue).toEqual(`false`);
  });
  it('Generates Correct Enum Value', () => {
    const strValue = getValueAsGqlStringNode({ kind: 'EnumValue', value: 'HELLO' });
    expect(strValue).toEqual(`HELLO`);
  });
  it('Generates Correct Null Value', () => {
    const strValue = getValueAsGqlStringNode({ kind: 'NullValue', value: null });
    expect(strValue).toEqual(`null`);
  });
  it('Generates Correct List Value', () => {
    const strValue = getValueAsGqlStringNode({
      kind: 'ListValue',
      values: [
        { kind: 'StringValue', value: 'Hello' },
        { kind: 'StringValue', value: 'World' },
      ],
    });
    expectTrimmedEqual(strValue, `["Hello", "World"]`);
  });
  it('Generates Correct Object Value', () => {
    const strValue = getValueAsGqlStringNode({
      kind: 'ObjectValue',
      fields: [
        { kind: 'ObjectField', name: 'word', value: { kind: 'StringValue', value: 'Hello' } },
        { kind: 'ObjectField', name: 'word2', value: { kind: 'StringValue', value: 'Hello' } },
      ],
    });
    expectTrimmedEqual(
      strValue,
      `{
        word: "Hello",
        word2: "Hello"
    }`,
    );
  });
});
