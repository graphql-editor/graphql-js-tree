import {
  AllTypes,
  FieldType,
  Options,
  ParserField,
  ParserTree,
  ScalarTypes,
  TypeDefinition,
  TypeExtension,
} from '@/Models';
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
export const RemoveRelatedExtensionNodes = ({ node, tree }: { tree: ParserTree; node: ParserField }) => {
  const {
    data: { type },
  } = node;
  if (
    type === TypeDefinition.EnumTypeDefinition ||
    type === TypeDefinition.InputObjectTypeDefinition ||
    type === TypeDefinition.InterfaceTypeDefinition ||
    type === TypeDefinition.ObjectTypeDefinition ||
    type === TypeDefinition.ScalarTypeDefinition ||
    type === TypeDefinition.UnionTypeDefinition
  ) {
    [...tree.nodes].forEach((n) => {
      if (n.name === node.name) {
        const nodeToBeRemoved = tree.nodes.findIndex((fn) => fn.id === n.id);
        tree.nodes.splice(nodeToBeRemoved, 1);
      }
    });
  }
};

export const isScalarArgument = (field: ParserField, scalarTypes: string[]) => {
  const typeName = getTypeName(field.type.fieldType);
  if (typeName === ScalarTypes.Boolean) {
    return true;
  }
  if (typeName === ScalarTypes.Float) {
    return true;
  }
  if (typeName === ScalarTypes.ID) {
    return true;
  }
  if (typeName === ScalarTypes.Int) {
    return true;
  }
  if (typeName === ScalarTypes.String) {
    return true;
  }
  return scalarTypes.includes(typeName);
};

export const isArrayType = (f: FieldType) =>
  f.type === Options.required ? f.nest.type === Options.array : f.type === Options.array;
