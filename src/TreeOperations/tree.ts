import { ParserField, TypeDefinition, TypeSystemDefinition, TypeExtension, ParserTree } from '@/Models';
import { getTypeName } from '@/shared';
import {
  changeInterfaceField,
  updateInterfaceNodeAddField,
  _getAllConnectedInterfaces,
} from '@/TreeOperations/interface';
import { ChangeAllRelatedNodes, filterNotNull, isExtensionNode, regenerateId } from '@/TreeOperations/shared';

export const mutate = (tree: ParserTree, allNodes: ParserField[]) => {
  const mutateParentIfField = (node: ParserField) => {
    if (node.data.type === TypeSystemDefinition.FieldDefinition) {
      const parentNode = allNodes.find((an) => an.args.some((a) => a.id === node.id));
      if (!parentNode) throw new Error('Invalid field definition');
      const fieldIndex = parentNode.args.findIndex((a) => a.id == node.id);
      updateFieldOnNode(parentNode, fieldIndex, node);
      return;
    }
  };
  const deleteFieldFromNode = (n: ParserField, i: number) => {
    const argName = n.args[i].name;
    if (n.data.type === TypeDefinition.InterfaceTypeDefinition) {
      tree.nodes
        .filter((filterNode) => filterNode.interfaces.includes(n.name))
        .forEach((nodeWithThisInterface) => {
          nodeWithThisInterface.args = nodeWithThisInterface.args
            .map((a) => {
              if (a.name !== argName || !a.fromInterface) return a;
              if (a.fromInterface.length === 1) return null;
              return {
                ...a,
                fromInterface: a.fromInterface.filter((ai) => ai !== n.name),
              };
            })
            .filter(filterNotNull);
        });
    }
    n.args.splice(i, 1);
    regenerateId(n);
    mutateParentIfField(n);
  };

  const updateFieldOnNode = (node: ParserField, i: number, updatedField: ParserField) => {
    regenerateId(updatedField);
    if (node.data.type === TypeDefinition.InterfaceTypeDefinition) {
      const oldField: ParserField = JSON.parse(JSON.stringify(node.args[i]));
      changeInterfaceField(tree.nodes, node, oldField, updatedField);
    }
    node.args[i] = updatedField;
    regenerateId(node);
    mutateParentIfField(node);
  };

  const addFieldToNode = (node: ParserField, f: ParserField) => {
    node.args?.push({ ...f });
    if (node.data.type === TypeDefinition.InterfaceTypeDefinition) {
      updateInterfaceNodeAddField(tree.nodes, node);
    }
    regenerateId(node);
    mutateParentIfField(node);
  };
  const renameNode = (node: ParserField, newName: string) => {
    const isError = allNodes.map((n) => n.name).includes(newName);
    if (isError) {
      return;
    }
    if (node.data.type === TypeDefinition.InterfaceTypeDefinition) {
      const oldName = node.name;
      tree.nodes
        .filter((n) => n.interfaces.includes(oldName))
        .forEach((n) => {
          n.interfaces = n.interfaces.filter((i) => i !== oldName).concat([newName]);
          n.args.forEach((a) => {
            a.fromInterface = a.fromInterface?.filter((fi) => fi !== oldName).concat([newName]);
          });
          regenerateId(n);
        });
    }
    ChangeAllRelatedNodes({
      newName,
      nodes: tree.nodes,
      oldName: node.name,
    });
    node.name = newName;
    regenerateId(node);
  };
  const removeNode = (node: ParserField) => {
    const deletedNode = tree.nodes.findIndex((n) => n === node);
    if (deletedNode === -1) throw new Error('Error deleting a node');
    // co jak usuwamy extension interface
    if (node.data.type === TypeExtension.InterfaceTypeExtension) {
    }
    tree.nodes.splice(deletedNode, 1);
    tree.nodes.forEach((n) => {
      n.args = n.args
        .filter((a) => {
          const tName = getTypeName(a.type.fieldType);
          if (tName === node.name && !isExtensionNode(node.data.type)) {
            return null;
          }
          return a;
        })
        .filter(filterNotNull);
      regenerateId(n);
    });
    if (node.data.type === TypeDefinition.InterfaceTypeDefinition) {
      tree.nodes
        .filter((n) => n.interfaces.includes(node.name))
        .forEach((n) => {
          deImplementInterface(n, node.name);
        });
    }
  };
  const implementInterface = (node: ParserField, interfaceNode: ParserField) => {
    const interfacesToPush = _getAllConnectedInterfaces(allNodes, [interfaceNode.name]);
    node.interfaces.push(...interfacesToPush);
    const argsToPush = interfaceNode.args?.filter((a) => !node.args?.find((na) => na.name === a.name)) || [];
    node.args = node.args.map((a) => {
      if (interfaceNode.args.find((interfaceArg) => interfaceArg.name === a.name)) {
        return {
          ...a,
          fromInterface: (a.fromInterface || []).concat([interfaceNode.name]),
        };
      }
      return a;
    });
    node.args = node.args?.concat(
      argsToPush.map((atp) => ({
        ...atp,
        fromInterface: [interfaceNode.name],
      })),
    );
    regenerateId(node);
  };
  const deImplementInterface = (node: ParserField, interfaceName: string) => {
    const interfacesToDeImplement = _getAllConnectedInterfaces(allNodes, [interfaceName]);
    node.interfaces = node.interfaces.filter((ni) => !interfacesToDeImplement.includes(ni));
    node.args = node.args
      .map((a) => {
        if (!a.fromInterface?.length) return a;
        a.fromInterface = a.fromInterface.filter((fi) => !interfacesToDeImplement.includes(fi));
        if (a.fromInterface.length === 0) return null;
        return a;
      })
      .filter(filterNotNull);
    regenerateId(node);
  };
  return {
    deleteFieldFromNode,
    updateFieldOnNode,
    addFieldToNode,
    renameNode,
    removeNode,
    implementInterface,
    deImplementInterface,
  };
};
