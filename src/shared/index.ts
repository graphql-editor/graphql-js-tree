import { AllTypes, FieldType, Options, ParserField } from '@/Models';

export const getTypeName = (f: FieldType): string => {
  if (f.type === Options.name) {
    return f.name;
  }
  return getTypeName(f.nest);
};

export const compileType = (f: FieldType): string => {
  if (f.type === Options.array) {
    return `[${compileType(f.nest)}]`;
  }
  if (f.type === Options.required) {
    return `${compileType(f.nest)}!`;
  }
  return f.name;
};

export const decompileType = (typeName: string): FieldType => {
  const arrayType = typeName.endsWith(']');
  const requiredType = typeName.endsWith('!');
  if (arrayType) {
    return {
      type: Options.array,
      nest: decompileType(typeName.substring(1, typeName.length - 1)),
    };
  }
  if (requiredType) {
    return {
      type: Options.required,
      nest: decompileType(typeName.substring(0, typeName.length - 1)),
    };
  }
  return {
    type: Options.name,
    name: typeName,
  };
};

export const generateNodeId = (name: string, dataType: AllTypes, args: ParserField[]) => {
  const s = [name, dataType, args.map((a) => a.id).join('-')].join('-');
  return cyrb53(s);
};
const cyrb53 = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
};

type NodeCreation = Pick<ParserField, 'data' | 'name' | 'type'> & Partial<Omit<ParserField, 'data' | 'name' | 'type'>>;

// Use this function always when you create a parser field to get the right id generated
export const createParserField = (props: NodeCreation): ParserField => {
  return {
    args: [],
    directives: [],
    interfaces: [],
    id: generateNodeId(props.name, props.data.type, props.args || []),
    ...props,
  };
};

export const compareParserFields = (f1: ParserField) => (f2: ParserField) => f1.id === f2.id;
