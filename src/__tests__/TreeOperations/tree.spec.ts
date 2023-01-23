import { createParserField, getTypeName } from '@/shared';
import { mutate } from '@/TreeOperations/tree';
import {
  Options,
  ParserTree,
  ScalarTypes,
  TypeDefinition,
  TypeDefinitionDisplayStrings,
  TypeSystemDefinition,
  Value,
  ValueDefinition,
} from '../../Models';
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
            createParserField({
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              type: {
                fieldType: {
                  type: Options.name,
                  name: ScalarTypes.String,
                },
              },
              name: 'id',
            }),
            createParserField({
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              type: {
                fieldType: {
                  type: Options.name,
                  name: ScalarTypes.Int,
                },
              },
              name: 'age',
            }),
            createParserField({
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              type: {
                fieldType: {
                  type: Options.name,
                  name: ScalarTypes.Float,
                },
              },
              name: 'degrees',
            }),
            createParserField({
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              type: {
                fieldType: {
                  type: Options.name,
                  name: ScalarTypes.Boolean,
                },
              },
              name: 'isOk',
            }),
            createParserField({
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              type: {
                fieldType: {
                  type: Options.name,
                  name: 'AnInput',
                },
              },
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
            createParserField({
              data: {
                type: ValueDefinition.InputValueDefinition,
              },
              type: {
                fieldType: {
                  type: Options.name,
                  name: 'AnEnum',
                },
              },
              name: 'testEnum',
            }),
          ],
        }),
      ],
    }),
    createParserField({
      name: 'AnInput',
      data: {
        type: TypeDefinition.InputObjectTypeDefinition,
      },
      type: {
        fieldType: {
          type: Options.name,
          name: TypeDefinitionDisplayStrings.input,
        },
      },
      args: [
        createParserField({
          data: {
            type: ValueDefinition.InputValueDefinition,
          },
          name: 'firstName',
          type: {
            fieldType: {
              type: Options.name,
              name: ScalarTypes.String,
            },
          },
        }),
      ],
    }),
    createParserField({
      name: 'AnEnum',
      data: {
        type: TypeDefinition.EnumTypeDefinition,
      },
      type: {
        fieldType: {
          type: Options.name,
          name: TypeDefinitionDisplayStrings.enum,
        },
      },
      args: [
        createParserField({
          name: 'HELLO',
          data: {
            type: ValueDefinition.EnumValueDefinition,
          },
          type: {
            fieldType: {
              type: Options.name,
              name: ValueDefinition.EnumValueDefinition,
            },
          },
        }),
        createParserField({
          name: 'WORLD',
          data: {
            type: ValueDefinition.EnumValueDefinition,
          },
          type: {
            fieldType: {
              type: Options.name,
              name: ValueDefinition.EnumValueDefinition,
            },
          },
        }),
      ],
    }),
  ],
};

