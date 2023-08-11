import {
  enrichFieldNodeWithVariables,
  enrichGqlQueryWithAllVars,
  enrichWholeTreeWithVars,
  parseGqlTree,
  parseGqlTrees,
} from '@/GqlParser/GqlParserTreeToGql';
import { OperationType, TypeDefinition } from '@/Models';
import { GqlParserTree } from '@/Models/GqlParserTree';
import { createPlainField, createPlainInputValue, createRootField, createTypeNameField } from '@/shared';
import { expectTrimmedEqual } from '@/__tests__/TestUtils';

const mockSchema = `
type Query { 
    health(maxValue: Int, score:Score):String 
    user: User
    namings: Namings
    nameable: Nameable
} 
type User implements Nameable{
  name: String
  age: Int
  friend: User
}
type Person implements Nameable{
  name: String
  index: Int
}
interface Nameable{
  name: String
}
union Namings = Person | User
input Score{ 
    value:Float
    name:String! 
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
    createPlainField({
      name: 'user',
      type: 'User',
    }),
    createPlainField({
      name: 'namings',
      type: 'Namings',
    }),
    createPlainField({
      name: 'nameable',
      type: 'Nameable',
    }),
  ],
});

const personNode = createRootField({
  name: 'Person',
  type: TypeDefinition.ObjectTypeDefinition,
  interfaces: ['Nameable'],
  args: [
    createPlainField({ name: 'name', type: 'String', fromInterface: ['Nameable'] }),
    createPlainField({ name: 'index', type: 'Int' }),
  ],
});
const userNode = createRootField({
  name: 'User',
  type: TypeDefinition.ObjectTypeDefinition,
  interfaces: ['Nameable'],
  args: [
    createPlainField({ name: 'name', type: 'String', fromInterface: ['Nameable'] }),
    createPlainField({ name: 'age', type: 'Int' }),
    createPlainField({ name: 'friend', type: 'User' }),
  ],
});

describe('Test generation of gql strings from the GqlParserTree', () => {
  it('Creates gql node from gql and schema', () => {
    const mockQuery = `query MyQuery{
       health(
        maxValue: 100, 
        score: { 
          value: 1.0, 
          name:"Hello" 
        }
      ) 
    }`;
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
    const gqlParserResult = parseGqlTree(GqlTreeMock);
    expectTrimmedEqual(gqlParserResult, mockQuery);
  });
  it('Enriches field node with a variable', () => {
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
    const mockQueryVars = `query MyQuery($health_maxValue: Int, $health_score: Score){
       health(
        maxValue: $health_maxValue, 
        score: $health_score
      ) 
    }`;
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
    const enrichedMock = enrichWholeTreeWithVars(GqlTreeMockToAddVars);
    const gqlParserResultVars = parseGqlTree(enrichedMock);
    expectTrimmedEqual(gqlParserResultVars, mockQueryVars);
  });
  it('Enriches whole tree with variables starting from gql', () => {
    const mockQueryVars = `query MyQuery($health_maxValue: Int, $health_score: Score){
       health(
        maxValue: $health_maxValue, 
        score: $health_score
      ) 
    }`;
    const mockStartingQuery = `query MyQuery{
      health
    }`;
    const gqlParserResultVars = enrichGqlQueryWithAllVars(mockStartingQuery, mockSchema);
    expectTrimmedEqual(gqlParserResultVars, mockQueryVars);
  });

  it('Works with __typename', () => {
    const mockQueryFragment = `
    query MyQuery {
      user{
        __typename
      }
    }`;
    const GqlTreeMockWithFragments: GqlParserTree[] = [
      {
        name: 'MyQuery',
        node: queryNode,
        operation: OperationType.query,
        children: [
          {
            name: 'user',
            node: queryNode.args[1],
            children: [
              {
                name: '__typename',
                node: createTypeNameField(),
              },
            ],
          },
        ],
      },
    ];

    const gqlParserResult = parseGqlTrees(GqlTreeMockWithFragments);
    expectTrimmedEqual(gqlParserResult, mockQueryFragment);
  });

  it('Works with fragments and fragment spreads', () => {
    const mockQueryFragment = `
    fragment Full on User{
      name
      age
      friend{
        name
        age
      }
    }
    query MyQuery {
      user{
        ...Full
      }
    }`;
    const GqlTreeMockWithFragments: GqlParserTree[] = [
      {
        fragment: true,
        node: userNode,
        name: 'Full',
        children: [
          {
            node: userNode.args[0],
            name: 'name',
          },
          {
            node: userNode.args[1],
            name: 'age',
          },
          {
            node: userNode.args[2],
            name: 'friend',
            children: [
              {
                node: userNode.args[0],
                name: 'name',
              },
              {
                node: userNode.args[1],
                name: 'age',
              },
            ],
          },
        ],
      },
      {
        name: 'MyQuery',
        node: queryNode,
        operation: OperationType.query,
        children: [
          {
            name: 'user',
            node: queryNode.args[1],
            children: [
              {
                fragmentSpread: true,
                name: 'Full',
                node: userNode,
              },
            ],
          },
        ],
      },
    ];

    const gqlParserResult = parseGqlTrees(GqlTreeMockWithFragments);
    expectTrimmedEqual(gqlParserResult, mockQueryFragment);
  });

  it('works with inline fragments', () => {
    const mockQueryInline = `query MyQuery {
      namings{
        ... on Person {
          index
        }
        ... on User{
          age
        }
      }
    }`;
    const GqlTreeMock: GqlParserTree = {
      name: 'MyQuery',
      node: queryNode,
      operation: OperationType.query,
      children: [
        {
          name: 'namings',
          node: queryNode.args[2],
          children: [
            {
              inlineFragment: true,
              node: personNode,
              name: personNode.name,
              children: [
                {
                  name: 'index',
                  node: personNode.args[1],
                },
              ],
            },
            {
              inlineFragment: true,
              node: userNode,
              name: userNode.name,
              children: [
                {
                  name: 'age',
                  node: userNode.args[1],
                },
              ],
            },
          ],
        },
      ],
    };

    const gqlParserResult = parseGqlTrees([GqlTreeMock]);
    expectTrimmedEqual(gqlParserResult, mockQueryInline);
  });
});
