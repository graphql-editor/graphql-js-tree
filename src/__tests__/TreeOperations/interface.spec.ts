import {
  ParserTree,
  TypeDefinitionDisplayStrings,
  Options,
  TypeDefinition,
  ScalarTypes,
  TypeSystemDefinition,
} from '@/Models';
import { createParserField, createPlainInputValue } from '@/shared';
import { _updateNodeByInterfaceAddField } from '@/TreeOperations/interface';

const mainMock: ParserTree = {
  nodes: [
    createParserField({
      name: 'Person',
      type: {
        fieldType: {
          name: TypeDefinitionDisplayStrings.type,
          type: Options.name,
        },
      },
      data: {
        type: TypeDefinition.ObjectTypeDefinition,
      },
      args: [
        createParserField({
          name: 'id',
          type: {
            fieldType: {
              name: ScalarTypes.ID,
              type: Options.name,
            },
          },
          data: {
            type: TypeSystemDefinition.FieldDefinition,
          },
        }),
        createParserField({
          name: 'name',
          type: {
            fieldType: {
              name: ScalarTypes.String,
              type: Options.name,
            },
          },
          data: {
            type: TypeSystemDefinition.FieldDefinition,
          },
        }),
        createParserField({
          name: 'friends',
          type: {
            fieldType: {
              name: ScalarTypes.String,
              type: Options.name,
            },
          },
          data: {
            type: TypeSystemDefinition.FieldDefinition,
          },
        }),
      ],
    }),
    createParserField({
      name: 'Query',
      type: {
        fieldType: {
          name: TypeDefinitionDisplayStrings.type,
          type: Options.name,
        },
      },
      data: {
        type: TypeDefinition.ObjectTypeDefinition,
      },
      args: [
        createParserField({
          data: {
            type: TypeSystemDefinition.FieldDefinition,
          },
          name: 'people',
          type: {
            fieldType: {
              name: 'Person',
              type: Options.name,
            },
          },
        }),
        createParserField({
          data: {
            type: TypeSystemDefinition.FieldDefinition,
          },
          name: 'personById',
          type: {
            fieldType: {
              name: 'Person',
              type: Options.name,
            },
          },
          args: [
            createPlainInputValue({
              type: ScalarTypes.String,
              name: 'id',
            }),
          ],
        }),
      ],
    }),
    createParserField({
      data: {
        type: TypeDefinition.InterfaceTypeDefinition,
      },
      type: {
        fieldType: {
          type: Options.name,
          name: TypeDefinitionDisplayStrings.interface,
        },
      },
      name: 'Node',
      args: [
        createParserField({
          data: {
            type: TypeSystemDefinition.FieldDefinition,
          },
          type: {
            fieldType: {
              type: Options.name,
              name: ScalarTypes.String,
            },
          },
          name: 'id',
        }),
      ],
    }),
    createParserField({
      name: 'AnimalWithoutInterfaces',
      type: {
        fieldType: {
          name: TypeDefinitionDisplayStrings.type,
          type: Options.name,
        },
      },
      data: {
        type: TypeDefinition.ObjectTypeDefinition,
      },
      args: [
        createParserField({
          name: 'name',
          type: {
            fieldType: {
              name: ScalarTypes.String,
              type: Options.name,
            },
          },
          data: {
            type: TypeSystemDefinition.FieldDefinition,
          },
        }),
      ],
    }),
  ],
};

const createMock = () => JSON.parse(JSON.stringify(mainMock)) as typeof mainMock;

describe('Tree Operations with interface nodes', () => {
  test('Internal _updateNodeByInterfaceAddField', () => {
    const treeMock = createMock();
    _updateNodeByInterfaceAddField(treeMock.nodes[2])(treeMock.nodes[3]);
    expect(treeMock.nodes[3].args[1].fromInterface).toContainEqual('Node');
    expect(treeMock.nodes[3].args[1]).toEqual({ ...treeMock.nodes[2].args[0], fromInterface: ['Node'] });
  });
});
