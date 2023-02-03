import {
  ParserField,
  TypeDefinition,
  TypeSystemDefinition,
  TypeExtension,
  ParserTree,
  Value,
  ScalarTypes,
  Instances,
  ValueDefinition,
} from '@/Models';
import { getTypeName } from '@/shared';
import {
  recursivelyDeleteDirectiveArgument,
  recursivelyDeleteDirectiveNodes,
  recursivelyRenameDirectiveNodes,
  recursivelyUpdateDirectiveArgument,
} from '@/TreeOperations/directive';
import {
  changeInterfaceField,
  updateInterfaceNodeAddField,
  _getAllConnectedInterfaces,
} from '@/TreeOperations/interface';
import {
  ChangeAllRelatedNodes,
  filterNotNull,
  isArrayType,
  isExtensionNode,
  isScalarArgument,
  regenerateId,
  RemoveRelatedExtensionNodes,
} from '@/TreeOperations/shared';

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
    if (n.data.type === TypeDefinition.InterfaceTypeDefinition) {
      const argName = n.args[i].name;
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
    if (node.data.type === TypeSystemDefinition.DirectiveDefinition) {
      const oldField: ParserField = JSON.parse(JSON.stringify(node.args[i]));
      recursivelyUpdateDirectiveArgument(allNodes, node.name, oldField, updatedField, allNodes);
    }
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
  const renameRootNode = (node: ParserField, newName: string) => {
    const isError = allNodes.map((n) => n.name).includes(newName);
    if (isError) {
      return;
    }
    if (node.data.type === TypeSystemDefinition.DirectiveDefinition) {
      recursivelyRenameDirectiveNodes(allNodes, node.name, newName);
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
    if (node.data.type === TypeSystemDefinition.FieldDefinition) {
      const parent = allNodes.find((parentNode) => parentNode.args.includes(node));
      if (parent) {
        const index = parent.args.indexOf(node);
        deleteFieldFromNode(parent, index);
      }
      return;
    }
    if (node.data.type === TypeSystemDefinition.UnionMemberDefinition) {
      const parent = allNodes.find((parentNode) => parentNode.args.includes(node));
      if (parent) {
        const index = parent.args.indexOf(node);
        deleteFieldFromNode(parent, index);
      }
      return;
    }
    if (node.data.type === ValueDefinition.InputValueDefinition) {
      const parent = allNodes.find((parentNode) => parentNode.args.includes(node));
      if (parent) {
        if (parent.data.type === TypeSystemDefinition.DirectiveDefinition) {
          recursivelyDeleteDirectiveArgument(allNodes, parent.name, node);
        }
        const index = parent.args.indexOf(node);
        deleteFieldFromNode(parent, index);
      } else {
        const parent = allNodes.find((p) => p.args.some((a) => a.args.includes(node)));
        const field = parent?.args.find((a) => a.args.includes(node));
        if (field) {
          const fieldIndex = field.args.findIndex((f) => f === node);
          deleteFieldFromNode(field, fieldIndex);
        }
      }
      return;
    }
    if (node.data.type === ValueDefinition.EnumValueDefinition) {
      const parent = allNodes.find((parentNode) => parentNode.args.includes(node));
      if (parent) {
        const index = parent.args.indexOf(node);
        deleteFieldFromNode(parent, index);
      }
      return;
    }
    if (node.data.type === Instances.Directive) {
      throw new Error('Directive Instances should be removed on node directly not using this function');
    }
    if (node.data.type === Instances.Argument) {
      throw new Error('Directive Instance Arguments should be removed on node directly not using this function');
    }
    if (node.data.type === TypeSystemDefinition.DirectiveDefinition) {
      recursivelyDeleteDirectiveNodes(allNodes, node.name);
    }
    const deletedNode = tree.nodes.findIndex((n) => n === node);
    if (deletedNode === -1) throw new Error('Error deleting a node');
    // co jak usuwamy extension interface
    if (node.data.type === TypeExtension.InterfaceTypeExtension) {
    }
    tree.nodes.splice(deletedNode, 1);
    RemoveRelatedExtensionNodes({ node, tree });
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
  const setValueNode = (node: ParserField, value: string) => {
    node.value = {
      value,
      type: checkValueType(node, allNodes),
    };
  };
  return {
    updateFieldOnNode,
    addFieldToNode,
    renameRootNode,
    removeNode,
    implementInterface,
    deImplementInterface,
    setValueNode,
  };
};

export const checkValueType = (node: ParserField, nodes: ParserField[]) => {
  const isArray = isArrayType(node.type.fieldType);
  if (isArray) return Value.ListValue;
  const tName = getTypeName(node.type.fieldType);
  const scalarTypes = nodes.filter((n) => n.data.type === TypeDefinition.ScalarTypeDefinition).map((n) => n.name);
  if (isScalarArgument(node, scalarTypes)) {
    if (tName === ScalarTypes.Boolean) {
      return Value.BooleanValue;
    }
    if (tName === ScalarTypes.Float) {
      return Value.FloatValue;
    }
    if (tName === ScalarTypes.ID) {
      return Value.IDValue;
    }
    if (tName === ScalarTypes.Int) {
      return Value.IntValue;
    }
    if (tName === ScalarTypes.String) {
      return Value.StringValue;
    }
    return Value.ScalarValue;
  }
  const parentNode = nodes.find((n) => n.name === tName);
  if (
    parentNode?.data.type === TypeDefinition.InputObjectTypeDefinition ||
    parentNode?.data.type === TypeExtension.InputObjectTypeExtension
  ) {
    return Value.ObjectValue;
  }
  if (
    parentNode?.data.type === TypeDefinition.EnumTypeDefinition ||
    parentNode?.data.type === TypeExtension.EnumTypeExtension
  ) {
    return Value.EnumValue;
  }
  return Value.Variable;
};
