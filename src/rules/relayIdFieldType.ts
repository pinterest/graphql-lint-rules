import type {
  ASTVisitor,
  FieldDefinitionNode,
  ValidationContext,
} from 'graphql';

import { ValidationError } from 'graphql-schema-linter';
import { isNamedTypeNode, isNonNullTypeNode } from '../utils';

function isProperRelayIdField(field: FieldDefinitionNode): boolean {
  return (
    isNonNullTypeNode(field.type) &&
    isNamedTypeNode(field.type.type) &&
    field.type.type.name.value == 'ID'
  );
}

export function RelayIdFieldType(context: ValidationContext): ASTVisitor {
  return {
    ObjectTypeDefinition(node) {
      const idField = node.fields?.find(
        (field: FieldDefinitionNode) => field.name.value === 'id',
      );
      if (idField && !isProperRelayIdField(idField)) {
        context.reportError(
          new ValidationError(
            'relay-id-field-type',
            `The "id" field on \`${node.name.value}\` must be a proper Relay ID field type, or renamed.`,
            [node],
          ),
        );
      }
    },
  };
}
