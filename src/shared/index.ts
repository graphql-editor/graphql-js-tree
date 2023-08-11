import {
  AllTypes,
  Directive,
  FieldType,
  Instances,
  OperationType,
  Options,
  ParserField,
  ScalarTypes,
  TypeDefinition,
  TypeDefinitionDisplayMap,
  TypeExtension,
  TypeSystemDefinition,
  TypeSystemExtension,
  ValueDefinition,
} from '@/Models';
import { isExtensionNode } from '@/TreeOperations/shared';

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
  const s = [name, dataType, isExtensionNode(dataType) ? args.map((a) => a.id).join('-') : ''].join('-');
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
type RootNodeCreation = Pick<ParserField, 'name'> &
  Partial<Omit<ParserField, 'data' | 'name' | 'type'>> & { type: TypeDefinition };
type ExtensionRootNodeCreation = Pick<ParserField, 'name'> &
  Partial<Omit<ParserField, 'data' | 'name' | 'type'>> & { type: TypeExtension };
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

export const createRootField = ({ name, type, ...props }: RootNodeCreation) => {
  return createParserField({
    ...props,
    name,
    data: {
      type,
    },
    type: {
      fieldType: {
        name: TypeDefinitionDisplayMap[type],
        type: Options.name,
      },
    },
  });
};
export const createRootExtensionField = ({ name, type, ...props }: ExtensionRootNodeCreation) => {
  return createParserField({
    ...props,
    name,
    data: {
      type,
    },
    type: {
      fieldType: {
        name: TypeDefinitionDisplayMap[type],
        type: Options.name,
      },
    },
  });
};
type DirectiveRootNodeCreation = Pick<ParserField, 'name'> &
  Partial<Omit<ParserField, 'data' | 'name' | 'type'>> & { directiveOptions?: Directive[] };

export const createRootDirectiveField = ({
  name,
  directiveOptions = [Directive.OBJECT],
  ...props
}: DirectiveRootNodeCreation) => {
  return createParserField({
    ...props,
    name,
    data: {
      type: TypeSystemDefinition.DirectiveDefinition,
    },
    type: {
      fieldType: {
        name: TypeDefinitionDisplayMap[TypeSystemDefinition.DirectiveDefinition],
        type: Options.name,
      },
      directiveOptions,
    },
  });
};

type FieldCreation = Pick<ParserField, 'name'> &
  Partial<Omit<ParserField, 'data' | 'name' | 'type'>> & { type: string };

export const createPlainField = ({ name, type, ...props }: FieldCreation) => {
  return createParserField({
    ...props,
    name,
    data: {
      type: TypeSystemDefinition.FieldDefinition,
    },
    type: {
      fieldType: {
        name: type,
        type: Options.name,
      },
    },
  });
};
export const createTypeNameField = () => {
  return createParserField({
    name: '__typename',
    description: 'The name of the current Object type at runtime.',
    data: {
      type: TypeSystemDefinition.FieldDefinition,
    },
    type: {
      fieldType: {
        type: Options.required,
        nest: {
          type: Options.name,
          name: ScalarTypes.String,
        },
      },
    },
  });
};

type InputValueCreation = Pick<ParserField, 'name'> &
  Partial<Omit<ParserField, 'data' | 'name' | 'type'>> & { type: string };

export const createPlainInputValue = ({ name, type, ...props }: InputValueCreation) => {
  return createParserField({
    ...props,
    name,
    data: {
      type: ValueDefinition.InputValueDefinition,
    },
    type: {
      fieldType: {
        name: type,
        type: Options.name,
      },
    },
  });
};
type EnumValueCreation = Pick<ParserField, 'name'> & Partial<Omit<ParserField, 'data' | 'name' | 'type'>>;

export const createPlainEnumValue = ({ name, ...props }: EnumValueCreation) => {
  return createParserField({
    ...props,
    name,
    data: {
      type: ValueDefinition.EnumValueDefinition,
    },
    type: {
      fieldType: {
        name: ValueDefinition.EnumValueDefinition,
        type: Options.name,
      },
    },
  });
};
type UnionMemberCreation = Pick<ParserField, 'name'> & Partial<Omit<ParserField, 'data' | 'name' | 'type'>>;

export const createUnionMember = ({ name, ...props }: UnionMemberCreation) => {
  return createParserField({
    ...props,
    name,
    data: {
      type: TypeSystemDefinition.UnionMemberDefinition,
    },
    type: {
      fieldType: {
        name,
        type: Options.name,
      },
    },
  });
};

type DirectiveInstanceCreation = Pick<ParserField, 'name'> & Partial<Omit<ParserField, 'data' | 'name' | 'type'>>;

export const createPlainDirectiveImplementation = ({ name, ...props }: DirectiveInstanceCreation) => {
  return createParserField({
    ...props,
    name,
    data: {
      type: Instances.Directive,
    },
    type: {
      fieldType: {
        name,
        type: Options.name,
      },
    },
  });
};
type ArgumentCreation = Pick<ParserField, 'name'> & Partial<Omit<ParserField, 'data' | 'name' | 'type'>>;

export const createPlainArgument = ({ name, ...props }: ArgumentCreation) => {
  return createParserField({
    ...props,
    name,
    data: {
      type: Instances.Argument,
    },
    type: {
      fieldType: {
        name,
        type: Options.name,
      },
    },
  });
};

export const compareParserFields = (f1: ParserField) => (f2: ParserField) => f1.id === f2.id;

type SchemaCreationProps = {
  operations?: {
    [OperationType.query]?: string;
    [OperationType.mutation]?: string;
    [OperationType.subscription]?: string;
  };
  directives?: ParserField[];
};

export const createSchemaDefinition = (options: SchemaCreationProps) => {
  return createParserField({
    name: 'schema',
    data: {
      type: TypeSystemDefinition.SchemaDefinition,
    },
    type: {
      fieldType: {
        type: Options.name,
        name: 'schema',
      },
    },
    directives: options?.directives || [],
    args: options?.operations
      ? Object.entries(options?.operations).map(([k, v]) =>
          createParserField({
            name: k,
            data: {
              type: TypeSystemDefinition.FieldDefinition,
            },
            type: {
              fieldType: {
                type: Options.name,
                name: v,
              },
            },
          }),
        )
      : [],
  });
};

export const createSchemaExtension = (options: SchemaCreationProps) => {
  return createParserField({
    name: 'schema',
    data: {
      type: TypeSystemExtension.SchemaExtension,
    },
    directives: options?.directives || [],
    type: {
      fieldType: {
        type: Options.name,
        name: 'schema',
      },
    },
    args: options?.operations
      ? Object.entries(options?.operations).map(([k, v]) =>
          createParserField({
            name: k,
            data: {
              type: TypeSystemDefinition.FieldDefinition,
            },
            type: {
              fieldType: {
                type: Options.name,
                name: v,
              },
            },
          }),
        )
      : [],
  });
};
