import { createParserField } from '@/shared';
import { ParserTree, TypeDefinition, TypeDefinitionDisplayStrings, Options } from '../../Models';
import { TreeToGraphQL } from '../../TreeToGraphQL';

describe('TypeDefintion declarations tests on TreeToGraphQL', () => {
  test('ObjectTypeDefinition - type keyword', () => {
    const schema = 'type Person';
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
        }),
      ],
    };
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(schema);
  });
  test('InterfaceTypeDefinition - interface keyword', () => {
    const schema = 'interface Person';
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
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
        }),
      ],
    };
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(schema);
  });
  test('InputObjectTypeDefinition - input keyword', () => {
    const schema = 'input Person';
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
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
        }),
      ],
    };
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(schema);
  });
  test('EnumTypeDefinition - enum keyword', () => {
    const schema = 'enum Person';
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
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
        }),
      ],
    };
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(schema);
  });
  test('UnionTypeDefinition - union keyword', () => {
    const schema = 'union Person';
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
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
        }),
      ],
    };
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(schema);
  });
  test('ScalarTypeDefinition - scalar keyword', () => {
    const schema = 'scalar Person';
    const treeMock: ParserTree = {
      nodes: [
        createParserField({
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
        }),
      ],
    };
    const graphql = TreeToGraphQL.parse(treeMock);
    expect(graphql).toContain(schema);
  });
});
