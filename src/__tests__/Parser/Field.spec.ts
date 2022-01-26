import {
  Options,
  ParserTree,
  ScalarTypes,
  TypeDefinition,
  TypeDefinitionDisplayStrings,
  TypeSystemDefinition,
} from '../../Models';
import { Parser } from '../../Parser';

describe('Fields tests on parser', () => {
  test(`Built in ScalarTypes - ${Object.keys(ScalarTypes).join(', ')}`, () => {
    const schema = `type Person{
        id: ${ScalarTypes.ID}
        name: ${ScalarTypes.String}
        age: ${ScalarTypes.Int}
        weight: ${ScalarTypes.Float}
        verified: ${ScalarTypes.Boolean}
    }`;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
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
              directives: [],
              interfaces: [],
              args: [],
            },
            {
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
              directives: [],
              interfaces: [],
              args: [],
            },
            {
              name: 'age',
              type: {
                fieldType: {
                  name: ScalarTypes.Int,
                  type: Options.name,
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
            },
            {
              name: 'weight',
              type: {
                fieldType: {
                  name: ScalarTypes.Float,
                  type: Options.name,
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
            },
            {
              name: 'verified',
              type: {
                fieldType: {
                  name: ScalarTypes.Boolean,
                  type: Options.name,
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
            },
          ],
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  test('Type objects', () => {
    const schema = `
    type Car
    type Person{
        car: Car
    }`;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Car',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.type,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ObjectTypeDefinition,
          },
          interfaces: [],
          directives: [],
          args: [],
        },
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'car',
              type: {
                fieldType: {
                  name: 'Car',
                  type: Options.name,
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
            },
          ],
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  test('Interface objects', () => {
    const schema = `
    interface Car
    type Person{
        car: Car
    }`;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Car',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.interface,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InterfaceTypeDefinition,
          },
          directives: [],
          interfaces: [],
          args: [],
        },
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'car',
              type: {
                fieldType: {
                  name: 'Car',
                  type: Options.name,
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
            },
          ],
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  test('Enum objects', () => {
    const schema = `
    enum Car
    type Person{
        car: Car
    }`;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Car',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.enum,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.EnumTypeDefinition,
          },
          directives: [],
          interfaces: [],
          args: [],
        },
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'car',
              type: {
                fieldType: {
                  name: 'Car',
                  type: Options.name,
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
            },
          ],
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  test('Custom scalar objects', () => {
    const schema = `
    scalar Car
    type Person{
        car: Car
    }`;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Car',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.scalar,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ScalarTypeDefinition,
          },
          directives: [],
          interfaces: [],
          args: [],
        },
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'car',
              type: {
                fieldType: {
                  name: 'Car',
                  type: Options.name,
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
            },
          ],
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  test('Union objects', () => {
    const schema = `
    type Car
    type Plane
    union Machine = Car | Plane
    type Person{
        machine: Machine
    }`;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Car',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.type,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ObjectTypeDefinition,
          },
          interfaces: [],
          directives: [],
          args: [],
        },
        {
          name: 'Plane',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.type,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.ObjectTypeDefinition,
          },
          interfaces: [],
          directives: [],
          args: [],
        },
        {
          name: 'Machine',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.union,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.UnionTypeDefinition,
          },
          directives: [],
          interfaces: [],
          args: [
            {
              name: 'Car',
              type: {
                fieldType: {
                  name: 'Car',
                  type: Options.name,
                },
              },
              data: {
                type: TypeSystemDefinition.UnionMemberDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
            },
            {
              name: 'Plane',
              type: {
                fieldType: {
                  name: 'Plane',
                  type: Options.name,
                },
              },
              data: {
                type: TypeSystemDefinition.UnionMemberDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
            },
          ],
        },
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'machine',
              type: {
                fieldType: {
                  name: 'Machine',
                  type: Options.name,
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
            },
          ],
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  test(`Required fields`, () => {
    const schema = `type Person{
        id: ${ScalarTypes.ID}!
        name: ${ScalarTypes.String}
    }`;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'id',
              type: {
                fieldType: {
                  type: Options.required,
                  nest: {
                    type: Options.name,
                    name: ScalarTypes.ID,
                  },
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              interfaces: [],
              args: [],
            },
            {
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
              directives: [],
              args: [],
              interfaces: [],
            },
          ],
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  test(`ListType fields`, () => {
    const schema = `type Person{
        id: ${ScalarTypes.ID}!
        name: [${ScalarTypes.String}]
        friends: [Person!]!
    }`;
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        {
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
          interfaces: [],
          directives: [],
          args: [
            {
              name: 'id',
              type: {
                fieldType: {
                  type: Options.required,
                  nest: {
                    name: ScalarTypes.ID,
                    type: Options.name,
                  },
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              args: [],
              interfaces: [],
            },
            {
              name: 'name',
              type: {
                fieldType: {
                  type: Options.array,
                  nest: {
                    name: ScalarTypes.String,
                    type: Options.name,
                  },
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              args: [],
              interfaces: [],
            },
            {
              name: 'friends',
              type: {
                fieldType: {
                  type: Options.required,
                  nest: {
                    type: Options.array,
                    nest: {
                      type: Options.required,
                      nest: {
                        type: Options.name,
                        name: 'Person',
                      },
                    },
                  },
                },
              },
              data: {
                type: TypeSystemDefinition.FieldDefinition,
              },
              directives: [],
              args: [],
              interfaces: [],
            },
          ],
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
});
