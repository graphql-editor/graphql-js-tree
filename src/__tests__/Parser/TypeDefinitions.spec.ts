import { ParserTree, TypeDefinition, TypeDefinitionDisplayStrings, Options } from '../../Models';
import { Parser } from '../../Parser';

describe('TypeDefintion declarations tests on parser', () => {
  test('ObjectTypeDefinition - type keyword', () => {
    const schema = 'type Person';
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
          args: [],
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  test('InterfaceTypeDefinition - interface keyword', () => {
    const schema = 'interface Person';
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Person',
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
          args: [],
          interfaces: [],
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  test('InputObjectTypeDefinition - input keyword', () => {
    const schema = 'input Person';
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Person',
          type: {
            fieldType: {
              name: TypeDefinitionDisplayStrings.input,
              type: Options.name,
            },
          },
          data: {
            type: TypeDefinition.InputObjectTypeDefinition,
          },
          directives: [],
          args: [],
          interfaces: [],
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  test('EnumTypeDefinition - enum keyword', () => {
    const schema = 'enum Person';
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Person',
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
          args: [],
          interfaces: [],
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  test('UnionTypeDefinition - union keyword', () => {
    const schema = 'union Person';
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Person',
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
          args: [],
          interfaces: [],
        },
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
  test('ScalarTypeDefinition - scalar keyword', () => {
    const schema = 'scalar Person';
    const tree = Parser.parse(schema);
    const treeMock: ParserTree = {
      nodes: [
        {
          name: 'Person',
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
      ],
    };
    expect(tree.nodes).toEqual(treeMock.nodes);
  });
});
