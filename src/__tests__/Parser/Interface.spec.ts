import { createParserField } from '@/shared';
import { ParserTree, ScalarTypes, TypeDefinition, TypeSystemDefinition, Options } from '../../Models';
import { Parser } from '../../Parser';

describe('Interfaces works as expected', () => {
  it('Implements HasName Person type', () => {
    const schema = `
          type Person implements HasName { name:String }
          interface HasName{
              name:String
          }
          `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'Person',
          type: {
            fieldType: {
              name: 'type',
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ObjectTypeDefinition,
          },
          interfaces: ['HasName'],

          args: [
            createParserField({
              name: 'name',

              type: {
                fieldType: {
                  name: ScalarTypes.String,
                  type: Options.name,
                },
              },
              fromInterface: ['HasName'],
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            }),
          ],
        }),
        createParserField({
          name: 'HasName',
          type: {
            fieldType: {
              name: 'interface',
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InterfaceTypeDefinition,
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
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
  it('Implements HasName Person interface', () => {
    const schema = `
          interface Person implements HasName { name:String }
          interface HasName{
              name:String
          }
          `;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
          name: 'Person',
          type: {
            fieldType: {
              name: 'interface',
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InterfaceTypeDefinition,
          },
          interfaces: ['HasName'],

          args: [
            createParserField({
              name: 'name',
              type: {
                fieldType: {
                  name: ScalarTypes.String,
                  type: Options.name,
                },
              },
              fromInterface: ['HasName'],
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            }),
          ],
        }),
        createParserField({
          name: 'HasName',
          type: {
            fieldType: {
              name: 'interface',
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InterfaceTypeDefinition,
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
    expect(tree.nodes).toEqual(expect.arrayContaining(treeMock.nodes));
  });
});
