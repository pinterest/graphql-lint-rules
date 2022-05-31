import type { ValidationContext, ASTVisitor } from 'graphql';

import { ValidationError } from 'graphql-schema-linter';
import { getNodeName, unwrapAstNode } from '../utils';

const validGraphQLNameTest = RegExp('^[_a-z][a-zA-Z0-9]*$');

export function FieldsCamelCasedOptionalStartingUnderscore(
  context: ValidationContext,
): ASTVisitor {
  return {
    FieldDefinition: (node, _key, _parent, _path, ancestors) => {
      const fieldName = node.name.value;
      if (!validGraphQLNameTest.test(fieldName)) {
        const lastAncestor = ancestors[ancestors.length - 1];
        const parentNode = lastAncestor ? unwrapAstNode(lastAncestor) : null;
        const parentName = parentNode ? getNodeName(parentNode) : 'root';
        context.reportError(
          new ValidationError(
            'fields-camel-cased-optional-starting-underscore',
            `The field \`${parentName}.${fieldName}\` is not camel-cased or starts with underscore.`,
            [node],
          ),
        );
      }
    },
  };
}
