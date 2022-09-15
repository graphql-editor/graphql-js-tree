import { compileType, createParserField, decompileType } from '@/shared';
import { FieldType, Options, ParserField, TypeSystemDefinition } from '../../Models';

describe('TemplateUtils tests on parser', () => {
  test(`ListType fields`, () => {
    const treeMock: ParserField = createParserField({
      name: 'friends',
      type: {
        fieldType: {
          type: Options.required,
          nest: {
            type: Options.array,
            nest: {
              type: Options.name,
              name: 'Person',
            },
          },
        },
      },
      data: {
        type: TypeSystemDefinition.FieldDefinition,
      },
    });

    const graphql = compileType(treeMock.type.fieldType);
    expect(graphql).toContain(`[Person]!`);
  });
  test(`ListType fields  2`, () => {
    const treeMock: FieldType = {
      type: Options.required,
      nest: {
        type: Options.array,
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
    };

    const graphql = compileType(treeMock);
    expect(graphql).toContain(`[[Person!]]!`);
  });
  test(`ListType fields  3`, () => {
    const ft = decompileType(`[[Person]!]!`);
    expect(compileType(ft)).toContain(`[[Person]!]!`);
  });
  test(`ListType fields  4`, () => {
    const ft = decompileType(`[[Person]!]!`);
    expect(compileType(ft)).toContain(`[[Person]!]!`);
  });
});
