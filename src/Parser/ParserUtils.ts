import { ParserField, TypeDefinition, TypeExtension } from '@/Models';

const extensionMap: Record<TypeExtension, TypeDefinition> = {
  EnumTypeExtension: TypeDefinition.EnumTypeDefinition,
  InputObjectTypeExtension: TypeDefinition.InputObjectTypeDefinition,
  InterfaceTypeExtension: TypeDefinition.InterfaceTypeDefinition,
  ObjectTypeExtension: TypeDefinition.ObjectTypeDefinition,
  ScalarTypeExtension: TypeDefinition.ScalarTypeDefinition,
  UnionTypeExtension: TypeDefinition.UnionTypeDefinition,
};
/**
 * Class used mainly for comparison of ParserFields
 */
export class ParserUtils {
  static isExtensionOf = (extensionNode: ParserField, extendedNode: ParserField): boolean => {
    if (extendedNode.name !== extensionNode.name) {
      return false;
    }
    if (extensionMap[extensionNode.data.type as TypeExtension] !== extendedNode.data.type) {
      return false;
    }
    return true;
  };
}
