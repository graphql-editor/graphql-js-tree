import { ParserField, Options } from '@/Models';
import { MergeError } from '@/TreeOperations/merge/common';

export const mergeArguments = (parentName: string, args1: ParserField[], args2: ParserField[]) => {
  args2
    .filter((a) => a.type.fieldType.type === Options.required)
    .forEach((a2) => {
      if (!args1.find((a1) => a1.name === a2.name))
        throw new MergeError({
          conflictingNode: parentName,
          conflictingField: a2.name,
          message: 'Cannot merge when required argument does not exist in correlated node',
        });
    });
  return args1
    .map((a1) => {
      const equivalentA2 = args2.find((a2) => a2.name === a1.name);
      if (!equivalentA2 && a1.type.fieldType.type === Options.required)
        throw new MergeError({
          conflictingNode: parentName,
          conflictingField: a1.name,
          message: 'Cannot merge when required argument does not exist in correlated node',
        });
      if (!equivalentA2) return;
      if (a1.type.fieldType.type === Options.required) return a1;
      if (equivalentA2.type.fieldType.type === Options.required) return equivalentA2;
    })
    .filter(<T>(v: T | undefined): v is T => !!v);
};
