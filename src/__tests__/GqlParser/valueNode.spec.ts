import { getValueAsGqlStringNode } from '@/GqlParser/valueNode';
import { expectTrimmedEqual } from '@/__tests__/TestUtils';
import { Kind } from 'graphql';

describe('Test generation of value strings from the GqlParserTree', () => {
  it('Generates Correct Variable Value', () => {
    const strValue = getValueAsGqlStringNode({ kind: Kind.VARIABLE, value: 'Hello' });
    expect(strValue).toEqual(`$Hello`);
  });
  it('Generates Correct String Value', () => {
    const strValue = getValueAsGqlStringNode({ kind: Kind.STRING, value: 'Hello' });
    expect(strValue).toEqual(`"Hello"`);
  });
  it('Generates Correct Int Value', () => {
    const strValue = getValueAsGqlStringNode({ kind: Kind.INT, value: '100' });
    expect(strValue).toEqual(`100`);
  });
  it('Generates Correct Float Value', () => {
    const strValue = getValueAsGqlStringNode({ kind: Kind.FLOAT, value: '100.0' });
    expect(strValue).toEqual(`100.0`);
  });
  it('Generates Correct Boolean Value', () => {
    const strValue = getValueAsGqlStringNode({ kind: Kind.BOOLEAN, value: false });
    expect(strValue).toEqual(`false`);
  });
  it('Generates Correct Enum Value', () => {
    const strValue = getValueAsGqlStringNode({ kind: Kind.ENUM, value: 'HELLO' });
    expect(strValue).toEqual(`HELLO`);
  });
  it('Generates Correct Null Value', () => {
    const strValue = getValueAsGqlStringNode({ kind: Kind.NULL, value: null });
    expect(strValue).toEqual(`null`);
  });
  it('Generates Correct List Value', () => {
    const strValue = getValueAsGqlStringNode({
      kind: Kind.LIST,
      values: [
        { kind: Kind.STRING, value: 'Hello' },
        { kind: Kind.STRING, value: 'World' },
      ],
    });
    expectTrimmedEqual(strValue, `["Hello", "World"]`);
  });
  it('Generates Correct Object Value', () => {
    const strValue = getValueAsGqlStringNode({
      kind: Kind.OBJECT,
      fields: [
        { kind: Kind.OBJECT_FIELD, name: 'word', value: { kind: Kind.STRING, value: 'Hello' } },
        { kind: Kind.OBJECT_FIELD, name: 'word2', value: { kind: Kind.STRING, value: 'Hello' } },
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
