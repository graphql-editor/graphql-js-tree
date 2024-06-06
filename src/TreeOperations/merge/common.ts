export class MergeError extends Error {
  constructor(
    public errorParams: {
      conflictingNode: string;
      conflictingField?: string;
      message?: string;
    },
  ) {
    super('Merging error');
  }
}

export type ErrorConflict = { conflictingNode: string; conflictingField?: string };
