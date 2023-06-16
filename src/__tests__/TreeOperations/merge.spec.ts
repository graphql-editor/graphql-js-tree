import { mergeSDLs } from '@/TreeOperations/merge';
import { expectTrimmedEqual } from '@/__tests__/TestUtils';

// const mergingErrorSchema = `
// type Person{
//     lastName: String
// }
// `;

describe('Merging GraphQL Schemas', () => {
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
  it('Should merge interfaces and implementation of both nodes', () => {
    const baseSchema = `
    type Person implements Node{
        firstName: String
        health: String
        _id: String
    }
    interface Node {
        _id: String
    }
    `;

    const mergingSchema = `
    type Person implements Dateable{
        lastName: String
        createdAt: String
    }
    interface Dateable {
        createdAt: String
    }
    `;
    const t1 = mergeSDLs(baseSchema, mergingSchema);
    if (t1.__typename === 'error') throw new Error('Invalid parse');
    expectTrimmedEqual(
      t1.sdl,
      `
      interface Node {
          _id: String
      }
    type Person implements Node & Dateable{
        firstName: String
        health: String
        _id: String
        lastName: String
        createdAt: String
    }
    interface Dateable {
        createdAt: String
    }`,
    );
  });
});
