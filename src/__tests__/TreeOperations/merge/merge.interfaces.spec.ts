import { mergeSDLs } from '@/TreeOperations/merge/merge';

// const mergingErrorSchema = `
// type Person{
//     lastName: String
// }
// `;

describe('Merging GraphQL Schemas', () => {
  it('should not merge interfaces and implementation of both nodes', () => {
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
    expect(t1.__typename).toEqual('error');
  });
});
