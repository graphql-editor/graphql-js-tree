import { TypeDefinitionDisplayStrings, TypeSystemDefinitionDisplayStrings } from './DisplayMap';
import {
  Helpers,
  Instances,
  ScalarTypes,
  Type,
  TypeDefinition,
  TypeExtension,
  TypeSystemDefinition,
  TypeSystemExtension,
  Value,
  ValueDefinition,
} from './Spec';

export enum BuiltInDirectives {
  skip = 'skip',
  include = 'include',
  deprecated = 'deprecated',
}
export type AllTypes =
  | ScalarTypes
  | Value
  | ValueDefinition
  | TypeDefinition
  | TypeDefinitionDisplayStrings
  | TypeSystemDefinition
  | TypeSystemDefinitionDisplayStrings
  | TypeExtension
  | TypeSystemExtension
  | Instances
  | Helpers
  | Type;

export const kindAsAllTypes = (v: string) => v as AllTypes;
export const kindAsValue = (v: string) => v as Value;
export interface GraphQLNodeParams {
  type: AllTypes;
}
