import {
  enrichFieldNodeWithVariables,
  enrichWholeTreeWithVars,
  GqlParserTreeToGql,
} from '@/GqlParser/GqlParserTreeToGql';
import { OperationType, TypeDefinition } from '@/Models';
import { GqlParserTree } from '@/Models/GqlParserTree';
import { createPlainField, createPlainInputValue, createRootField } from '@/shared';
import { expectTrimmedEqual } from '@/__tests__/TestUtils';

const mockQuery = `query MyQuery{
   health(
    maxValue: 100, 
    score: { 
      value: 1.0, 
      name:"Hello" 
    }
  ) 
}`;
const mockQueryVars = `query MyQuery($health_maxValue: Int, $health_score: Score){
   health(
    maxValue: $health_maxValue, 
    score: $health_score
  ) 
}`;

const queryNode = createRootField({
  name: 'Query',
  type: TypeDefinition.ObjectTypeDefinition,
  args: [
    createPlainField({
      name: 'health',
      type: 'String',
      args: [
        createPlainInputValue({ name: 'maxValue', type: 'Int' }),
        createPlainInputValue({ name: 'score', type: 'Score' }),
      ],
    }),
  ],
});

queryNode.type.operations = [OperationType.query];

const GqlTreeMock: GqlParserTree = {
  name: 'MyQuery',
  node: queryNode,
  operation: OperationType.query,
  children: [
    {
      name: 'health',
      node: queryNode.args[0],
      children: undefined,
      directives: [],
      arguments: [
        {
          name: 'maxValue',
          node: queryNode.args[0].args[0],
          value: {
            kind: 'IntValue',
            value: '100',
          },
        },
        {
          name: 'score',
          node: queryNode.args[0].args[1],
          value: {
            kind: 'ObjectValue',
            fields: [
              {
                kind: 'ObjectField',
                name: 'value',
                value: {
                  kind: 'FloatValue',
                  value: '1.0',
                },
              },
              {
                kind: 'ObjectField',
                name: 'name',
                value: {
                  kind: 'StringValue',
                  value: 'Hello',
                },
              },
            ],
          },
        },
      ],
    },
  ],
};

const GqlTreeMockToAddVars = {
  name: 'MyQuery',
  node: queryNode,
  operation: OperationType.query,
  children: [
    {
      name: 'health',
      node: queryNode.args[0],
      children: undefined,
      directives: [],
      arguments: [],
    },
  ],
};

describe('Test generation of gql strings from the GqlParserTree', () => {
  it('Creates gql node from gql and schema', () => {
    const gqlParserResult = GqlParserTreeToGql(GqlTreeMock);
    expectTrimmedEqual(gqlParserResult, mockQuery);
  });
  it('Enriches field node with a variable', () => {
    const enrichedNode = enrichFieldNodeWithVariables(GqlTreeMockToAddVars.children[0], () => {
      return;
    });
    const arg0 = queryNode.args[0].args[0];
    const arg1 = queryNode.args[0].args[1];
    expect(enrichedNode).toEqual({
      ...GqlTreeMockToAddVars.children[0],
      arguments: [
        {
          node: arg0,
          name: arg0.name,
          value: {
            kind: 'Variable',
            value: `${queryNode.args[0].name}_${arg0.name}`,
          },
        },
        {
          node: arg1,
          name: arg1.name,
          value: {
            kind: 'Variable',
            value: `${queryNode.args[0].name}_${arg1.name}`,
          },
        },
      ],
    } as GqlParserTree);
  });
  it('Enriches whole tree with variables', () => {
    const enrichedMock = enrichWholeTreeWithVars(GqlTreeMockToAddVars);
    const gqlParserResultVars = GqlParserTreeToGql(enrichedMock);
    expectTrimmedEqual(gqlParserResultVars, mockQueryVars);
  });
});
