import type { ValidationContext, ASTVisitor } from 'graphql';

import { ValidationError } from 'graphql-schema-linter';
import { getNodeName, unwrapAstNode, unwrapType } from '../utils';

export function FieldsDoNotReturnJson(context: ValidationContext): ASTVisitor {
  return {
    FieldDefinition: (node, _key, _parent, _path, ancestors) => {
      const fieldName = node.name.value;
      const fieldType = node.type;
      const lastAncestor = ancestors[ancestors.length - 1];
      const parentNode = lastAncestor ? unwrapAstNode(lastAncestor) : null;
      const parentName = parentNode ? getNodeName(parentNode) : 'root';
      const unwrappedFieldTypeStr = fieldType
        ? getNodeName(unwrapType(fieldType))
        : 'undefined';
      if (unwrappedFieldTypeStr == 'JSON') {
        context.reportError(
          new ValidationError(
            'fields-do-not-return-json',
            `Check the type of the \`${parentName}.${fieldName}\` in extensions and make sure that the value_type is not a Dict. You can type it using https://w.pinadmin.com/display/API/Conversion+Patterns.`,
            [node],
          ),
        );
      }
    },
  };
}
