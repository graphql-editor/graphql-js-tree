import { mergeSDLs } from '@/TreeOperations/merge/merge';
import { expectTrimmedEqual } from '@/__tests__/TestUtils';

describe('Merging GraphQL Inputs and field arguments', () => {
  it('Should merge inputs leaving only common fields.', () => {
    const baseSchema = `
    input UserInput {
      name: String!
      age: Int # Not in Subgraph B
    }
    `;

    const mergingSchema = `
    input UserInput {
      name: String!
      email: String # Not in Subgraph A
    }
    `;
    const t1 = mergeSDLs(baseSchema, mergingSchema);
    if (t1.__typename === 'error') throw new Error('Invalid parse');
    expectTrimmedEqual(
      t1.sdl,
      `
      input UserInput{
        name: String!
      }`,
    );
  });
  it('Should merge inputs marking fields required.', () => {
    const baseSchema = `
    input UserInput {
      name: String!
      age: Int
    }
    `;

    const mergingSchema = `
    input UserInput {
      name: String
      age: Int!
    }
    `;
    const t1 = mergeSDLs(baseSchema, mergingSchema);
    if (t1.__typename === 'error') throw new Error('Invalid parse');
    expectTrimmedEqual(
      t1.sdl,
      `
      input UserInput{
        name: String!
        age: Int!
      }`,
    );
  });
  it('Should not merge inputs', () => {
    const baseSchema = `
    input UserInput {
      name: String!
    }
    `;

    const mergingSchema = `
    input UserInput {
      name: String!
      email: String!
    }
    `;
    const t1 = mergeSDLs(baseSchema, mergingSchema);
    if (t1.__typename === 'success') console.log(t1.sdl);
    expect(t1.__typename).toEqual('error');
  });
  it('Should merge field arguments marking them required.', () => {
    const baseSchema = `
    type Main{
      getUsers(funny: Boolean, premium: String!): String!
    }
    `;

    const mergingSchema = `
    type Main{
      getUsers(funny: Boolean!, premium: String): String!
    }
    `;
    const t1 = mergeSDLs(baseSchema, mergingSchema);
    if (t1.__typename === 'error') throw new Error('Invalid parse');
    expectTrimmedEqual(
      t1.sdl,
      `
      type Main{
      getUsers(funny: Boolean! premium: String!): String!
    }`,
    );
  });
  it('Should merge field arguments leaving only common fields.', () => {
    const baseSchema = `
    type Main{
      getUsers(premium: String!): String!
    }
    `;

    const mergingSchema = `
    type Main{
      getUsers(funny: Boolean, premium: String): String!
    }
    `;
    const t1 = mergeSDLs(baseSchema, mergingSchema);
    if (t1.__typename === 'error') throw new Error('Invalid parse');
    expectTrimmedEqual(
      t1.sdl,
      `
      type Main{
      getUsers(premium: String!): String!
    }`,
    );
  });
});
