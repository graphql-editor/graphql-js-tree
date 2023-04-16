import { GqlParser } from '@/GqlParser';
import { OperationType, TypeDefinition } from '@/Models';
import { GqlParserTree } from '@/Models/GqlParserTree';
import { createPlainField, createPlainInputValue, createRootField } from '@/shared';

const mockSchema = `
type Query { 
    health(maxValue: Int, score:Score):String 
} 
input Score{ 
    value:Float
    name:String! 
}`;

const mockQuery = `query MyQuery {
   health(
    maxValue: 100, 
    score: { 
      value: 1.0, 
      name:"Hello" 
    }
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
const GqlTreeMockWithVars: GqlParserTree = {
  name: 'MyQuery',
  node: queryNode,
  operation: OperationType.query,
  variableDefinitions: [
    {
      name: 'maxValue',
      type: 'String',
    },
    {
      name: 'score',
      type: 'Score',
    },
  ],
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
            kind: 'Variable',
            value: 'maxValue',
          },
        },
        {
          name: 'score',
          node: queryNode.args[0].args[1],
          value: {
            kind: 'Variable',
            value: 'score',
          },
        },
      ],
    },
  ],
};

const mockQueryVars = `query MyQuery($maxValue: String, $score: Score){
  health(
   maxValue: $maxValue, 
   score: $score
 ) 
}`;

describe('Test generation of GqlParserTrees from gql', () => {
  it('Creates gql node from gql and schema', () => {
    const gqlParserResult = GqlParser(mockQuery, mockSchema);
    expect(gqlParserResult[0]).toEqual(GqlTreeMock);
  });
  it('Creates gql with variable defintions', () => {
    const gqlParserResult = GqlParser(mockQueryVars, mockSchema);
    expect(gqlParserResult[0]).toEqual(GqlTreeMockWithVars);
  });
});
