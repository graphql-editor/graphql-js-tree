import { ParserField, TypeDefinition } from '@/Models';
import { createParserField } from '@/shared';
import { regenerateId } from '@/TreeOperations/shared';

export const _updateNodeByInterfaceAddField = (interfaceNode: ParserField) => (node: ParserField) => {
  interfaceNode.args.forEach((ia) => {
    const sameFieldInNode = node.args.findIndex((na) => na.name === ia.name);
    if (sameFieldInNode === -1) {
      node.args.push(
        createParserField({
          ...ia,
          fromInterface: [interfaceNode.name],
        }),
      );
      return;
    }
  });
};

export const _replaceField = (oldField: ParserField, newField: ParserField) => (node: ParserField) => {
  const fieldToChange = node.args.findIndex((na) => na.name === oldField.name);
  const argToChange = node.args[fieldToChange];
  if (node.args[fieldToChange] && argToChange.fromInterface) {
    node.args[fieldToChange] = createParserField({
      ...newField,
      fromInterface: [...argToChange.fromInterface],
    });
    regenerateId(node.args[fieldToChange]);
    regenerateId(node);
  }
};

export const _getAllConnectedInterfaces = (nodes: ParserField[], interfaces: string[]) => {
  const computedInterfaces: string[] = [];
  const computeConnectedInterfaces = (nodes: ParserField[], interfaces: string[], interfacesToPush: string[]) => {
    const allInterfaces = nodes.filter((ni) => ni.data.type === TypeDefinition.InterfaceTypeDefinition);
    interfacesToPush.push(...interfaces.filter((ii) => !interfacesToPush.includes(ii)));
    for (const i of interfaces) {
      const hasInterface = allInterfaces.find((interfaceObject) => interfaceObject.name === i);
      if (hasInterface?.interfaces && hasInterface.interfaces.length) {
        computeConnectedInterfaces(nodes, hasInterface.interfaces, interfacesToPush);
      }
    }
  };
  computeConnectedInterfaces(nodes, interfaces, computedInterfaces);
  return computedInterfaces;
};

export const updateInterfaceNodeAddField = (nodes: ParserField[], interfaceNode: ParserField) => {
  const updateWithInterface = _updateNodeByInterfaceAddField(interfaceNode);
  nodes.filter((n) => n.interfaces.includes(interfaceNode.name)).forEach(updateWithInterface);
};

export const changeInterfaceField = (
  nodes: ParserField[],
  interfaceNode: ParserField,
  oldField: ParserField,
  newField: ParserField,
) => {
  const updateWithOldField = _replaceField(oldField, newField);
  nodes.filter((n) => n.interfaces.includes(interfaceNode.name)).forEach(updateWithOldField);
};

// export const deleteInterfaceExtensionNode = (nodes: ParserField[], node: ParserField) => {};

// export const deleteInterfaceNode = (nodes: ParserField[], node: ParserField) => {};
