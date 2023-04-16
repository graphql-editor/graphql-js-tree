import { ValueNodeWithoutLoc } from '@/Models/GqlParserTree';
import { ValueNode } from 'graphql';

export const getValueAsGqlStringNode = (v: ValueNodeWithoutLoc): string => {
  if (v.kind === 'ListValue') {
    return `[${v.values.map((vv) => getValueAsGqlStringNode(vv)).join(', ')}]`;
  }
  if (v.kind === 'ObjectValue') {
    return `{\n ${v.fields.map((f) => `${f.name}: ${getValueAsGqlStringNode(f.value)}`).join(', \n')} \n}`;
  }
  if (v.kind === 'Variable') {
    return '$' + v.value;
  }
  if (v.kind === 'NullValue') {
    return `null`;
  }
  if (v.kind === 'StringValue') {
    return `"${v.value}"`;
  }
  if (v.kind === 'FloatValue') {
    return v.value;
  }
  if (v.kind === 'IntValue') {
    return v.value;
  }
  if (v.kind === 'BooleanValue') {
    if (v.value) return 'true';
    return 'false';
  }
  return v.value;
};

export const getValueWithoutLoc = (v: ValueNode): ValueNodeWithoutLoc => {
  if (v.kind === 'ListValue') {
    return {
      kind: v.kind,
      values: v.values.map((vv) => getValueWithoutLoc(vv)),
    };
  }
  if (v.kind === 'ObjectValue') {
    return {
      kind: v.kind,
      fields: v.fields.map((f) => ({
        kind: 'ObjectField',
        name: f.name.value,
        value: getValueWithoutLoc(f.value),
      })),
    };
  }
  if (v.kind === 'Variable') {
    return {
      kind: v.kind,
      value: v.name.value,
    };
  }
  if (v.kind === 'NullValue') {
    return {
      kind: v.kind,
      value: null,
    };
  }
  if (v.kind === 'BooleanValue') {
    return {
      kind: v.kind,
      value: v.value,
    };
  }
  return {
    kind: v.kind,
    value: v.value,
  };
};
