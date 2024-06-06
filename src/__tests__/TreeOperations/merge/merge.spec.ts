import { mergeSDLs } from '@/TreeOperations/merge/merge';
import { expectTrimmedEqual } from '@/__tests__/TestUtils';

// const mergingErrorSchema = `
// type Person{
//     lastName: String
// }
// `;

describe('Merging GraphQL Schemas', () => {
  it('Should merge scalars', () => {
    const baseSchema = `
    scalar URL
    scalar JSON
    `;

    const mergingSchema = `
    scalar URL
    scalar DATE
    `;
    const t1 = mergeSDLs(baseSchema, mergingSchema);
    if (t1.__typename === 'error') throw new Error('Invalid parse');
    expectTrimmedEqual(
      t1.sdl,
      `
      scalar JSON
      scalar URL
      scalar DATE`,
    );
  });
  it('Should merge fields of both nodes', () => {
    const baseSchema = `
    type Person{
        firstName: String
        health: String
    }
    `;

    const mergingSchema = `
    type Person{
        lastName: String
    }
    `;
    const t1 = mergeSDLs(baseSchema, mergingSchema);
    if (t1.__typename === 'error') throw new Error('Invalid parse');
    expectTrimmedEqual(
      t1.sdl,
      `
    type Person{
        firstName: String
        health: String
        lastName: String
    }`,
    );
  });
  it('Should generate Conflict', () => {
    const baseSchema = `
    type Person{
        firstName: String
        health: String
    }
    `;

    const mergingSchema = `
    type Person{
        lastName: String
        health: Int
    }
    `;
    const t1 = mergeSDLs(baseSchema, mergingSchema);
    if (t1.__typename === 'success') console.log(t1.sdl);
    expect(t1.__typename).toEqual('error');
  });
  it('Should not merge extension nodes', () => {
    const baseSchema = `
    type Person{
        firstName: String
    }
    extend type Person{
        lastName: String
    }
    `;

    const mergingSchema = `
    extend type Person{
        age: String
    }
    `;
    const t1 = mergeSDLs(baseSchema, mergingSchema);
    if (t1.__typename === 'error') throw new Error('Invalid parse');
    expectTrimmedEqual(
      t1.sdl,
      `
    type Person{
        firstName: String
    }
    extend type Person{
        lastName: String
    } 
    extend type Person{
        age: String
    }`,
    );
  });
  it('Should merge schemas but maintain original schema node', () => {
    const baseSchema = `
    type DDD{
        firstName: String
        health: String
    }
    schema{
        query: DDD
    }
    `;

    const mergingSchema = `
    type Query{
        lastName: String
    }
    `;
    const t1 = mergeSDLs(baseSchema, mergingSchema);
    if (t1.__typename === 'error') throw new Error('Invalid parse');
    expectTrimmedEqual(
      t1.sdl,
      `
      type DDD{
          firstName: String
          health: String
      }
      schema{
          query: DDD
      }
      type Query{
        lastName: String
    }
      `,
    );
  });
  it('Should merge schemas but maintain original schema node', () => {
    const baseSchema = `
    type DDD{
        firstName: String
        health: String
    }
    schema{
        query: DDD
    }
    `;

    const mergingSchema = `
    type Query{
        lastName: String
    }
    type Mutation{
        ddd: String
    }
    `;
    const t1 = mergeSDLs(baseSchema, mergingSchema);
    if (t1.__typename === 'error') throw new Error('Invalid parse');
    expectTrimmedEqual(
      t1.sdl,
      `
      type DDD{
          firstName: String
          health: String
      }
      schema{
          query: DDD
      }
      type Query{
        lastName: String
    }
    type Mutation{
        ddd: String
    }
      `,
    );
  });
});
