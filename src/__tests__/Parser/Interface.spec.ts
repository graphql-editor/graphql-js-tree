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
        {
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
          directives: [],
          args: [
            {
              name: 'name',
              args: [],
              type: {
                fieldType: {
                  name: ScalarTypes.String,
                  type: Options.name,
                },
              },
              directives: [],
              interfaces: [],
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            },
          ],
        },
        {
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
          directives: [],
          interfaces: [],
          args: [
            {
              name: 'name',
              args: [],
              interfaces: [],
              type: {
                fieldType: {
                  name: ScalarTypes.String,
                  type: Options.name,
                },
              },
              directives: [],
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            },
          ],
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
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
        {
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
          directives: [],
          args: [
            {
              name: 'name',
              args: [],
              interfaces: [],
              type: {
                fieldType: {
                  name: ScalarTypes.String,
                  type: Options.name,
                },
              },
              directives: [],
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            },
          ],
        },
        {
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
          directives: [],
          interfaces: [],
          args: [
            {
              name: 'name',
              args: [],
              interfaces: [],
              type: {
                fieldType: {
                  name: ScalarTypes.String,
                  type: Options.name,
                },
              },
              directives: [],
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
            },
          ],
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
});
