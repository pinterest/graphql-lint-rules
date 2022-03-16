import {
  ASTVisitor,
  NamedTypeNode,
  ObjectTypeDefinitionNode,
  TypeDefinitionNode,
  ValidationContext,
} from 'graphql';

import { ValidationError } from '../utils';

export function RelayContainerReturnsConnection(
  context: ValidationContext,
): ASTVisitor {
  const ensureNameDoesNotEndWithContainer = (node: TypeDefinitionNode) => {
    if (node.name.value.match(/ConnectionContainer$/)) {
      context.reportError(
        new ValidationError(
          'relay-connection-types-spec-pinterest-customization',
          `Types that end in \`Connection\` must be an object type as per the relay spec. \`${node.name.value}\` is not an object type.`,
          [node],
        ),
      );
    }
  };

  return {
    ScalarTypeDefinition: ensureNameDoesNotEndWithContainer,
    InterfaceTypeDefinition: ensureNameDoesNotEndWithContainer,
    UnionTypeDefinition: ensureNameDoesNotEndWithContainer,
    EnumTypeDefinition: ensureNameDoesNotEndWithContainer,
    InputObjectTypeDefinition: ensureNameDoesNotEndWithContainer,
    ObjectTypeDefinition(node: ObjectTypeDefinitionNode) {
      const typeName = node.name.value;
      if (!typeName.endsWith('Container')) {
        return;
      }

      const returnsConnection = node.fields?.every((field) =>
        (field.type as NamedTypeNode).name.value.endsWith('Connection'),
      );

      if (!returnsConnection) {
        context.reportError(
          new ValidationError(
            'relay-container-returns-connection',
            `The \`${typeName}\` Container must return a Connection.`,
            [node],
          ),
        );
        return;
      }
    },
  };
}
