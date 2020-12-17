import {
  ASTVisitor,
  FieldDefinitionNode,
  NamedTypeNode,
  ValidationContext,
} from 'graphql';

import { isNamedTypeNode, isNonNullTypeNode, ValidationError } from '../utils';

function isProperEntityIdField(field: FieldDefinitionNode): boolean {
  return (
    field.name.value == 'entityId' &&
    isNonNullTypeNode(field.type) &&
    isNamedTypeNode(field.type.type) &&
    field.type.type.name.value == 'String'
  );
}

export function NodesContainEntityId(context: ValidationContext): ASTVisitor {
  return {
    ObjectTypeDefinition(node) {
      if (
        node.interfaces?.some(
          (iface: NamedTypeNode) => iface.name.value == 'Node',
        ) &&
        !node.fields?.some((field: FieldDefinitionNode) =>
          isProperEntityIdField(field),
        )
      ) {
        context.reportError(
          new ValidationError(
            'nodes-contain-entity-id',
            `The Node type \`${node.name.value}\` must have a non-nullable "entityId" string.`,
            [node],
          ),
        );
      }
    },
  };
}
