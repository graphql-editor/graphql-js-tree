import {
  createParserField,
  createPlainDirectiveImplementation,
  createRootDirectiveField,
  createSchemaDefinition,
} from '@/shared';
import {
  ParserTree,
  ScalarTypes,
  TypeDefinition,
  TypeDefinitionDisplayStrings,
  TypeSystemDefinition,
  Options,
  Directive,
} from '../../Models';
import { TreeToGraphQL } from '../../TreeToGraphQL';
import { trimGraphQL } from '../TestUtils';

describe('Schema base operations in TreeToGraphQL', () => {
  test(`query`, () => {
    const treeMock: ParserTree = {
      nodes: [
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
              name: 'status',
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
        createSchemaDefinition({
          operations: {
            query: 'Query',
          },
        }),
      ],
    };
    const graphql = trimGraphQL(TreeToGraphQL.parse(treeMock));
    expect(graphql).toContain(trimGraphQL(`schema{ query: Query}`));
  });
  test(`query with directives`, () => {
    const treeMock: ParserTree = {
      nodes: [
        createRootDirectiveField({
          name: 'schemator',
          directiveOptions: [Directive.SCHEMA],
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
              name: 'status',
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
        createSchemaDefinition({
          operations: {
            query: 'Query',
          },
          directives: [createPlainDirectiveImplementation({ name: 'schemator' })],
        }),
      ],
    };

    const graphql = trimGraphQL(TreeToGraphQL.parse(treeMock));
    expect(graphql).toContain(
      trimGraphQL(`
    schema @schemator{ query: Query}`),
    );
  });
  test(`empty query`, () => {
    const treeMock: ParserTree = {
      nodes: [
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
        }),
        createSchemaDefinition({
          operations: {
            query: 'Query',
          },
        }),
      ],
    };

    const graphql = trimGraphQL(TreeToGraphQL.parse(treeMock));
    expect(graphql).toContain(trimGraphQL(`schema{ query: Query}`));
  });
  test(`schema extended with operation type`, () => {
    const treeMock: ParserTree = {
      nodes: [
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
              name: 'status',
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
          name: 'ExtMut',
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
              name: 'status',
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
        createSchemaDefinition({
          operations: {
            query: 'Query',
          },
        }),
      ],
    };
    const graphql = trimGraphQL(TreeToGraphQL.parse(treeMock));
    expect(graphql).toContain(trimGraphQL(`schema{ query: Query}`));
  });
});
