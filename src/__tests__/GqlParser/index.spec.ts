import { parseGql } from '@/GqlParser';
import { OperationType, TypeDefinition } from '@/Models';
import { GqlParserTree } from '@/Models/GqlParserTree';
import { createPlainField, createPlainInputValue, createRootField, createTypeNameField } from '@/shared';

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
// const nameableNode = createRootField({
//   name: 'Nameable',
//   type: TypeDefinition.InterfaceTypeDefinition,
//   args: [createPlainField({ name: 'name', type: 'String' })],
// });
// const namingsNode = createRootField({
//   name: 'Namings',
//   type: TypeDefinition.UnionTypeDefinition,
//   args: [createUnionMember({ name: 'Person' }), createUnionMember({ name: 'User' })],
// });
describe('Test generation of GqlParserTrees from gql', () => {
  it('Creates gql node from gql and schema', () => {
    const mockQuery = `query MyQuery {
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
    const gqlParserResult = parseGql(mockQuery, mockSchema);
    expect(gqlParserResult[0]).toEqual(GqlTreeMock);
  });
  it('Creates gql with variable defintions', () => {
    const mockQueryVars = `query MyQuery($maxValue: String, $score: Score){
      health(
       maxValue: $maxValue, 
       score: $score
     ) 
    }`;
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

    const gqlParserResult = parseGql(mockQueryVars, mockSchema);
    expect(gqlParserResult[0]).toEqual(GqlTreeMockWithVars);
  });
  it('Creates __typename node', () => {
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

    const gqlParserResult = parseGql(mockQueryFragment, mockSchema);
    expect(gqlParserResult[0]).toEqual(GqlTreeMockWithFragments[0]);
  });

  it('Creates gql with fragment and fragment spread', () => {
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

    const gqlParserResult = parseGql(mockQueryFragment, mockSchema);
    expect(gqlParserResult[0]).toEqual(GqlTreeMockWithFragments[0]);
    expect(gqlParserResult[1]).toEqual(GqlTreeMockWithFragments[1]);
  });

  it('Parses inline fragments from gql on unions', () => {
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
    const gqlParserResult = parseGql(mockQueryInline, mockSchema);
    expect(gqlParserResult[0]).toEqual(GqlTreeMock);
  });
});
