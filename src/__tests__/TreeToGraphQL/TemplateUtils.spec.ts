import { TemplateUtils } from '@/TreeToGraphQL/templates/TemplateUtils';
import { Options, ParserField, TypeSystemDefinition } from '../../Models';

describe('TemplateUtils tests on parser', () => {
  test(`ListType fields`, () => {
    const treeMock: ParserField = {
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
      directives: [],
      interfaces: [],
      args: [],
    };

    const graphql = TemplateUtils.resolveFieldType(treeMock.type.fieldType);
    expect(graphql).toContain(`[Person]!`);
  });
});
