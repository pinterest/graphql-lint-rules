import {
  FieldDefinitionNode,
  GraphQLCompositeType,
  typeFromAST,
  ValidationContext,
  ASTVisitor,
} from 'graphql';

import {
  isAllowedByDirective,
  isGraphQLCompositeType,
  isNamedTypeNode,
  isNonNullTypeNode,
  getNodeName,
  ValidationError,
  unwrapAstNode,
} from '../utils';


function isAllowedNonNullCompositeField(
  node: FieldDefinitionNode,
  type: GraphQLCompositeType,
): boolean {
  // allowlist
  if (type.name === 'PageInfo') {
    return true;
  }

  // directive-based
  return isAllowedByDirective(node, 'allowNonNull');
}

export function CompositeFieldsAreNullable(
  context: ValidationContext,
): ASTVisitor {
  return {
    FieldDefinition: (node, _key, _parent, _path, ancestors) => {
      const { type: nodeType } = node;
      if (isNonNullTypeNode(nodeType)) {
        const { type: nonNullType } = nodeType;
        if (isNamedTypeNode(nonNullType)) {
          const type = typeFromAST(context.getSchema(), nonNullType);
          if (isGraphQLCompositeType(type) && !isAllowedNonNullCompositeField(node, type)) {
            const lastAncestor = ancestors[ancestors.length - 1];
            const parentNode = lastAncestor ? unwrapAstNode(lastAncestor) : null;
            const parentName = parentNode ? getNodeName(parentNode) : 'root';
            context.reportError(
              new ValidationError(
                'composite-fields-are-nullable',
                `The field \`${parentName}.${node.name.value}\` uses a composite type and should be nullable.`,
                [node],
              ),
            );
          }
        }
      }
    },
  };
}
