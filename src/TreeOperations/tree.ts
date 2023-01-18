import { ParserField, TypeDefinition, Options, TypeSystemDefinition, TypeExtension, ParserTree } from '@/Models';
import { getTypeName, createParserField } from '@/shared';
import {
  deleteFieldFromInterface,
  changeInterfaceField,
  updateInterfaceNodeAddField,
  renameInterfaceNode,
  implementInterfaceOnNode,
  deImplementInterfaceOnNode,
} from '@/TreeOperations/interface';
import { ChangeAllRelatedNodes, filterNotNull, isExtensionNode, regenerateId } from '@/TreeOperations/shared';

export const mutate = (tree: ParserTree, allNodes: ParserField[]) => {
  const mutateParentIfField = (node: ParserField, nodeId: string) => {
    if (node.data.type === TypeSystemDefinition.FieldDefinition) {
      const parentNode = allNodes.find((an) => an.args.some((a) => a.id === nodeId));
      if (!parentNode) throw new Error('Invalid field definition');
      const fieldIndex = parentNode.args.findIndex((a) => a.id == nodeId);
      updateFieldOnNode(parentNode, fieldIndex, node);
      return;
    }
  };
  const deleteFieldFromNode = (n: ParserField, i: number) => {
    const nodeId = n.id;
    const argName = n.args[i].name;
    if (n.data.type === TypeDefinition.InterfaceTypeDefinition) {
      deleteFieldFromInterface(tree.nodes, n, argName);
    }
    n.args.splice(i, 1);
    regenerateId(n);
    mutateParentIfField(n, nodeId);
  };

  const updateFieldOnNode = (node: ParserField, i: number, updatedField: ParserField) => {
    const oldField = JSON.parse(JSON.stringify(node.args[i]));
    const nodeId = node.id;
    if (node.data.type === TypeDefinition.InterfaceTypeDefinition) {
      changeInterfaceField(tree.nodes, node, oldField, updatedField);
    }
    node.args[i] = updatedField;
    regenerateId(node);
    mutateParentIfField(node, nodeId);
  };

  const addFieldToNode = (node: ParserField, { id, ...f }: ParserField, name?: string) => {
    let newName = name || f.name[0].toLowerCase() + f.name.slice(1);
    const existingNodes = node.args?.filter((a) => a.name.match(`${newName}\d?`)) || [];
    if (existingNodes.length > 0) {
      newName = `${newName}${existingNodes.length}`;
    }
    const nodeId = id;
    node.args?.push(
      createParserField({
        ...f,
        directives: [],
        interfaces: [],
        args: [],
        type: {
          fieldType: {
            name: f.name,
            type: Options.name,
          },
        },
        name: newName,
      }),
    );
    if (node.data.type === TypeDefinition.InterfaceTypeDefinition) {
      updateInterfaceNodeAddField(tree.nodes, node);
    }
    mutateParentIfField(node, nodeId);
  };
  const renameNode = (node: ParserField, newName: string) => {
    const isError = allNodes.map((n) => n.name).includes(newName);
    if (isError) {
      return;
    }
    if (node.data.type === TypeDefinition.InterfaceTypeDefinition) {
      renameInterfaceNode(tree.nodes, newName, node.name);
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
    const allNodes = [...tree.nodes];
    // co jak usuwamy extension interface
    if (node.data.type === TypeExtension.InterfaceTypeExtension) {
    }
    allNodes.splice(deletedNode, 1);
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
    });
  };
  const implementInterface = (node: ParserField, interfaceNode: ParserField) => {
    implementInterfaceOnNode(tree.nodes, node, interfaceNode);
  };
  const deImplementInterface = (node: ParserField, interfaceName: string) => {
    deImplementInterfaceOnNode(tree.nodes, node, interfaceName);
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
