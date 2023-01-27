import { Options, ParserField } from '@/Models';
import { checkValueType } from '@/TreeOperations/tree';

export const recursivelyDeleteDirectiveNodes = (nodes: ParserField[], directiveName: string) => {
  nodes.forEach((n) => {
    if (n.directives) {
      n.directives = n.directives.filter((d) => d.name !== directiveName);
    }
    recursivelyDeleteDirectiveNodes(n.args, directiveName);
  });
};

export const recursivelyRenameDirectiveNodes = (
  nodes: ParserField[],
  oldDirectiveName: string,
  newDirectiveName: string,
) => {
  nodes.forEach((n) => {
    if (n.directives) {
      n.directives = n.directives.map((d) =>
        d.name !== oldDirectiveName
          ? d
          : {
              ...d,
              name: newDirectiveName,
              type: {
                fieldType: {
                  name: newDirectiveName,
                  type: Options.name,
                },
              },
            },
      );
    }
    recursivelyRenameDirectiveNodes(n.args, oldDirectiveName, newDirectiveName);
  });
};

export const recursivelyUpdateDirectiveArgument = (
  nodes: ParserField[],
  directiveName: string,
  oldField: ParserField,
  newField: ParserField,
  allNodes: ParserField[],
) => {
  nodes.forEach((n) => {
    if (n.directives.length > 0) {
      const remappedDirectives = n.directives.map((d) => {
        if (d.name !== directiveName) return d;
        const remappedArgs = d.args.map((a) =>
          a.name === oldField.name
            ? {
                ...a,
                name: newField.name,
                value: {
                  value: a.value?.value,
                  type: checkValueType(newField, allNodes),
                },
                type: {
                  fieldType: {
                    ...a.type.fieldType,
                    name: newField.name,
                  },
                },
              }
            : a,
        );
        return {
          ...d,
          args: remappedArgs,
        };
      });
      n.directives = remappedDirectives;
    }
    recursivelyUpdateDirectiveArgument(n.args, directiveName, oldField, newField, allNodes);
  });
};

export const recursivelyDeleteDirectiveArgument = (
  nodes: ParserField[],
  directiveName: string,
  argumentField: ParserField,
) => {
  nodes.forEach((n) => {
    if (n.directives) {
      n.directives = n.directives.map((d) =>
        d.name !== directiveName
          ? d
          : {
              ...d,
              args: d.args.filter((a) => a.name !== argumentField.name),
            },
      );
    }
    recursivelyDeleteDirectiveArgument(n.args, directiveName, argumentField);
  });
};