const createMock = () => JSON.parse(JSON.stringify(mainMock)) as typeof mainMock;
const createInterfaceMock = () => JSON.parse(JSON.stringify(interfacesMock)) as typeof interfacesMock;
describe('Tree Operations tests', () => {
  test(`Change node name`, () => {
    const treeMock = createMock();
    const oldPersonNodeId = treeMock.nodes[0].id;

    mutate(treeMock, treeMock.nodes).renameNode(treeMock.nodes[0], 'Alien');

    expect(treeMock.nodes[0].id).not.toEqual(oldPersonNodeId);
    expect(treeMock.nodes[0].name).toEqual('Alien');
    expect(getTypeName(treeMock.nodes[1].args[0].type.fieldType)).toEqual('Alien');
  });
  test(`Change interface node name`, () => {
    const treeMock = createInterfaceMock();
    mutate(treeMock, treeMock.nodes).renameNode(treeMock.nodes[0], 'Alien');
    expect(treeMock.nodes[1].interfaces).toContainEqual('Alien');
    expect(treeMock.nodes[1].args[0].fromInterface).toContainEqual('Alien');
  });
  test('Delete node from tree', () => {
    const treeMock = createMock();
    const oldQueryId = treeMock.nodes[1].id;
    const nodeCopy = JSON.parse(JSON.stringify(treeMock.nodes[0]));

    mutate(treeMock, treeMock.nodes).removeNode(treeMock.nodes[0]);

    expect(treeMock.nodes).not.toContainEqual(nodeCopy);
    expect(treeMock.nodes[0].id).not.toEqual(oldQueryId);
  });
  test('Delete interface node from tree', () => {
    const treeMock = createInterfaceMock();
    const copyOfArg = JSON.parse(JSON.stringify(treeMock.nodes[1].args[0]));
    mutate(treeMock, treeMock.nodes).removeNode(treeMock.nodes[0]);
    expect(treeMock.nodes[0].interfaces).not.toContainEqual('Node');
    expect(treeMock.nodes[0].args).not.toContainEqual(copyOfArg);
  });
  test('Add field to root node', () => {
    const treeMock = createMock();
    const oldPersonNodeId = treeMock.nodes[0].id;
    const lastNameNode = createParserField({
      data: {
        type: TypeSystemDefinition.FieldDefinition,
      },
      type: {
        fieldType: {
          type: Options.name,
          name: ScalarTypes.String,
        },
      },
      name: 'lastName',
    });

    mutate(treeMock, treeMock.nodes).addFieldToNode(treeMock.nodes[0], lastNameNode);

    expect(treeMock.nodes[0].id).not.toEqual(oldPersonNodeId);
    expect(treeMock.nodes[0].args).toContainEqual(lastNameNode);
  });
  test('Add field to interface node', () => {
    const treeMock = createInterfaceMock();
    const lastNameNode = createParserField({
      data: {
        type: TypeSystemDefinition.FieldDefinition,
      },
      type: {
        fieldType: {
          type: Options.name,
          name: ScalarTypes.String,
        },
      },
      name: 'lastName',
    });

    mutate(treeMock, treeMock.nodes).addFieldToNode(treeMock.nodes[0], lastNameNode);
    expect(treeMock.nodes[1].args).toContainEqual({
      ...lastNameNode,
      fromInterface: ['Node'],
    });
  });
  test('Add field to field node', () => {
    const treeMock = createMock();
    const oldPersonNodeId = treeMock.nodes[0].id;
    const oldFriendsNodeId = treeMock.nodes[0].args[2].id;
    const limitNode = createParserField({
      data: {
        type: ValueDefinition.InputValueDefinition,
      },
      type: {
        fieldType: {
          type: Options.name,
          name: ScalarTypes.Int,
        },
      },
      name: 'limit',
    });

    mutate(treeMock, treeMock.nodes).addFieldToNode(treeMock.nodes[0].args[2], limitNode);

    expect(treeMock.nodes[0].id).not.toEqual(oldPersonNodeId);
    expect(treeMock.nodes[0].args[2].id).not.toEqual(oldFriendsNodeId);
    expect(treeMock.nodes[0].args[2].args).toContainEqual(limitNode);
  });
  test('Delete field from root node', () => {
    const treeMock = createMock();
    const oldPersonNodeId = treeMock.nodes[0].id;
    const oldField = JSON.parse(JSON.stringify(treeMock.nodes[0].args[0]));

    mutate(treeMock, treeMock.nodes).deleteFieldFromNode(treeMock.nodes[0], 0);

    expect(treeMock.nodes[0].args).not.toContainEqual(oldField);
    expect(treeMock.nodes[0].id).not.toEqual(oldPersonNodeId);
  });
  test('Delete field from interface node', () => {
    const treeMock = createInterfaceMock();
    // const oldInterfaceNode = JSON.parse(JSON.stringify(treeMock.nodes[0]));
    const oldField = JSON.parse(JSON.stringify(treeMock.nodes[1].args[0]));

    mutate(treeMock, treeMock.nodes).deleteFieldFromNode(treeMock.nodes[0], 0);
    expect(treeMock.nodes[1].args).not.toContainEqual(oldField);
  });
  test('Delete input value from field node', () => {
    const treeMock = createMock();
    const oldFieldId = treeMock.nodes[1].args[1].id;
    const oldQueryId = treeMock.nodes[1].id;
    const oldInputValue = JSON.parse(JSON.stringify(treeMock.nodes[1].args[1].args[0]));
    mutate(treeMock, treeMock.nodes).deleteFieldFromNode(treeMock.nodes[1].args[1], 0);

    expect(treeMock.nodes[1].args[1].args).not.toContainEqual(oldInputValue);
    expect(treeMock.nodes[1].args[1].id).not.toEqual(oldFieldId);
    expect(treeMock.nodes[1].id).not.toEqual(oldQueryId);
  });
  test('Update field name on field node', () => {
    const treeMock = createMock();
    const oldPersonNodeId = treeMock.nodes[0].id;
    const oldField = JSON.parse(JSON.stringify(treeMock.nodes[0].args[1]));
    const updatedField = createParserField({
      ...treeMock.nodes[0].args[1],
      name: 'firstName',
    });

    mutate(treeMock, treeMock.nodes).updateFieldOnNode(treeMock.nodes[0], 1, updatedField);

    expect(treeMock.nodes[0].args).not.toContainEqual(oldField);
    expect(treeMock.nodes[0].id).not.toEqual(oldPersonNodeId);
    expect(treeMock.nodes[0].args).toContainEqual(updatedField);
  });
  test('Update field name on field node of interface', () => {
    const treeMock = createInterfaceMock();
    const updatedField = createParserField({
      ...treeMock.nodes[0].args[1],
      name: 'firstName',
    });

    mutate(treeMock, treeMock.nodes).updateFieldOnNode(treeMock.nodes[0], 0, updatedField);
    expect(treeMock.nodes[1].args).toContainEqual({
      ...updatedField,
      fromInterface: [treeMock.nodes[0].name],
    });
  });
  test('Update input value name on input value node', () => {
    const treeMock = createMock();
    const oldQueryId = treeMock.nodes[1].id;
    const oldFieldId = treeMock.nodes[1].args[1].id;
    const oldInputValue = JSON.parse(JSON.stringify(treeMock.nodes[1].args[1].args[0]));
    const updatedInputValue = createParserField({
      ...treeMock.nodes[1].args[1].args[0],
      name: 'userId',
    });
    mutate(treeMock, treeMock.nodes).updateFieldOnNode(treeMock.nodes[1].args[1], 0, updatedInputValue);

    expect(treeMock.nodes[1].args[1].args).not.toContainEqual(oldInputValue);
    expect(treeMock.nodes[1].args[1].args).toContainEqual(updatedInputValue);
    expect(treeMock.nodes[1].args[1].id).not.toEqual(oldFieldId);
    expect(treeMock.nodes[1].id).not.toEqual(oldQueryId);
  });
  test('Set input value default value - StringValue', () => {
    const treeMock = createMock();
    const updatedInputValue = createParserField({
      ...treeMock.nodes[1].args[1].args[0],
      value: {
        type: Value.StringValue,
        value: 'Hello',
      },
    });
    mutate(treeMock, treeMock.nodes).setValueNode(treeMock.nodes[1].args[1].args[0], 'Hello');
    expect(treeMock.nodes[1].args[1].args).toContainEqual(updatedInputValue);
  });
  test('Set input value default value - IntValue', () => {
    const treeMock = createMock();
    const updatedInputValue = createParserField({
      ...treeMock.nodes[1].args[1].args[1],
      value: {
        type: Value.IntValue,
        value: '18',
      },
    });
    mutate(treeMock, treeMock.nodes).setValueNode(treeMock.nodes[1].args[1].args[1], '18');
    expect(treeMock.nodes[1].args[1].args).toContainEqual(updatedInputValue);
  });
  test('Set input value default value - FloatValue', () => {
    const treeMock = createMock();
    const updatedInputValue = createParserField({
      ...treeMock.nodes[1].args[1].args[2],
      value: {
        type: Value.FloatValue,
        value: '36.7',
      },
    });
    mutate(treeMock, treeMock.nodes).setValueNode(treeMock.nodes[1].args[1].args[2], '36.7');
    expect(treeMock.nodes[1].args[1].args).toContainEqual(updatedInputValue);
  });
  test('Set input value default value - BooleanValue', () => {
    const treeMock = createMock();
    const updatedInputValue = createParserField({
      ...treeMock.nodes[1].args[1].args[3],
      value: {
        type: Value.BooleanValue,
        value: 'true',
      },
    });
    mutate(treeMock, treeMock.nodes).setValueNode(treeMock.nodes[1].args[1].args[3], 'true');
    expect(treeMock.nodes[1].args[1].args).toContainEqual(updatedInputValue);
  });
  test('Set input value default value - ObjectValue', () => {
    const treeMock = createMock();
    const updatedInputValue = createParserField({
      ...treeMock.nodes[1].args[1].args[4],
      value: {
        type: Value.ObjectValue,
        value: `{ firstName:"Hello" }`,
      },
    });
    mutate(treeMock, treeMock.nodes).setValueNode(treeMock.nodes[1].args[1].args[4], `{ firstName:"Hello" }`);
    expect(treeMock.nodes[1].args[1].args).toContainEqual(updatedInputValue);
  });
  test('Set input value default value - ListValue', () => {
    const treeMock = createMock();
    const updatedInputValue = createParserField({
      ...treeMock.nodes[1].args[1].args[5],
      value: {
        type: Value.ListValue,
        value: `["Hello"]`,
      },
    });
    mutate(treeMock, treeMock.nodes).setValueNode(treeMock.nodes[1].args[1].args[5], `["Hello"]`);
    expect(treeMock.nodes[1].args[1].args).toContainEqual(updatedInputValue);
  });
  test('Set input value default value - EnumValue', () => {
    const treeMock = createMock();
    const updatedInputValue = createParserField({
      ...treeMock.nodes[1].args[1].args[6],
      value: {
        type: Value.EnumValue,
        value: `HELLO`,
      },
    });
    mutate(treeMock, treeMock.nodes).setValueNode(treeMock.nodes[1].args[1].args[6], `HELLO`);
    expect(treeMock.nodes[1].args[1].args).toContainEqual(updatedInputValue);
  });
  test('Implement interface', () => {
    const treeMock = createInterfaceMock();
    mutate(treeMock, treeMock.nodes).implementInterface(treeMock.nodes[2], treeMock.nodes[0]);
    treeMock.nodes[0].args.forEach((a) => {
      expect(treeMock.nodes[2].args).toContainEqual({
        ...a,
        fromInterface: [treeMock.nodes[0].name],
      });
    });
  });
  test('DeImplement interface', () => {
    const treeMock = createInterfaceMock();
    mutate(treeMock, treeMock.nodes).deImplementInterface(treeMock.nodes[1], treeMock.nodes[0].name);
    treeMock.nodes[0].args.forEach((a) => {
      expect(treeMock.nodes[1].args).not.toContainEqual({
        ...a,
        fromInterface: [treeMock.nodes[0].name],
      });
    });
  });
});

const interfacesMock: ParserTree = {
  nodes: [
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
          name: 'meta',
        }),
      ],
    }),
    createParserField({
      name: 'AnimalNode',
      interfaces: ['Node'],
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
          fromInterface: ['Node'],
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
          data: {
            type: TypeSystemDefinition.FieldDefinition,
          },
          fromInterface: ['Node'],
          type: {
            fieldType: {
              type: Options.name,
              name: ScalarTypes.String,
            },
          },
          name: 'meta',
        }),
      ],
    }),
    createParserField({
      name: 'ChairNode',
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
