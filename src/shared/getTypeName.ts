import { FieldType, Options } from '@/Models';

export const getTypeName = (f: FieldType): string => {
  if (f.type === Options.name) {
    return f.name;
  }
  return getTypeName(f.nest);
};

export const compileType = (f: FieldType, fn: (x: string) => string = (x) => x, required = false): string => {
  if (f.type === Options.array) {
    return compileType(f.nest, (x) => (required ? `[${fn(x)}]!` : `[${fn(x)}]`));
  }
  if (f.type === Options.required) {
    return compileType(f.nest, fn, true);
  }
  return required ? fn(`${f.name}!`) : fn(f.name);
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
