import { FieldType, Options } from '@/Models';

export const getTypeName = (f: FieldType): string => {
  if (f.type === Options.name && f.name) {
    return f.name;
  }
  if (!f.nest) {
    throw new Error('Invalid field type');
  }
  return getTypeName(f.nest);
};
