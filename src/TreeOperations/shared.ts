import { AllTypes, FieldType, Options, ParserField, TypeExtension } from '@/Models';
import { generateNodeId, getTypeName } from '@/shared';

export function filterNotNull<T>(t: T | null): t is T {
  return t !== null;
}

export const changeTypeName = (field: FieldType, newName: string) => {
  const changeFieldName = (field: FieldType, newName: string): void => {
    if (field.type === Options.array) {
      return changeFieldName(field.nest, newName);
    } else if (field.type === Options.required) {
      return changeFieldName(field.nest, newName);
    }
    field.name = newName;
  };
  changeFieldName(field, newName);
  return field;
};

export const changeNodeOptions = (field: FieldType, newOption: Options) => {
  const changeOptions = (field: FieldType, newOption: Options) => {
    if (field.type !== Options.array && newOption === Options.array) {
      if (field.type === Options.required) {
      }
      changeOptions(field, Options.array);
    } else if (field.type !== newOption && newOption === Options.required) {
      changeOptions(field, Options.required);
    }
    field.type = Options.name;
  };
  changeOptions(field, newOption);
  return field;
};

export const resolveValueFieldType = (
  name: string,
  fType: FieldType,
  isRequired = false,
  fn: (str: string) => string = (x) => x,
): string => {
  if (fType.type === Options.name) {
    return fn(isRequired ? name : `${name} | undefined | null`);
  }
  if (fType.type === Options.array) {
    return resolveValueFieldType(
      name,
      fType.nest,
      false,
      isRequired ? (x) => `Array<${fn(x)}>` : (x) => `Array<${fn(x)}> | undefined | null`,
    );
  }
  if (fType.type === Options.required) {
    return resolveValueFieldType(name, fType.nest, true, fn);
  }
  throw new Error('Invalid field type');
};

export const isExtensionNode = (t: AllTypes) =>
  !![
    TypeExtension.EnumTypeExtension,
    TypeExtension.InputObjectTypeExtension,
    TypeExtension.InterfaceTypeExtension,
    TypeExtension.ObjectTypeExtension,
    TypeExtension.ScalarTypeExtension,
    TypeExtension.UnionTypeExtension,
  ].find((o) => o === t);

export const regenerateId = (n: ParserField) => {
  const id = generateNodeId(n.name, n.data.type, n.args);
  n.id = id;
  return n;
};

export const ChangeRelatedNode = ({
  newName,
  node,
  oldName,
}: {
  oldName: string;
  newName: string;
  node: ParserField;
}) => {
  const typeName = getTypeName(node.type.fieldType);
  if (typeName === oldName) {
    changeTypeName(node.type.fieldType, newName);
  }
  if (node.args) {
    node.args.forEach((n) => ChangeRelatedNode({ oldName, newName, node: n }));
  }
  regenerateId(node);
};

export const ChangeAllRelatedNodes = ({
  newName,
  nodes,
  oldName,
}: {
  nodes: ParserField[];
  oldName: string;
  newName: string;
}) => {
  nodes.forEach((n) => ChangeRelatedNode({ oldName, newName, node: n }));
};
