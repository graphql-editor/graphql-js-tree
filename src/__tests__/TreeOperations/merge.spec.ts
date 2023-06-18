import { Parser } from '@/Parser';
import { mergeSDLs, mergeTrees } from '@/TreeOperations/merge';
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
  it('Tree test - Should merge interfaces and implementation of both nodes matching library fields.', () => {
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
    const baseTree = Parser.parse(baseSchema);
    const libraryTree = Parser.parse(mergingSchema);
    const mergedTree = mergeTrees(baseTree, libraryTree);
    if (mergedTree.__typename === 'error') throw new Error('Invalid parse');
    const PersonNode = mergedTree.nodes.find((n) => n.name === 'Person');
    const lastNameField = PersonNode?.args.find((a) => a.name === 'lastName');
    const createdAtField = PersonNode?.args.find((a) => a.name === 'createdAt');
    expect(lastNameField?.fromLibrary).toBeTruthy();
    expect(createdAtField?.fromLibrary).toBeTruthy();
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
