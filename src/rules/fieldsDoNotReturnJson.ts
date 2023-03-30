import type { ValidationContext, ASTVisitor } from 'graphql';

import { ValidationError } from 'graphql-schema-linter';
import {
  Configuration,
  getNodeName,
  unwrapAstNode,
  unwrapType,
} from '../utils';

export function FieldsDoNotReturnJson(
  configuration: Configuration,
  context: ValidationContext,
): ASTVisitor {
  return {
    FieldDefinition: (node, _key, _parent, _path, ancestors) => {
      const ruleKey = 'fields-do-not-return-json';
      const options = configuration.getRulesOptions()[ruleKey] || {};
      const customMessage = options.customMessage
        ? ' ' + options.customMessage
        : '';
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
            `The field \`${parentName}.${fieldName}\` is returning a JSON value.${customMessage}`,
            [node],
          ),
        );
      }
    },
  };
}
