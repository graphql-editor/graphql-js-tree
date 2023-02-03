import { ParserTree, TypeDefinition, ScalarTypes, ValueDefinition, Options, Value, TypeExtension } from '@/Models';
import {
  createRootField,
  createPlainField,
  createPlainInputValue,
  createParserField,
  createRootDirectiveField,
  createPlainDirectiveImplementation,
  createPlainArgument,
  createPlainEnumValue,
  createUnionMember,
  createRootExtensionField,
} from '@/shared';

const mainMock: ParserTree = {
  nodes: [
    createRootField({
      name: 'Person',
      type: TypeDefinition.ObjectTypeDefinition,
      directives: [
        createPlainDirectiveImplementation({
          name: 'model',
          args: [
            createPlainArgument({
              name: 'maxAge',
              value: {
                type: Value.IntValue,
                value: '300',
              },
            }),
          ],
        }),
      ],
      args: [
        createPlainField({
          name: 'id',
          type: ScalarTypes.ID,
        }),
        createPlainField({
          name: 'name',
          type: ScalarTypes.String,
        }),
        createPlainField({
          name: 'friends',
          type: ScalarTypes.String,
        }),
      ],
    }),
    createRootField({
      name: 'Query',
      type: TypeDefinition.ObjectTypeDefinition,
      args: [
        createPlainField({
          name: 'people',
          type: 'Person',
        }),
        createPlainField({
          name: 'personById',
          type: 'Person',
          args: [
            createPlainInputValue({
              type: ScalarTypes.String,
              name: 'id',
            }),
            createPlainInputValue({
              type: ScalarTypes.Int,
              name: 'age',
            }),
            createPlainInputValue({
              type: ScalarTypes.Float,
              name: 'degrees',
            }),
            createPlainInputValue({
              type: ScalarTypes.Boolean,
              name: 'isOk',
            }),
            createPlainInputValue({
              type: 'AnInput',
              name: 'testInput',
            }),
            createParserField({
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              type: {
                fieldType: {
                  type: Options.array,
                  nest: {
                    type: Options.name,
                    name: ScalarTypes.String,
                  },
                },
              },
              name: 'testList',
            }),
            createPlainInputValue({
              type: 'AnEnum',
              name: 'testEnum',
            }),
          ],
        }),
      ],
    }),
    createRootField({
      name: 'AnInput',
      type: TypeDefinition.InputObjectTypeDefinition,
      args: [
        createPlainInputValue({
          name: 'firstName',
          type: ScalarTypes.String,
        }),
      ],
    }),
    createRootField({
      name: 'AnEnum',
      type: TypeDefinition.EnumTypeDefinition,
      args: [
        createPlainEnumValue({
          name: 'HELLO',
        }),
        createPlainEnumValue({
          name: 'WORLD',
        }),
      ],
    }),
    createRootField({
      name: 'AnUnion',
      type: TypeDefinition.UnionTypeDefinition,
      args: [
        createUnionMember({ name: 'Car' }),
        createUnionMember({ name: 'Ship' }),
        createUnionMember({ name: 'Plane' }),
      ],
    }),
    createRootDirectiveField({
      name: 'model',
      args: [createPlainInputValue({ name: 'maxAge', type: ScalarTypes.Int })],
    }),
    createRootExtensionField({
      name: 'Person',
      type: TypeExtension.ObjectTypeExtension,
      args: [
        createPlainField({
          name: 'extendedName',
          type: ScalarTypes.String,
        }),
      ],
    }),
    createRootExtensionField({
      name: 'Person',
      type: TypeExtension.ObjectTypeExtension,
      args: [
        createPlainField({
          name: 'extendedName2',
          type: ScalarTypes.String,
        }),
      ],
    }),
  ],
};

const interfacesMock: ParserTree = {
  nodes: [
    createRootField({
      type: TypeDefinition.InterfaceTypeDefinition,
      name: 'Node',
      args: [
        createPlainField({
          type: ScalarTypes.String,
          name: 'id',
        }),
        createPlainField({
          type: ScalarTypes.String,
          name: 'meta',
        }),
      ],
    }),
    createRootField({
      name: 'AnimalNode',
      interfaces: ['Node'],
      type: TypeDefinition.ObjectTypeDefinition,
      args: [
        createPlainField({
          name: 'id',
          fromInterface: ['Node'],
          type: ScalarTypes.String,
        }),
        createPlainField({
          name: 'name',
          type: ScalarTypes.String,
        }),
        createPlainField({
          fromInterface: ['Node'],
          type: ScalarTypes.String,
          name: 'meta',
        }),
      ],
    }),
    createRootField({
      name: 'ChairNode',
      type: TypeDefinition.ObjectTypeDefinition,
      args: [
        createPlainField({
          name: 'name',
          type: ScalarTypes.String,
        }),
      ],
    }),
  ],
};

export const createMock = () => JSON.parse(JSON.stringify(mainMock)) as typeof mainMock;
export const createInterfaceMock = () => JSON.parse(JSON.stringify(interfacesMock)) as typeof interfacesMock;
