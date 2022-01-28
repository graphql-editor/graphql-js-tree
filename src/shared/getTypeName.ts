import { FieldType, Options } from '@/Models';

export const getTypeName = (f: FieldType): string => {
  if (f.type === Options.name) {
    return f.name;
  }
  return getTypeName(f.nest);
};

export const compileType = (f: FieldType, fn: (x: string) => string = (x) => x): string => {
  if (f.type === Options.name) {
    return fn(f.name);
  } else if (f.type === Options.array) {
    return compileType(f.nest, (x) => `[${fn(x)}]`);
  } else {
    return compileType(f.nest, (x) => `${fn(x)}!`);
  }
};
