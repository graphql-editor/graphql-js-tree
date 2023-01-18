import { createParserField, getTypeName } from '@/shared';
import { mutate } from '@/TreeOperations/tree';
import {
  Options,
  ParserTree,
  ScalarTypes,
  TypeDefinition,
  TypeDefinitionDisplayStrings,
  TypeSystemDefinition,
} from '../../Models';

describe('Tree Operations tests', () => {
  test(`Change node name`, () => {
    const treeMock: ParserTree = {
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
          ],
        }),
      ],
    };
    const oldPersonNodeId = treeMock.nodes[0].id;
    const oldQueryId = treeMock.nodes[1].id;
    const oldQueryFieldId = treeMock.nodes[1].args[0].id;

    mutate(treeMock, treeMock.nodes).renameNode(treeMock.nodes[0], 'Alien');

    expect(treeMock.nodes[0].id).not.toEqual(oldPersonNodeId);
    expect(treeMock.nodes[1].id).not.toEqual(oldQueryId);
    expect(treeMock.nodes[1].args[0].id).not.toEqual(oldQueryFieldId);
    expect(treeMock.nodes[0].name).toEqual('Alien');
    expect(getTypeName(treeMock.nodes[1].args[0].type.fieldType)).toEqual('Alien');
  });
});
