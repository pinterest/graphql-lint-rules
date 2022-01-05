import {
  FieldDefinitionNode,
  GraphQLCompositeType,
  typeFromAST,
  ValidationContext,
  ASTVisitor,
} from 'graphql';

import {
  Configuration,
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
  exceptions: Array<string>,
): boolean {
  // exceptions
  if (exceptions.includes(type.name)) {
    return true;
  }

  // directive-based
  return isAllowedByDirective(node, 'allowNonNull');
}

export function CompositeFieldsAreNullable(
  configuration: Configuration,
  context: ValidationContext,
): ASTVisitor {
  return {
    FieldDefinition: (node, _key, _parent, _path, ancestors) => {
      const { type: nodeType } = node;
      const ruleKey = 'composite-fields-are-nullable';
      if (isNonNullTypeNode(nodeType)) {
        const { type: nonNullType } = nodeType;
        if (isNamedTypeNode(nonNullType)) {
          const type = typeFromAST(context.getSchema(), nonNullType);
          const options = configuration.getRulesOptions()[ruleKey] || {};
          const exceptions = options.exceptions || [];
          if (
            isGraphQLCompositeType(type) &&
            !isAllowedNonNullCompositeField(node, type, exceptions)
          ) {
            const lastAncestor = ancestors[ancestors.length - 1];
            const parentNode = lastAncestor
              ? unwrapAstNode(lastAncestor)
              : null;
            const parentName = parentNode ? getNodeName(parentNode) : 'root';
            context.reportError(
              new ValidationError(
                ruleKey,
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
